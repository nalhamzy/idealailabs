import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const RECIPIENT = process.env.CONTACT_RECIPIENT || "idealailabs@gmail.com";
const FROM =
  process.env.CONTACT_FROM || "Ideal Intelligence <onboarding@resend.dev>";

function esc(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      name,
      email,
      company,
      projectType,
      budget,
      message,
      locale,
    } = body as Record<string, string>;

    if (!name || !email || !message || !projectType) {
      return NextResponse.json(
        { error: "missing_required_fields" },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }
    if (String(message).length > 5000) {
      return NextResponse.json({ error: "message_too_long" }, { status: 400 });
    }

    const key = process.env.RESEND_API_KEY;
    if (!key) {
      // Dev fallback: log instead of failing.
      console.log("[contact] RESEND_API_KEY missing. Payload:", body);
      return NextResponse.json({ ok: true, devFallback: true });
    }

    const resend = new Resend(key);

    const html = `
      <div style="font-family:Inter,system-ui,sans-serif;color:#111;max-width:640px;margin:0 auto">
        <h2 style="margin:0 0 8px">New project inquiry</h2>
        <p style="color:#555;margin:0 0 20px;font-size:13px">Via idealailabs.com (locale: ${esc(locale || "en")})</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#666;width:140px">Name</td><td>${esc(name)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666">Company</td><td>${esc(company || "—")}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Project type</td><td>${esc(projectType)}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Budget</td><td>${esc(budget || "—")}</td></tr>
        </table>
        <h3 style="margin:24px 0 8px">Message</h3>
        <div style="white-space:pre-wrap;background:#f6f7f9;padding:16px;border-radius:8px;font-size:14px;line-height:1.6">${esc(message)}</div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: FROM,
      to: [RECIPIENT],
      replyTo: email,
      subject: `New inquiry — ${projectType} — ${name}`,
      html,
    });

    if (error) {
      console.error("[contact] resend error:", error);
      return NextResponse.json(
        { error: "email_send_failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] exception:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
