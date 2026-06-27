import { NextResponse } from "next/server";
import {
  getStoreOrder,
  recordDemoEvent,
  updateStoreOrder,
} from "@/lib/server/persistent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function thawaniConfig() {
  const apiKey = process.env.THAWANI_API_KEY || process.env.THAWANI_SECRET_KEY;
  const apiBase =
    process.env.THAWANI_BASE_URL || "https://uatcheckout.thawani.om/api/v1";
  return { apiKey, apiBase };
}

function mapPaymentStatus(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "paid") return "paid";
  if (normalized === "cancelled" || normalized === "canceled") return "cancelled";
  return "pending_payment";
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const orderId = String(body.orderId || "");
  const order = await getStoreOrder(orderId);
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const sessionId = String(body.sessionId || order.paymentSessionId || "");

  if (!orderId) {
    return NextResponse.json({ error: "missing_order_id" }, { status: 400 });
  }

  const { apiKey, apiBase } = thawaniConfig();
  if (!apiKey || !sessionId) {
    const updatedOrder = await updateStoreOrder(orderId, {
      status: order.paymentProvider === "demo" ? "paid" : order.status,
    });
    await recordDemoEvent("store", "demo_payment_reconciled", { orderId });
    return NextResponse.json({ ok: true, provider: order.paymentProvider, order: updatedOrder });
  }

  const res = await fetch(`${apiBase.replace(/\/$/, "")}/checkout/session/${sessionId}`, {
    headers: { "thawani-api-key": apiKey },
  });
  if (!res.ok) {
    return NextResponse.json({ error: "thawani_status_failed" }, { status: 502 });
  }

  const json = await res.json();
  const paymentStatus =
    json?.data?.payment_status ||
    json?.data?.status ||
    json?.payment_status ||
    json?.status ||
    "unpaid";
  const updatedOrder = await updateStoreOrder(orderId, {
    status: mapPaymentStatus(String(paymentStatus)),
    paymentSessionId: sessionId,
  });
  await recordDemoEvent("store", "thawani_payment_reconciled", {
    orderId,
    sessionId,
    paymentStatus,
  });

  return NextResponse.json({ ok: true, provider: "thawani", paymentStatus, order: updatedOrder });
}
