import { NextResponse } from "next/server";
import crypto from "crypto";
import { getWhatsAppConnectionByPhoneId } from "@/lib/server/persistent-store";

export const runtime = "nodejs";
// Webhooks must never be statically cached.
export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const APP_SECRET = process.env.WHATSAPP_APP_SECRET;
const GRAPH = `https://graph.facebook.com/${process.env.WHATSAPP_GRAPH_VERSION || "v23.0"}`;

// ── GET: Meta's subscription handshake ────────────────────────────────────────
// Meta calls this once with hub.challenge when you save the webhook URL. Echo the
// challenge back ONLY if the verify token matches the one you set in the console.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && VERIFY_TOKEN && token === VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

// HMAC-SHA256 of the RAW body, compared timing-safely to X-Hub-Signature-256.
function verifySignature(raw: string, signature: string | null): boolean {
  if (!APP_SECRET || !signature) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", APP_SECRET).update(raw).digest("hex");
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function sendText(phoneNumberId: string, token: string, to: string, body: string) {
  return fetch(`${GRAPH}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to, type: "text", text: { body } }),
  });
}

async function markRead(phoneNumberId: string, token: string, messageId: string) {
  return fetch(`${GRAPH}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", status: "read", message_id: messageId }),
  }).catch(() => {});
}

// ── The reply brain ───────────────────────────────────────────────────────────
// Starter bilingual logic. Swap this for an AI call (studio default = Claude;
// you can also use OPENAI_API_KEY). Keep it fast — Meta retries if we're slow.
async function generateReply(text: string, businessName?: string): Promise<string> {
  const t = (text || "").trim();
  if (!t) {
    return "أرسل لنا رسالة نصية وسنساعدك. / Send us a text message and we'll help.";
  }
  if (/^(hi|hello|hey|مرحبا|السلام|اهلا|أهلا|هلا)/i.test(t)) {
    return `مرحبًا بك في ${businessName || "خدمتنا"} 👋 كيف يمكنني مساعدتك اليوم؟\nHi! How can I help you today?`;
  }
  return `شكرًا لرسالتك! سنرد عليك في أقرب وقت.\nThanks for your message — we'll reply shortly.`;
}

// ── POST: inbound events (messages + statuses) ────────────────────────────────
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new Response("invalid signature", { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true });
  }

  // Acknowledge fast; process best-effort. Non-200 makes Meta retry the delivery.
  try {
    for (const entry of payload?.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value || {};
        const phoneNumberId: string | undefined = value?.metadata?.phone_number_id;
        const messages: any[] = value?.messages || [];
        if (!phoneNumberId || messages.length === 0) continue; // ignore status callbacks

        // Route to the right connected client by the number that received the message.
        const conn = await getWhatsAppConnectionByPhoneId(phoneNumberId);
        if (!conn?.accessToken) {
          console.warn("[wa-webhook] no connection/token for phone_number_id", phoneNumberId);
          continue;
        }

        for (const msg of messages) {
          const from: string = msg.from;
          const text: string =
            msg.text?.body ||
            msg.button?.text ||
            msg.interactive?.list_reply?.title ||
            msg.interactive?.button_reply?.title ||
            "";
          try {
            await markRead(phoneNumberId, conn.accessToken, msg.id);
            const reply = await generateReply(text, conn.businessName);
            await sendText(phoneNumberId, conn.accessToken, from, reply);
          } catch (e) {
            console.error("[wa-webhook] reply error:", e);
          }
        }
      }
    }
  } catch (e) {
    console.error("[wa-webhook] processing error:", e);
  }

  return NextResponse.json({ ok: true });
}
