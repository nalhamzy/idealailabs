"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
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
      className="section-pad relative border-t border-white/5 bg-gradient-to-b from-ink-950 to-ink-900/40"
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-brand-300">
            {d.contact.kicker}
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            {d.contact.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-300">
            {d.contact.subtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-10"
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
              <label className="mb-2 block text-sm font-medium text-ink-100">
                {d.contact.message}
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder={d.contact.messagePlaceholder}
                className="w-full rounded-xl border border-white/10 bg-ink-950 px-4 py-3 text-ink-50 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/30"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="text-sm">
              {status === "success" && (
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <Check className="h-4 w-4" />
                  {d.contact.success}
                </span>
              )}
              {status === "error" && (
                <span className="text-rose-400">{d.contact.error}</span>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:bg-ink-100 disabled:opacity-60"
            >
              <Send className="h-4 w-4 rtl:rotate-180" />
              {status === "loading" ? d.contact.submitting : d.contact.submit}
            </button>
          </div>
          {errorMsg && status === "error" && (
            <div className="mt-3 text-center text-xs text-ink-400">
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
      <label className="mb-2 block text-sm font-medium text-ink-100">
        {label}
        {required && <span className="text-brand-300"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-ink-950 px-4 py-3 text-ink-50 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/30"
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
      <label className="mb-2 block text-sm font-medium text-ink-100">
        {label}
        {required && <span className="text-brand-300"> *</span>}
      </label>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full rounded-xl border border-white/10 bg-ink-950 px-4 py-3 text-ink-50 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/30"
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
