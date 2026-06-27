import { desc, eq } from "drizzle-orm";
import { db } from "./db/client";
import { leads, demoEvents, storeOrders, spaAppointments } from "./db/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Durable store backed by libSQL/Turso (was a .data JSON file — ephemeral on
// serverless). Public API and types are UNCHANGED so all call sites keep working.
// ─────────────────────────────────────────────────────────────────────────────

export type LeadStatus =
  | "new"
  | "qualified"
  | "contacted"
  | "proposal_sent"
  | "won"
  | "lost"
  | "spam";

export type LeadRecord = {
  id: string;
  source: string;
  locale: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  businessType?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  preferredChannel?: string;
  demoInterest?: string;
  message: string;
  consentWhatsApp?: boolean;
  status: LeadStatus;
  priority: "normal" | "high";
  assignedTo?: string;
  notes: AdminNote[];
  createdAt: string;
  updatedAt: string;
};

export type AdminNote = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export type DemoEvent = {
  id: string;
  demoKey: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type StoreOrder = {
  id: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    area?: string;
  };
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitAmount: number;
  }>;
  total: number;
  status: "draft" | "pending_payment" | "paid" | "cancelled" | "fulfilled";
  paymentProvider: "thawani" | "demo";
  paymentSessionId?: string;
  checkoutUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type SpaAppointment = {
  id: string;
  customerName: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  date: string;
  time: string;
  notes?: string;
  status: "requested" | "confirmed" | "rescheduled" | "cancelled" | "completed";
  messages: Array<{ id: string; body: string; channel: "web-whatsapp"; createdAt: string }>;
  createdAt: string;
  updatedAt: string;
};

export type StoredData = {
  leads: LeadRecord[];
  events: DemoEvent[];
  storeOrders: StoreOrder[];
  spaAppointments: SpaAppointment[];
};

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
}

