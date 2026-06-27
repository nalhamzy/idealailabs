import { NextResponse } from "next/server";
import {
  createLead,
  createStoreOrder,
  recordDemoEvent,
  updateStoreOrder,
} from "@/lib/server/persistent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutItem = {
  id: string;
  name: string;
  quantity: number;
  unitAmount: number;
};

function thawaniConfig() {
  const apiKey = process.env.THAWANI_API_KEY || process.env.THAWANI_SECRET_KEY;
  const publishableKey =
    process.env.THAWANI_PUBLISHABLE_KEY || process.env.THAWANI_PUBLIC_KEY;
  const apiBase =
    process.env.THAWANI_BASE_URL || "https://uatcheckout.thawani.om/api/v1";
  const checkoutBase =
    process.env.THAWANI_CHECKOUT_URL ||
    process.env.THAWANI_CHECKOUT_BASE_URL ||
    "https://uatcheckout.thawani.om/pay";

  return { apiKey, publishableKey, apiBase, checkoutBase };
}

function toBaisa(omr: number) {
  return Math.round(Number(omr) * 1000);
}

async function createThawaniSession(input: {
  orderId: string;
  items: CheckoutItem[];
  successUrl: string;
  cancelUrl: string;
}) {
  const { apiKey, publishableKey, apiBase, checkoutBase } = thawaniConfig();
  if (!apiKey || !publishableKey) return null;

  const res = await fetch(`${apiBase.replace(/\/$/, "")}/checkout/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "thawani-api-key": apiKey,
    },
    body: JSON.stringify({
      client_reference_id: input.orderId,
      mode: "payment",
      products: input.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unit_amount: toBaisa(item.unitAmount),
      })),
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      metadata: {
        source: "idealailabs_store_demo",
        order_id: input.orderId,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`thawani_${res.status}_${errorText.slice(0, 120)}`);
  }

  const json = await res.json();
  const sessionId =
    json?.data?.session_id || json?.session_id || json?.data?.id || json?.id;
  if (!sessionId) throw new Error("thawani_missing_session_id");

  return {
    sessionId: String(sessionId),
    checkoutUrl: `${checkoutBase.replace(/\/$/, "")}/${sessionId}?key=${publishableKey}`,
  };
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const items = Array.isArray(body.items) ? (body.items as CheckoutItem[]) : [];
  const customer = body.customer || {};
  const locale = String(body.locale || "en");

  if (!items.length || !customer.name || !customer.email) {
    return NextResponse.json({ error: "missing_checkout_fields" }, { status: 400 });
  }

  const safeItems = items.map((item) => ({
    id: String(item.id),
    name: String(item.name),
    quantity: Math.max(1, Number(item.quantity) || 1),
    unitAmount: Math.max(0, Number(item.unitAmount) || 0),
  }));
  const total = safeItems.reduce(
    (sum, item) => sum + item.quantity * item.unitAmount,
    0
  );

  const order = await createStoreOrder({
    customer: {
      name: String(customer.name),
      email: String(customer.email),
      phone: customer.phone ? String(customer.phone) : undefined,
      area: customer.area ? String(customer.area) : undefined,
    },
    items: safeItems,
    total,
    status: "pending_payment",
    paymentProvider: thawaniConfig().apiKey ? "thawani" : "demo",
  });

  await createLead({
    source: "store_demo_checkout",
    locale,
    name: String(customer.name),
    email: String(customer.email),
    phone: customer.phone ? String(customer.phone) : undefined,
    company: "Store demo visitor",
    businessType: "Retail / ecommerce",
    projectType: "Online store with Thawani",
    budget: "Not sure yet",
    timeline: "Demo checkout",
    preferredChannel: "WhatsApp",
    demoInterest: "Accessories store",
    message: `Store demo checkout for order ${order.id}, total OMR ${total.toFixed(3)}.`,
    consentWhatsApp: true,
  });

  const origin = new URL(req.url).origin;
  const successUrl = `${origin}/${locale}/demos/store?checkout=success&order=${order.id}`;
  const cancelUrl = `${origin}/${locale}/demos/store?checkout=cancelled&order=${order.id}`;

  try {
    const thawani = await createThawaniSession({
      orderId: order.id,
      items: safeItems,
      successUrl,
      cancelUrl,
    });

    if (thawani) {
      await updateStoreOrder(order.id, {
        paymentSessionId: thawani.sessionId,
        checkoutUrl: thawani.checkoutUrl,
      });
      await recordDemoEvent("store", "thawani_checkout_created", {
        orderId: order.id,
        sessionId: thawani.sessionId,
        total,
      });
      return NextResponse.json({
        ok: true,
        provider: "thawani",
        orderId: order.id,
        checkoutUrl: thawani.checkoutUrl,
      });
    }
  } catch (error) {
    await recordDemoEvent("store", "thawani_checkout_failed", {
      orderId: order.id,
      error: error instanceof Error ? error.message : "unknown_error",
    });
  }

  await recordDemoEvent("store", "demo_checkout_created", {
    orderId: order.id,
    total,
  });
  await updateStoreOrder(order.id, {
    status: "paid",
    checkoutUrl: successUrl,
  });

  return NextResponse.json({
    ok: true,
    provider: "demo",
    orderId: order.id,
    checkoutUrl: successUrl,
  });
}
