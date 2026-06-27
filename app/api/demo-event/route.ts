import { NextResponse } from "next/server";
import { recordDemoEvent } from "@/lib/server/persistent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const demoKey = String(body.demoKey || "unknown");
  const type = String(body.type || "interaction");
  const payload =
    body.payload && typeof body.payload === "object"
      ? (body.payload as Record<string, unknown>)
      : {};

  const event = await recordDemoEvent(demoKey, type, payload);
  return NextResponse.json({ ok: true, eventId: event.id });
}