// ── row → type mappers (null → undefined to match the public types) ───────────
function toLead(r: typeof leads.$inferSelect): LeadRecord {
  return {
    id: r.id,
    source: r.source,
    locale: r.locale,
    name: r.name,
    email: r.email,
    phone: r.phone ?? undefined,
    company: r.company ?? undefined,
    businessType: r.businessType ?? undefined,
    projectType: r.projectType,
    budget: r.budget ?? undefined,
    timeline: r.timeline ?? undefined,
    preferredChannel: r.preferredChannel ?? undefined,
    demoInterest: r.demoInterest ?? undefined,
    message: r.message,
    consentWhatsApp: r.consentWhatsApp ?? undefined,
    status: r.status as LeadStatus,
    priority: r.priority as "normal" | "high",
    assignedTo: r.assignedTo ?? undefined,
    notes: r.notes ?? [],
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

function toEvent(r: typeof demoEvents.$inferSelect): DemoEvent {
  return { id: r.id, demoKey: r.demoKey, type: r.type, payload: r.payload ?? {}, createdAt: r.createdAt };
}

function toOrder(r: typeof storeOrders.$inferSelect): StoreOrder {
  return {
    id: r.id,
    customer: r.customer,
    items: r.items ?? [],
    total: r.total,
    status: r.status as StoreOrder["status"],
    paymentProvider: r.paymentProvider as StoreOrder["paymentProvider"],
    paymentSessionId: r.paymentSessionId ?? undefined,
    checkoutUrl: r.checkoutUrl ?? undefined,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

function toAppointment(r: typeof spaAppointments.$inferSelect): SpaAppointment {
  return {
    id: r.id,
    customerName: r.customerName,
    phone: r.phone,
    serviceId: r.serviceId,
    serviceName: r.serviceName,
    staffId: r.staffId,
    staffName: r.staffName,
    date: r.date,
    time: r.time,
    notes: r.notes ?? undefined,
    status: r.status as SpaAppointment["status"],
    messages: r.messages ?? [],
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

// ── Leads ─────────────────────────────────────────────────────────────────
export async function createLead(
  payload: Omit<LeadRecord, "id" | "status" | "priority" | "notes" | "createdAt" | "updatedAt"> &
    Partial<Pick<LeadRecord, "status" | "priority">>
) {
  const createdAt = now();
  const lead: LeadRecord = {
    id: id("lead"),
    status: payload.status ?? "new",
    priority:
      payload.priority ?? (payload.timeline?.toLowerCase().includes("urgent") ? "high" : "normal"),
    notes: [],
    createdAt,
    updatedAt: createdAt,
    ...payload,
  };
  await db.insert(leads).values({
    id: lead.id,
    source: lead.source,
    locale: lead.locale,
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? null,
    company: lead.company ?? null,
    businessType: lead.businessType ?? null,
    projectType: lead.projectType,
    budget: lead.budget ?? null,
    timeline: lead.timeline ?? null,
    preferredChannel: lead.preferredChannel ?? null,
    demoInterest: lead.demoInterest ?? null,
    message: lead.message,
    consentWhatsApp: lead.consentWhatsApp ?? null,
    status: lead.status,
    priority: lead.priority,
    assignedTo: lead.assignedTo ?? null,
    notes: lead.notes,
    createdAt,
    updatedAt: createdAt,
  });
  return lead;
}

export async function listAdminData() {
  const [leadRows, eventRows, orderRows, apptRows] = await Promise.all([
    db.select().from(leads).orderBy(desc(leads.createdAt)),
    db.select().from(demoEvents).orderBy(desc(demoEvents.createdAt)),
    db.select().from(storeOrders).orderBy(desc(storeOrders.createdAt)),
    db.select().from(spaAppointments).orderBy(desc(spaAppointments.createdAt)),
  ]);
  const data: StoredData = {
    leads: leadRows.map(toLead),
    events: eventRows.map(toEvent),
    storeOrders: orderRows.map(toOrder),
    spaAppointments: apptRows.map(toAppointment),
  };
  return {
    ...data,
    stats: {
      leads: data.leads.length,
      newLeads: data.leads.filter((lead) => lead.status === "new").length,
      demoEvents: data.events.length,
      orders: data.storeOrders.length,
      appointments: data.spaAppointments.length,
      revenue: data.storeOrders
        .filter((order) => order.status === "paid" || order.status === "fulfilled")
        .reduce((sum, order) => sum + order.total, 0),
    },
  };
}

export async function updateLead(
  leadId: string,
  changes: Partial<Pick<LeadRecord, "status" | "priority" | "assignedTo">> & {
    note?: string;
    author?: string;
  }
) {
  const row = (await db.select().from(leads).where(eq(leads.id, leadId)).limit(1))[0];
  if (!row) return null;
  const lead = toLead(row);
  if (changes.status) lead.status = changes.status;
  if (changes.priority) lead.priority = changes.priority;
  if (Object.prototype.hasOwnProperty.call(changes, "assignedTo")) {
    lead.assignedTo = changes.assignedTo;
  }
  if (changes.note?.trim()) {
    lead.notes.unshift({ id: id("note"), author: changes.author || "Admin", body: changes.note.trim(), createdAt: now() });
  }
  lead.updatedAt = now();
  await db
    .update(leads)
    .set({
      status: lead.status,
      priority: lead.priority,
      assignedTo: lead.assignedTo ?? null,
      notes: lead.notes,
      updatedAt: lead.updatedAt,
    })
    .where(eq(leads.id, leadId));
  return lead;
}

// ── Demo events ─────────────────────────────────────────────────────────────
export async function recordDemoEvent(
  demoKey: string,
  type: string,
  payload: Record<string, unknown> = {}
) {
  const event: DemoEvent = { id: id("evt"), demoKey, type, payload, createdAt: now() };
  await db.insert(demoEvents).values(event);
  return event;
}

// ── Store orders ─────────────────────────────────────────────────────────────
export async function createStoreOrder(order: Omit<StoreOrder, "id" | "createdAt" | "updatedAt">) {
  const createdAt = now();
  const record: StoreOrder = { id: id("ord"), createdAt, updatedAt: createdAt, ...order };
  await db.insert(storeOrders).values({
    id: record.id,
    customer: record.customer,
    items: record.items,
    total: record.total,
    status: record.status,
    paymentProvider: record.paymentProvider,
    paymentSessionId: record.paymentSessionId ?? null,
    checkoutUrl: record.checkoutUrl ?? null,
    createdAt,
    updatedAt: createdAt,
  });
  return record;
}

export async function getStoreOrder(orderId: string) {
  const row = (await db.select().from(storeOrders).where(eq(storeOrders.id, orderId)).limit(1))[0];
  return row ? toOrder(row) : null;
}

export async function updateStoreOrder(
  orderId: string,
  changes: Partial<Pick<StoreOrder, "status" | "paymentSessionId" | "checkoutUrl">>
) {
  const row = (await db.select().from(storeOrders).where(eq(storeOrders.id, orderId)).limit(1))[0];
  if (!row) return null;
  const order = toOrder(row);
  if (changes.status) order.status = changes.status;
  if (changes.paymentSessionId) order.paymentSessionId = changes.paymentSessionId;
  if (changes.checkoutUrl) order.checkoutUrl = changes.checkoutUrl;
  order.updatedAt = now();
  await db
    .update(storeOrders)
    .set({
      status: order.status,
      paymentSessionId: order.paymentSessionId ?? null,
      checkoutUrl: order.checkoutUrl ?? null,
      updatedAt: order.updatedAt,
    })
    .where(eq(storeOrders.id, orderId));
  return order;
}

// ── Spa appointments ─────────────────────────────────────────────────────────
export async function createSpaAppointment(
  appointment: Omit<SpaAppointment, "id" | "status" | "messages" | "createdAt" | "updatedAt">
) {
  const createdAt = now();
  const record: SpaAppointment = {
    id: id("apt"),
    status: "confirmed",
    messages: [
      {
        id: id("msg"),
        channel: "web-whatsapp",
        body: `Confirmed: ${appointment.serviceName} with ${appointment.staffName} on ${appointment.date} at ${appointment.time}.`,
        createdAt,
      },
      {
        id: id("msg"),
        channel: "web-whatsapp",
        body: "Reminder scheduled 4 hours before the appointment. Reply 1 to confirm or 2 to reschedule.",
        createdAt,
      },
    ],
    createdAt,
    updatedAt: createdAt,
    ...appointment,
  };
  await db.insert(spaAppointments).values({
    id: record.id,
    customerName: record.customerName,
    phone: record.phone,
    serviceId: record.serviceId,
    serviceName: record.serviceName,
    staffId: record.staffId,
    staffName: record.staffName,
    date: record.date,
    time: record.time,
    notes: record.notes ?? null,
    status: record.status,
    messages: record.messages,
    createdAt,
    updatedAt: createdAt,
  });
  return record;
}

export async function updateSpaAppointment(
  appointmentId: string,
  changes: Partial<Pick<SpaAppointment, "status" | "date" | "time" | "notes">> & {
    message?: string;
  }
) {
  const row = (await db.select().from(spaAppointments).where(eq(spaAppointments.id, appointmentId)).limit(1))[0];
  if (!row) return null;
  const appointment = toAppointment(row);
  if (changes.status) appointment.status = changes.status;
  if (changes.date) appointment.date = changes.date;
  if (changes.time) appointment.time = changes.time;
  if (Object.prototype.hasOwnProperty.call(changes, "notes")) appointment.notes = changes.notes;
  if (changes.message?.trim()) {
    appointment.messages.unshift({ id: id("msg"), channel: "web-whatsapp", body: changes.message.trim(), createdAt: now() });
  }
  appointment.updatedAt = now();
  await db
    .update(spaAppointments)
    .set({
      status: appointment.status,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes ?? null,
      messages: appointment.messages,
      updatedAt: appointment.updatedAt,
    })
    .where(eq(spaAppointments.id, appointmentId));
  return appointment;
}

// ── Reset / seed ─────────────────────────────────────────────────────────────
export async function resetDemoData(seed = false) {
  await Promise.all([
    db.delete(leads),
    db.delete(demoEvents),
    db.delete(storeOrders),
    db.delete(spaAppointments),
  ]);
  if (!seed) return { leads: [], events: [], storeOrders: [], spaAppointments: [] } as StoredData;

  const createdAt = now();
  await db.insert(leads).values([
    {
      id: id("lead"), source: "seed_store_demo", locale: "en", name: "Maha Al Hinai", email: "maha@example.com",
      phone: "+968 9000 1234", company: "Nizwa Gifts", businessType: "Retail", projectType: "Online Store / Thawani",
      budget: "$5k - $15k", timeline: "This month", preferredChannel: "WhatsApp", demoInterest: "Store",
      message: "Seed lead: wants an accessories store with OMR checkout and WhatsApp order updates.",
      consentWhatsApp: true, status: "new", priority: "high", notes: [], createdAt, updatedAt: createdAt,
    },
    {
      id: id("lead"), source: "seed_spa_demo", locale: "en", name: "Noor Al Balushi", email: "noor@example.com",
      phone: "+968 9111 2222", company: "Luna Spa", businessType: "Spa / Clinic", projectType: "Appointment System",
      budget: "$5k - $15k", timeline: "1-3 months", preferredChannel: "WhatsApp", demoInterest: "Spa",
      message: "Seed lead: needs staff calendars, booking reminders, and reschedule automation.",
      consentWhatsApp: true, status: "qualified", priority: "normal", notes: [], createdAt, updatedAt: createdAt,
    },
  ]);
  await db.insert(storeOrders).values({
    id: id("ord"),
    customer: { name: "Aisha Al Rawahi", email: "aisha@example.com", phone: "+968 9444 1000", area: "Muscat" },
    items: [{ id: "muscat-tote", name: "Muscat Market Tote", quantity: 1, unitAmount: 39.5 }],
    total: 39.5, status: "paid", paymentProvider: "demo", createdAt, updatedAt: createdAt,
  });
  return (await listAdminData()) as unknown as StoredData;
}

// ── Admin auth (unchanged) ───────────────────────────────────────────────────
export function getAdminAccessKey() {
  return process.env.ADMIN_ACCESS_KEY || "demo-admin";
}

export function isAdminRequest(req: Request) {
  const configured = getAdminAccessKey();
  const provided = req.headers.get("x-admin-key") || "";
  return provided === configured;
}
