import { NextResponse } from "next/server";
import { isAdminRequest, resetDemoData } from "@/lib/server/persistent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const mode = String(body.mode || "seed");
  const data = await resetDemoData(mode !== "clear");
  return NextResponse.json({
    ok: true,
    mode,
    counts: {
      leads: data.leads.length,
      events: data.events.length,
      storeOrders: data.storeOrders.length,
      spaAppointments: data.spaAppointments.length,
    },
  });
}
