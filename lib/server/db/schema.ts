import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import type { AdminNote, DemoEvent, StoreOrder, SpaAppointment } from "../persistent-store";

// Durable store for idealailabs (libSQL: local file in dev → Turso in prod).
// Column JS-keys mirror the persistent-store TS types so mapping stays trivial.

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  source: text("source").notNull(),
  locale: text("locale").notNull().default("en"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  businessType: text("business_type"),
  projectType: text("project_type").notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  preferredChannel: text("preferred_channel"),
  demoInterest: text("demo_interest"),
  message: text("message").notNull(),
  consentWhatsApp: integer("consent_whatsapp", { mode: "boolean" }),
  status: text("status").notNull().default("new"),
  priority: text("priority").notNull().default("normal"),
  assignedTo: text("assigned_to"),
  notes: text("notes", { mode: "json" }).$type<AdminNote[]>().notNull().default([]),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const demoEvents = sqliteTable("demo_events", {
  id: text("id").primaryKey(),
  demoKey: text("demo_key").notNull(),
  type: text("type").notNull(),
  payload: text("payload", { mode: "json" }).$type<DemoEvent["payload"]>().notNull().default({}),
  createdAt: text("created_at").notNull(),
});

export const storeOrders = sqliteTable("store_orders", {
  id: text("id").primaryKey(),
  customer: text("customer", { mode: "json" }).$type<StoreOrder["customer"]>().notNull(),
  items: text("items", { mode: "json" }).$type<StoreOrder["items"]>().notNull().default([]),
  total: real("total").notNull().default(0),
  status: text("status").notNull().default("pending_payment"),
  paymentProvider: text("payment_provider").notNull().default("demo"),
  paymentSessionId: text("payment_session_id"),
  checkoutUrl: text("checkout_url"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const whatsappConnections = sqliteTable("whatsapp_connections", {
  id: text("id").primaryKey(),
  wabaId: text("waba_id").notNull(),
  phoneNumberId: text("phone_number_id").notNull(),
  displayPhoneNumber: text("display_phone_number"),
  businessName: text("business_name"),
  // Long-lived business token for this client's WABA. Server-only — never sent to
  // the browser, never returned in admin listings. Move to a KMS before scaling.
  accessToken: text("access_token").notNull(),
  status: text("status").notNull().default("connected"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const spaAppointments = sqliteTable("spa_appointments", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  serviceId: text("service_id").notNull(),
  serviceName: text("service_name").notNull(),
  staffId: text("staff_id").notNull(),
  staffName: text("staff_name").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  notes: text("notes"),
  status: text("status").notNull().default("confirmed"),
  messages: text("messages", { mode: "json" }).$type<SpaAppointment["messages"]>().notNull().default([]),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
