"use client";

import type React from "react";
import { useState } from "react";
import { Send, Check, MessageSquare } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const contactCopy = {
  en: {
    kicker: "Let's build",
    title: "Tell us what your business needs.",
    subtitle:
      "Stores, websites, WhatsApp automation, booking systems, AI assistants, or a custom platform. Your request now lands in our admin pipeline, not just email.",
    name: "Your name",
    email: "Work email",
    phone: "WhatsApp / phone",
    company: "Company",
    businessType: "Business type",
    projectType: "Project type",
    budget: "Estimated budget",
    timeline: "Timeline",
    preferredChannel: "Preferred channel",
    demoInterest: "Demo interest",
    message: "Describe your project",
    messagePlaceholder:
      "What do you want to build? Which systems, payments, WhatsApp flows, data, or integrations matter?",
    consent: "You may contact me on WhatsApp about this request.",
    submit: "Request Build",
    submitting: "Sending...",
    success: "Thanks. Your request is saved and we will follow up.",
    error: "Something went wrong. Please try again or email us directly.",
    projectTypes: [
      "Online Store / Thawani",
      "WhatsApp Automation",
      "Website / Landing Page",
      "Appointment System",
      "Document / Data AI",
      "Custom Software",
      "Other",
    ],
    businessTypes: ["Retail", "Restaurant", "Spa / Clinic", "Services", "Education", "Real Estate", "Other"],
    budgets: ["Under $5k", "$5k - $15k", "$15k - $50k", "$50k+", "Not sure yet"],
    timelines: ["Urgent", "This month", "1-3 months", "Planning stage"],
    channels: ["WhatsApp", "Email", "Phone call"],
    demos: ["Store", "Spa", "WhatsApp bots", "Landing pages", "Document suite", "Not sure"],
  },
  ar: {
    kicker: "لنبدأ البناء",
    title: "أخبرنا ماذا يحتاج عملك.",
    subtitle:
      "متاجر، مواقع، أتمتة واتساب، أنظمة مواعيد، مساعدين ذكاء اصطناعي، أو منصة مخصصة. الطلب يصل الآن إلى لوحة الإدارة وليس البريد فقط.",
    name: "اسمك",
    email: "البريد الإلكتروني",
    phone: "رقم واتساب / الهاتف",
    company: "الشركة",
    businessType: "نوع النشاط",
    projectType: "نوع المشروع",
    budget: "الميزانية التقريبية",
    timeline: "المدة",
    preferredChannel: "طريقة التواصل",
    demoInterest: "العرض المناسب",
    message: "صف المشروع",
    messagePlaceholder:
      "ماذا تريد أن تبني؟ ما الأنظمة أو الدفع أو واتساب أو البيانات أو التكاملات المهمة؟",
    consent: "يمكنكم التواصل معي عبر واتساب بخصوص هذا الطلب.",
    submit: "اطلب البناء",
    submitting: "جار الإرسال...",
    success: "شكراً. تم حفظ الطلب وسنتواصل معك.",
    error: "حدث خطأ. حاول مرة أخرى أو راسلنا مباشرة.",
    projectTypes: [
      "متجر إلكتروني / ثواني",
      "أتمتة واتساب",
      "موقع / صفحة هبوط",
      "نظام مواعيد",
      "ذكاء مستندات وبيانات",
      "برنامج مخصص",
      "أخرى",
    ],
    businessTypes: ["تجزئة", "مطعم", "سبا / عيادة", "خدمات", "تعليم", "عقار", "أخرى"],
    budgets: ["أقل من 5 آلاف دولار", "5 - 15 ألف دولار", "15 - 50 ألف دولار", "أكثر من 50 ألف", "غير متأكد"],
    timelines: ["عاجل", "هذا الشهر", "1-3 أشهر", "مرحلة التخطيط"],
    channels: ["واتساب", "بريد إلكتروني", "اتصال"],
    demos: ["المتجر", "السبا", "روبوتات واتساب", "صفحات الهبوط", "منصة المستندات", "غير متأكد"],
  },
} as const;

export default function Contact({ locale }: { locale: Locale }) {
  const d = contactCopy[locale];
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
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-brand-600 dark:text-brand-300">
            <MessageSquare className="h-3.5 w-3.5" />
            {d.kicker}
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl text-[rgb(var(--text))]">
            {d.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-[rgb(var(--text-muted))]">
            {d.subtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6 md:p-10 lift"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field name="name" label={d.name} required />
            <Field name="email" label={d.email} type="email" required />
            <Field name="phone" label={d.phone} />
            <Field name="company" label={d.company} />
            <Select name="businessType" label={d.businessType} options={d.businessTypes} />
            <Select name="projectType" label={d.projectType} options={d.projectTypes} required />
            <Select name="budget" label={d.budget} options={d.budgets} />
            <Select name="timeline" label={d.timeline} options={d.timelines} />
            <Select name="preferredChannel" label={d.preferredChannel} options={d.channels} />
            <Select name="demoInterest" label={d.demoInterest} options={d.demos} />
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[rgb(var(--text))]">
                {d.message}
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder={d.messagePlaceholder}
                className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-muted))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <label className="flex items-start gap-3 rounded-lg bg-[rgb(var(--surface-2))] p-4 text-sm md:col-span-2">
              <input name="consentWhatsApp" type="checkbox" className="mt-1" />
              <span>{d.consent}</span>
            </label>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="text-sm">
              {status === "success" && (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Check className="h-4 w-4" />
                  {d.success}
                </span>
              )}
              {status === "error" && (
                <span className="text-rose-600 dark:text-rose-400">
                  {d.error}
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white lift-strong transition hover:bg-brand-700 disabled:opacity-60"
            >
              <Send className="h-4 w-4 rtl:rotate-180" />
              {status === "loading" ? d.submitting : d.submit}
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
        className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-muted))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
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
  options: readonly string[];
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
        className="w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-4 py-3 text-[rgb(var(--text))] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        <option value="" disabled>
          -
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
