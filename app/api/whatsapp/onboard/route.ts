import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createWhatsAppConnection } from "@/lib/server/persistent-store";

export const runtime = "nodejs";

const APP_ID = process.env.NEXT_PUBLIC_WA_APP_ID || "1666901441099073";
const APP_SECRET = process.env.WHATSAPP_APP_SECRET;
const GRAPH = `https://graph.facebook.com/${process.env.WHATSAPP_GRAPH_VERSION || "v23.0"}`;
const RECIPIENT = process.env.CONTACT_RECIPIENT || "idealailabs@gmail.com";
const FROM = process.env.CONTACT_FROM || "Ideal Intelligence <onboarding@resend.dev>";

// Embedded Signup completes in the browser with a short-lived authorization `code`.
// We exchange it for the client's long-lived business token HERE (server-side only,
// because it requires the App Secret), then subscribe our app to their WABA so
// inbound messages start flowing to our webhook.
export async function POST(req: Request) {
  try {
    if (!APP_SECRET) {
      console.error("[wa-onboard] WHATSAPP_APP_SECRET not set");
      return NextResponse.json({ error: "server_not_configured" }, { status: 500 });
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, string>;
    const { code, waba_id, phone_number_id } = body;
    if (!code) return NextResponse.json({ error: "missing_code" }, { status: 400 });

    // 1) code → client business access token
    const tokenRes = await fetch(
      `${GRAPH}/oauth/access_token` +
        `?client_id=${encodeURIComponent(APP_ID)}` +
        `&client_secret=${encodeURIComponent(APP_SECRET)}` +
        `&code=${encodeURIComponent(code)}`,
      { method: "GET" }
    );
    const tokenJson = (await tokenRes.json().catch(() => ({}))) as {
      access_token?: string;
      error?: unknown;
    };
    if (!tokenRes.ok || !tokenJson.access_token) {
      console.error("[wa-onboard] token exchange failed:", tokenJson);
      return NextResponse.json({ error: "token_exchange_failed" }, { status: 502 });
    }
    const accessToken = tokenJson.access_token;

    // 2) Best-effort: read number details + subscribe our app to the client's WABA.
    //    Failures here don't block storing the connection — we log and continue.
    let displayPhoneNumber: string | undefined;
    let businessName: string | undefined;
    try {
      if (phone_number_id) {
        const n = (await fetch(
          `${GRAPH}/${phone_number_id}?fields=display_phone_number,verified_name`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        ).then((r) => r.json())) as { display_phone_number?: string; verified_name?: string };
        displayPhoneNumber = n.display_phone_number;
        businessName = n.verified_name;
      }
      if (waba_id) {
        await fetch(`${GRAPH}/${waba_id}/subscribed_apps`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
    } catch (e) {
      console.warn("[wa-onboard] post-connect setup warning:", e);
    }

    // 3) Persist the connection (token stored server-side only).
    const conn = await createWhatsAppConnection({
      wabaId: waba_id || "",
      phoneNumberId: phone_number_id || "",
      displayPhoneNumber,
      businessName,
      accessToken,
    });

    // 4) Notify the team — never include the token in the email.
    const key = process.env.RESEND_API_KEY;
    if (key) {
      const resend = new Resend(key);
      await resend.emails
        .send({
          from: FROM,
          to: [RECIPIENT],
          subject: `New WhatsApp client connected — ${
            businessName || displayPhoneNumber || waba_id || conn.id
          }`,
          html: `<div style="font-family:system-ui,sans-serif;max-width:560px">
            <h2 style="margin:0 0 12px">New WhatsApp client connected ✅</h2>
            <table style="font-size:14px;border-collapse:collapse">
              <tr><td style="color:#666;padding:4px 12px 4px 0">Business</td><td><b>${businessName || "-"}</b></td></tr>
              <tr><td style="color:#666;padding:4px 12px 4px 0">Number</td><td>${displayPhoneNumber || "-"}</td></tr>
              <tr><td style="color:#666;padding:4px 12px 4px 0">WABA ID</td><td>${waba_id || "-"}</td></tr>
              <tr><td style="color:#666;padding:4px 12px 4px 0">Phone number ID</td><td>${phone_number_id || "-"}</td></tr>
              <tr><td style="color:#666;padding:4px 12px 4px 0">Connection ID</td><td>${conn.id}</td></tr>
            </table>
          </div>`,
        })
        .catch((e) => console.error("[wa-onboard] resend error:", e));
    } else {
      console.log("[wa-onboard] connected:", conn.id, businessName, displayPhoneNumber);
    }

    return NextResponse.json({ ok: true, connectionId: conn.id });
  } catch (e) {
    console.error("[wa-onboard] exception:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
