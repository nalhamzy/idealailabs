import { NextResponse } from "next/server";
import {
  isAdminRequest,
  updateSpaAppointment,
  type SpaAppointment,
} from "@/lib/server/persistent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const appointment = await updateSpaAppointment(id, {
    status: body.status as SpaAppointment["status"] | undefined,
    date: body.date,
    time: body.time,
    notes: body.notes,
    message: body.message,
  });
  if (!appointment) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ appointment });
}
