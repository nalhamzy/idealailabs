import { NextResponse } from "next/server";
import {
  createLead,
  createSpaAppointment,
  recordDemoEvent,
} from "@/lib/server/persistent-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const required = ["customerName", "phone", "serviceId", "serviceName", "staffId", "staffName", "date", "time"];
  const missing = required.filter((key) => !body[key]);
  if (missing.length) {
    return NextResponse.json({ error: "missing_booking_fields", missing }, { status: 400 });
  }

  const appointment = await createSpaAppointment({
    customerName: String(body.customerName),
    phone: String(body.phone),
    serviceId: String(body.serviceId),
    serviceName: String(body.serviceName),
    staffId: String(body.staffId),
    staffName: String(body.staffName),
    date: String(body.date),
    time: String(body.time),
    notes: body.notes ? String(body.notes) : undefined,
  });

  await createLead({
    source: "spa_demo_booking",
    locale: String(body.locale || "en"),
    name: String(body.customerName),
    email: body.email ? String(body.email) : "spa-demo@idealailabs.com",
    phone: String(body.phone),
    company: "Spa demo visitor",
    businessType: "Appointments / services",
    projectType: "Appointment system with WhatsApp",
    budget: "Not sure yet",
    timeline: "Demo booking",
    preferredChannel: "WhatsApp",
    demoInterest: "Spa appointment system",
    message: `Booked ${appointment.serviceName} with ${appointment.staffName} on ${appointment.date} at ${appointment.time}.`,
    consentWhatsApp: true,
  });

  await recordDemoEvent("spa", "appointment_booked", {
    appointmentId: appointment.id,
    serviceId: appointment.serviceId,
    staffId: appointment.staffId,
    date: appointment.date,
    time: appointment.time,
  });

  return NextResponse.json({ ok: true, appointment });
}
