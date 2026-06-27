"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, Clock, MessageCircle, Scissors } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { formatOmr, spaServices, spaSlots, spaStaff } from "@/lib/platform";

const copy = {
  en: {
    title: "Luna Spa Booking Suite",
    subtitle: "Service catalog, staff availability, appointment booking, schedule board, and WhatsApp automation preview in one operational demo.",
    service: "Service",
    staff: "Staff member",
    date: "Date",
    time: "Time",
    name: "Customer name",
    phone: "WhatsApp phone",
    notes: "Notes",
    book: "Book appointment",
    confirmed: "Appointment confirmed and written to admin.",
    unavailable: "That staff/time is already booked in this demo session.",
    bookingStatus: "Booking status",
    reschedule: "Reschedule",
    cancel: "Cancel",
    complete: "Mark completed",
    schedule: "Live schedule board",
    whatsapp: "WhatsApp automation preview",
  },
  ar: {
    title: "نظام حجوزات لونا سبا",
    subtitle: "كتالوج خدمات وتوفر موظفين وحجز مواعيد ولوحة جدول وعرض رسائل واتساب في نظام واحد.",
    service: "الخدمة",
    staff: "الموظفة",
    date: "التاريخ",
    time: "الوقت",
    name: "اسم العميل",
    phone: "رقم واتساب",
    notes: "ملاحظات",
    book: "احجز الموعد",
    confirmed: "تم تأكيد الموعد وإرساله للوحة الإدارة.",
    unavailable: "هذا الوقت محجوز لنفس الموظفة في هذه الجلسة.",
    bookingStatus: "حالة الحجز",
    reschedule: "إعادة جدولة",
    cancel: "إلغاء",
    complete: "تمت الزيارة",
    schedule: "لوحة الجدول المباشر",
    whatsapp: "معاينة أتمتة واتساب",
  },
} as const;

