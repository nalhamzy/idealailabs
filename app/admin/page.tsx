"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Download,
  Inbox,
  LineChart,
  Lock,
  Package,
  RefreshCw,
  Save,
} from "lucide-react";

type Lead = {
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
  status: string;
  priority: string;
  assignedTo?: string;
  notes: Array<{ id: string; author: string; body: string; createdAt: string }>;
  createdAt: string;
};

type AdminData = {
  leads: Lead[];
  events: Array<{ id: string; demoKey: string; type: string; createdAt: string; payload: Record<string, unknown> }>;
  storeOrders: Array<{ id: string; total: number; status: string; paymentProvider: string; customer: { name: string; email: string }; createdAt: string }>;
  spaAppointments: Array<{ id: string; customerName: string; phone: string; serviceName: string; staffName: string; date: string; time: string; status: string }>;
  stats: { leads: number; newLeads: number; demoEvents: number; orders: number; appointments: number; revenue: number };
};

const statuses = ["new", "qualified", "contacted", "proposal_sent", "won", "lost", "spam"];
const orderStatuses = ["draft", "pending_payment", "paid", "cancelled", "fulfilled"];
const appointmentStatuses = ["requested", "confirmed", "rescheduled", "cancelled", "completed"];

export default function AdminPage() {
  const [accessKey, setAccessKey] = useState("");
  const [draftKey, setDraftKey] = useState("demo-admin");
  const [data, setData] = useState<AdminData | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("ideal_admin_key") || "";
    if (saved) {
      setAccessKey(saved);
      load(saved);
    }
  }, []);

  const selected = data?.leads.find((lead) => lead.id === selectedId) ?? data?.leads[0];
  const leads = useMemo(() => {
    const all = data?.leads ?? [];
    if (filter === "all") return all;
    return all.filter((lead) => lead.status === filter || lead.source === filter || lead.demoInterest === filter);
  }, [data, filter]);
  const filters = useMemo(() => {
    const values = new Set(["all", ...statuses]);
    data?.leads.forEach((lead) => {
      values.add(lead.source);
      if (lead.demoInterest) values.add(lead.demoInterest);
    });
    return Array.from(values);
  }, [data]);

  async function load(key = accessKey) {
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/overview", {
      headers: { "x-admin-key": key },
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(json.error || "Could not load admin data");
      return;
    }
    setData(json);
    if (!selectedId && json.leads?.[0]) setSelectedId(json.leads[0].id);
  }

  function login() {
    window.localStorage.setItem("ideal_admin_key", draftKey);
    setAccessKey(draftKey);
    load(draftKey);
  }

  async function updateLead(changes: Record<string, unknown>) {
    if (!selected) return;
    const res = await fetch(`/api/admin/leads/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": accessKey },
      body: JSON.stringify({ ...changes, note, author: "IdealAI Admin" }),
    });
    if (res.ok) {
      setNote("");
      await load();
    }
  }

  async function updateOrder(orderId: string, status: string) {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": accessKey },
      body: JSON.stringify({ status }),
    });
    if (res.ok) await load();
  }

  async function updateAppointment(appointmentId: string, status: string) {
    const res = await fetch(`/api/admin/appointments/${appointmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": accessKey },
      body: JSON.stringify({
        status,
        message: `Status updated to ${status}.`,
      }),
    });
    if (res.ok) await load();
  }

  async function resetData(mode: "seed" | "clear") {
    const res = await fetch("/api/admin/demo-data", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": accessKey },
      body: JSON.stringify({ mode }),
    });
    if (res.ok) await load();
  }

  function exportCsv() {
    const rows = [
      ["id", "createdAt", "status", "source", "name", "email", "phone", "projectType", "budget", "message"],
      ...(data?.leads ?? []).map((lead) => [
        lead.id,
        lead.createdAt,
        lead.status,
        lead.source,
        lead.name,
        lead.email,
        lead.phone || "",
        lead.projectType,
        lead.budget || "",
        lead.message.replace(/\r?\n/g, " "),
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "idealailabs-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!accessKey || error === "unauthorized") {
    return (
      <main className="min-h-screen bg-[rgb(var(--bg))] px-6 py-16">
        <section className="mx-auto max-w-md rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="mt-5 font-display text-3xl font-bold">IdealAI Admin</h1>
          <p className="mt-2 text-sm text-[rgb(var(--text-muted))]">
            Enter `ADMIN_ACCESS_KEY`. For local demo, use `demo-admin`.
          </p>
          <input
            value={draftKey}
            onChange={(event) => setDraftKey(event.target.value)}
            type="password"
            className="mt-5 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3"
          />
          <button
            onClick={login}
            className="mt-4 w-full rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Open dashboard
          </button>
          {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[rgb(var(--bg))]">
      <header className="border-b border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">IdealAI Admin</h1>
            <p className="text-sm text-[rgb(var(--text-muted))]">
              Leads, demo activity, store orders, appointments, and follow-up notes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => resetData("seed")}
              className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold"
            >
              Seed demo data
            </button>
            <button
              onClick={() => resetData("clear")}
              className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-300"
            >
              Clear data
            </button>
            <button
              onClick={() => load()}
              className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 py-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Metric icon={Inbox} label="Leads" value={data?.stats.leads ?? 0} />
          <Metric icon={Activity} label="New" value={data?.stats.newLeads ?? 0} />
          <Metric icon={LineChart} label="Demo events" value={data?.stats.demoEvents ?? 0} />
          <Metric icon={Package} label="Orders" value={data?.stats.orders ?? 0} />
          <Metric icon={CalendarDays} label="Appointments" value={data?.stats.appointments ?? 0} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[420px_1fr_360px]">
          <aside className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
            <div className="border-b border-[rgb(var(--border))] p-4">
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
              >
                {filters.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="max-h-[760px] overflow-y-auto">
              {leads.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelectedId(lead.id)}
                  className={`block w-full border-b border-[rgb(var(--border))] p-4 text-start ${
                    selected?.id === lead.id ? "bg-brand-500/10" : "hover:bg-[rgb(var(--surface-2))]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{lead.name}</div>
                      <div className="text-sm text-[rgb(var(--text-muted))]">{lead.projectType}</div>
                    </div>
                    <span className="rounded-full bg-[rgb(var(--surface-2))] px-2 py-1 text-xs">
                      {lead.status}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-[rgb(var(--text-muted))]">
                    {lead.source} - {new Date(lead.createdAt).toLocaleString()}
                  </div>
                </button>
              ))}
              {!leads.length && (
                <div className="p-6 text-sm text-[rgb(var(--text-muted))]">
                  No leads yet. Submit a contact form or demo request.
                </div>
              )}
            </div>
          </aside>

          <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
            {selected ? (
              <div>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="text-sm font-semibold uppercase text-[rgb(var(--text-muted))]">
                      {selected.source}
                    </div>
                    <h2 className="mt-1 font-display text-3xl font-bold">{selected.name}</h2>
                    <div className="mt-2 text-sm text-[rgb(var(--text-muted))]">
                      {selected.email} {selected.phone ? `- ${selected.phone}` : ""}
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <select
                      value={selected.status}
                      onChange={(event) => updateLead({ status: event.target.value })}
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
                    >
                      {statuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                    <select
                      value={selected.priority}
                      onChange={(event) => updateLead({ priority: event.target.value })}
                      className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm"
                    >
                      <option>normal</option>
                      <option>high</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    ["Company", selected.company || "-"],
                    ["Business type", selected.businessType || "-"],
                    ["Budget", selected.budget || "-"],
                    ["Timeline", selected.timeline || "-"],
                    ["Preferred channel", selected.preferredChannel || "-"],
                    ["Demo interest", selected.demoInterest || "-"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-[rgb(var(--surface-2))] p-4">
                      <div className="text-xs font-semibold uppercase text-[rgb(var(--text-muted))]">
                        {label}
                      </div>
                      <div className="mt-1 font-medium">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg bg-[rgb(var(--surface-2))] p-4">
                  <div className="text-xs font-semibold uppercase text-[rgb(var(--text-muted))]">
                    Message
                  </div>
                  <div className="mt-2 whitespace-pre-wrap leading-7">{selected.message}</div>
                </div>

                <div className="mt-6">
                  <label className="text-sm font-semibold">Add follow-up note</label>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3"
                  />
                  <button
                    onClick={() => updateLead({})}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white"
                  >
                    <Save className="h-4 w-4" />
                    Save note
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  {selected.notes.map((item) => (
                    <div key={item.id} className="rounded-lg border border-[rgb(var(--border))] p-4">
                      <div className="text-xs text-[rgb(var(--text-muted))]">
                        {item.author} - {new Date(item.createdAt).toLocaleString()}
                      </div>
                      <div className="mt-2">{item.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-[rgb(var(--text-muted))]">Select a lead.</div>
            )}
          </section>

          <aside className="space-y-6">
            <Panel title="Recent demo events">
              <div className="space-y-3">
                {(data?.events ?? []).slice(0, 8).map((event) => (
                  <div key={event.id} className="rounded-lg bg-[rgb(var(--surface-2))] p-3 text-sm">
                    <div className="font-semibold">{event.demoKey} - {event.type}</div>
                    <div className="text-xs text-[rgb(var(--text-muted))]">
                      {new Date(event.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Store orders">
              <div className="space-y-3">
                {(data?.storeOrders ?? []).slice(0, 5).map((order) => (
                  <div key={order.id} className="rounded-lg bg-[rgb(var(--surface-2))] p-3 text-sm">
                    <div className="font-semibold">{order.customer.name}</div>
                    <div>{order.status} via {order.paymentProvider}</div>
                    <div className="text-xs text-[rgb(var(--text-muted))]">
                      OMR {order.total.toFixed(3)}
                    </div>
                    <select
                      value={order.status}
                      onChange={(event) => updateOrder(order.id, event.target.value)}
                      className="mt-3 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-2 text-xs"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="Appointments">
              <div className="space-y-3">
                {(data?.spaAppointments ?? []).slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-lg bg-[rgb(var(--surface-2))] p-3 text-sm">
                    <div className="font-semibold">{item.customerName}</div>
                    <div>{item.serviceName} with {item.staffName}</div>
                    <div className="text-xs text-[rgb(var(--text-muted))]">
                      {item.date} {item.time}
                    </div>
                    <select
                      value={item.status}
                      onChange={(event) => updateAppointment(item.id, event.target.value)}
                      className="mt-3 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-2 py-2 text-xs"
                    >
                      {appointmentStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </Panel>
          </aside>
        </section>
      </div>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
      <Icon className="h-5 w-5 text-brand-500" />
      <div className="mt-3 font-display text-3xl font-bold">{value}</div>
      <div className="text-sm text-[rgb(var(--text-muted))]">{label}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}
