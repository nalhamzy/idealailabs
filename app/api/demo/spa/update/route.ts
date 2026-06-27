import { NextResponse } from "next/server";
import {
  recordDemoEvent,
  updateSpaAppointment,
  type SpaAppointment,
} from "@/lib/server/persistent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const appointmentId = String(body.appointmentId || "");
  if (!appointmentId) {
    return NextResponse.json({ error: "missing_appointment_id" }, { status: 400 });
  }

  const appointment = await updateSpaAppointment(appointmentId, {
    status: body.status as SpaAppointment["status"] | undefined,
    date: body.date,
    time: body.time,
    message: body.message,
  });

  if (!appointment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await recordDemoEvent("spa", "appointment_updated", {
    appointmentId,
    status: appointment.status,
    date: appointment.date,
    time: appointment.time,
  });

  return NextResponse.json({ ok: true, appointment });
}