export default function SpaDemo({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [serviceId, setServiceId] = useState(spaServices[0].id);
  const [staffId, setStaffId] = useState(spaStaff[0].id);
  const [slot, setSlot] = useState(spaSlots[2]);
  const [form, setForm] = useState({
    customerName: "Noor Al Balushi",
    phone: "+968 9111 2222",
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    notes: "Prefers quiet room",
  });
  const [booking, setBooking] = useState<any>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const slotKey = `${staffId}-${form.date}-${slot}`;

  const service = spaServices.find((item) => item.id === serviceId) ?? spaServices[0];
  const staff = spaStaff.find((item) => item.id === staffId) ?? spaStaff[0];
  const schedule = useMemo(
    () => [
      { time: "09:30", staff: "Mira", service: "Signature Massage", status: "Confirmed" },
      { time: "10:30", staff: "Salma", service: "Hydra Facial", status: "Checked in" },
      { time: "14:00", staff: "Huda", service: "Moroccan Bath", status: "Reminder sent" },
      ...(booking
        ? [
            {
              time: booking.time,
              staff: booking.staffName,
              service: booking.serviceName,
              status: "New web booking",
            },
          ]
        : []),
    ],
    [booking]
  );

  async function submit() {
    if (bookedSlots.includes(slotKey)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    const res = await fetch("/api/demo/spa/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        serviceId: service.id,
        serviceName: service.name[locale],
        staffId: staff.id,
        staffName: staff.name,
        time: slot,
        locale,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setBooking(data.appointment);
    setBookedSlots((current) => Array.from(new Set([...current, slotKey])));
    setStatus("success");
  }

  async function updateBooking(nextStatus: "confirmed" | "rescheduled" | "cancelled" | "completed") {
    if (!booking?.id) return;
    const res = await fetch("/api/demo/spa/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appointmentId: booking.id,
        status: nextStatus,
        date: form.date,
        time: slot,
        message:
          nextStatus === "rescheduled"
            ? `Your appointment was rescheduled to ${form.date} at ${slot}.`
            : `Your appointment status is now ${nextStatus}.`,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setBooking(data.appointment);
      if (nextStatus === "rescheduled") {
        setBookedSlots((current) => Array.from(new Set([...current, slotKey])));
      }
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
          <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-rose-600 dark:text-rose-300">
            <Scissors className="h-4 w-4" />
            Appointment operations
          </div>
          <h2 className="mt-2 font-display text-4xl font-bold">{t.title}</h2>
          <p className="mt-3 text-[rgb(var(--text-muted))]">{t.subtitle}</p>

          <div className="mt-8 grid gap-4">
            <label className="text-sm font-medium">
              {t.service}
              <select
                value={serviceId}
                onChange={(event) => setServiceId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3"
              >
                {spaServices.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name[locale]} - {item.duration}m - {formatOmr(item.price, locale)}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
              {t.staff}
              <select
                value={staffId}
                onChange={(event) => setStaffId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3"
              >
                {spaStaff.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {item.specialty[locale]}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                {t.date}
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm({ ...form, date: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3"
                />
              </label>
              <label className="text-sm font-medium">
                {t.time}
                <select
                  value={slot}
                  onChange={(event) => setSlot(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3"
                >
                  {spaSlots.map((item) => (
                    <option key={item} disabled={bookedSlots.includes(`${staffId}-${form.date}-${item}`)}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                {t.name}
                <input
                  value={form.customerName}
                  onChange={(event) => setForm({ ...form, customerName: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3"
                />
              </label>
              <label className="text-sm font-medium">
                {t.phone}
                <input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  className="mt-2 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3"
                />
              </label>
            </div>

            <label className="text-sm font-medium">
              {t.notes}
              <textarea
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                rows={3}
                className="mt-2 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3"
              />
            </label>

            <button
              onClick={submit}
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              <CalendarDays className="h-4 w-4" />
              {status === "loading" ? "..." : t.book}
            </button>
            {status === "success" && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
                <Check className="h-4 w-4" />
                {t.confirmed}
              </div>
            )}
            {status === "error" && (
              <div className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-600 dark:text-rose-300">
                {t.unavailable}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-rose-500" />
              <h3 className="font-display text-2xl font-bold">{t.schedule}</h3>
            </div>
            <div className="mt-5 grid gap-3">
              {schedule.map((item, index) => (
                <div
                  key={`${item.time}-${index}`}
                  className="grid gap-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] p-4 sm:grid-cols-[80px_1fr_140px]"
                >
                  <div className="font-display text-xl font-bold">{item.time}</div>
                  <div>
                    <div className="font-semibold">{item.service}</div>
                    <div className="text-sm text-[rgb(var(--text-muted))]">{item.staff}</div>
                  </div>
                  <div className="text-sm font-medium text-rose-600 dark:text-rose-300">
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[rgb(var(--border))] bg-[#0b141a] p-6 text-white">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-400" />
              <h3 className="font-display text-2xl font-bold">{t.whatsapp}</h3>
            </div>
            <div className="mt-5 space-y-3">
              {(booking?.messages || [
                { body: "Hi Noor, your Hydra Facial is confirmed for tomorrow at 12:00." },
                { body: "Reminder will be sent automatically 4 hours before your visit." },
                { body: "After the appointment, the bot asks for feedback and offers rebooking." },
              ]).map((message: { body: string }, index: number) => (
                <div
                  key={`${message.body}-${index}`}
                  className="ml-auto max-w-[85%] rounded-lg bg-[#005c4b] px-4 py-3 text-sm leading-6 shadow"
                >
                  {message.body}
                </div>
              ))}
            </div>
          </section>

          {booking && (
            <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
              <h3 className="font-display text-2xl font-bold">{t.bookingStatus}</h3>
              <div className="mt-3 rounded-lg bg-[rgb(var(--surface-2))] p-4 text-sm">
                <div className="font-semibold">{booking.customerName}</div>
                <div className="text-[rgb(var(--text-muted))]">
                  {booking.serviceName} - {booking.date} {booking.time}
                </div>
                <div className="mt-2 font-medium text-rose-600 dark:text-rose-300">
                  {booking.status}
                </div>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <button
                  onClick={() => updateBooking("rescheduled")}
                  className="rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold"
                >
                  {t.reschedule}
                </button>
                <button
                  onClick={() => updateBooking("cancelled")}
                  className="rounded-full border border-rose-500/40 px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-300"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => updateBooking("completed")}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  {t.complete}
                </button>
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
