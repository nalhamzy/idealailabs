"use client";

import { useState } from "react";
import { Send, Check, MessageSquare } from "lucide-react";
import { getDict, type Locale } from "@/lib/i18n";

export default function Contact({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "request_failed");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "unknown");
    }
  }

  return (
    <section
      id="contact"
      className="section-pad relative border-t border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            <MessageSquare className="h-3.5 w-3.5" />
            {d.contact.kicker}
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl text-[rgb(var(--text))]">
            {d.contact.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[rgb(var(--text-muted))]">
            {d.contact.subtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6 md:p-10 lift"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field name="name" label={d.contact.name} required />
            <Field
              name="email"
              label={d.contact.email}
              type="email"
              required
            />
            <Field name="company" label={d.contact.company} />
            <Select
              name="projectType"
              label={d.contact.projectType}
              options={d.contact.projectTypes as unknown as string[]}
              required
            />
            <Select
              name="budget"
              label={d.contact.budget}
              options={d.contact.budgets as unknown as string[]}
            />
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[rgb(var(--text))]">
                {d.contact.message}
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder={d.contact.messagePlaceholder}
                className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-muted))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="text-sm">
              {status === "success" && (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" />
                  {d.contact.success}
                </span>
              )}
              {status === "error" && (
                <span className="text-rose-600 dark:text-rose-400">
                  {d.contact.error}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white lift-strong transition hover:bg-brand-700 disabled:opacity-60"
            >
              <Send className="h-4 w-4 rtl:rotate-180" />
              {status === "loading" ? d.contact.submitting : d.contact.submit}
            </button>
          </div>
          {errorMsg && status === "error" && (
            <div className="mt-3 text-center text-xs text-[rgb(var(--text-muted))]">
              {errorMsg}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[rgb(var(--text))]">
        {label}
        {required && <span className="text-brand-500"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-muted))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
    </div>
  );
}

function Select({
  name,
  label,
  options,
  required,
}: {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[rgb(var(--text))]">
        {label}
        {required && <span className="text-brand-500"> *</span>}
      </label>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-[rgb(var(--text))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        <option value="" disabled>
          —
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
