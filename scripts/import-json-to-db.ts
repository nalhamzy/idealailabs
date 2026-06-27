/**
 * One-time migration: import the legacy .data/idealailabs-store.json into the DB.
 * Idempotent (onConflictDoNothing by id) — safe to run more than once.
 *   npm run db:import
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { readFile } from "fs/promises";
import path from "path";
import { db } from "../lib/server/db/client";
import { leads, demoEvents, storeOrders, spaAppointments } from "../lib/server/db/schema";

async function main() {
  const file = path.join(process.cwd(), ".data", "idealailabs-store.json");
  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    console.log("No .data/idealailabs-store.json found — nothing to import.");
    return;
  }
  const data = JSON.parse(raw) as {
    leads?: any[];
    events?: any[];
    storeOrders?: any[];
    spaAppointments?: any[];
  };
  const counts = { leads: 0, events: 0, orders: 0, appts: 0 };

  for (const l of data.leads ?? []) {
    await db
      .insert(leads)
      .values({
        id: l.id,
        source: l.source,
        locale: l.locale ?? "en",
        name: l.name,
        email: l.email,
        phone: l.phone ?? null,
        company: l.company ?? null,
        businessType: l.businessType ?? null,
        projectType: l.projectType,
        budget: l.budget ?? null,
        timeline: l.timeline ?? null,
        preferredChannel: l.preferredChannel ?? null,
        demoInterest: l.demoInterest ?? null,
        message: l.message,
        consentWhatsApp: l.consentWhatsApp ?? null,
        status: l.status ?? "new",
        priority: l.priority ?? "normal",
        assignedTo: l.assignedTo ?? null,
        notes: l.notes ?? [],
        createdAt: l.createdAt,
        updatedAt: l.updatedAt ?? l.createdAt,
      })
      .onConflictDoNothing();
    counts.leads++;
  }

  for (const e of data.events ?? []) {
    await db.insert(demoEvents).values({
      id: e.id,
      demoKey: e.demoKey,
      type: e.type,
      payload: e.payload ?? {},
      createdAt: e.createdAt,
    }).onConflictDoNothing();
    counts.events++;
  }

  for (const o of data.storeOrders ?? []) {
    await db.insert(storeOrders).values({
      id: o.id,
      customer: o.customer,
      items: o.items ?? [],
      total: o.total ?? 0,
      status: o.status ?? "pending_payment",
      paymentProvider: o.paymentProvider ?? "demo",
      paymentSessionId: o.paymentSessionId ?? null,
      checkoutUrl: o.checkoutUrl ?? null,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt ?? o.createdAt,
    }).onConflictDoNothing();
    counts.orders++;
  }

  for (const a of data.spaAppointments ?? []) {
    await db.insert(spaAppointments).values({
      id: a.id,
      customerName: a.customerName,
      phone: a.phone,
      serviceId: a.serviceId,
      serviceName: a.serviceName,
      staffId: a.staffId,
      staffName: a.staffName,
      date: a.date,
      time: a.time,
      notes: a.notes ?? null,
      status: a.status ?? "confirmed",
      messages: a.messages ?? [],
      createdAt: a.createdAt,
      updatedAt: a.updatedAt ?? a.createdAt,
    }).onConflictDoNothing();
    counts.appts++;
  }

  console.log("✅ Imported (skipping existing):", counts);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Import failed:", err);
    process.exit(1);
  });
