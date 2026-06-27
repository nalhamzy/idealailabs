"use client";

import { useMemo, useState } from "react";
import { BarChart3, Brush, MessageCircle, MousePointerClick } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { landingTemplates } from "@/lib/platform";

const copy = {
  en: {
    title: "Landing Page Builder Demo",
    subtitle: "Pick a business type, tune the message, preview a real lead page, and capture the request into the same admin pipeline.",
    template: "Template",
    business: "Business name",
    city: "City",
    offer: "Offer",
    phone: "WhatsApp phone",
    color: "Accent",
    lead: "Send this to IdealAI Labs",
    name: "Your name",
    email: "Email",
    submit: "Request this page",
    saved: "Lead captured in admin.",
    analytics: "Lead analytics preview",
  },
  ar: {
    title: "عرض بناء صفحات الهبوط",
    subtitle: "اختر نوع العمل وعدّل الرسالة وشاهد صفحة فعلية تجمع الطلب في نفس لوحة الإدارة.",
    template: "القالب",
    business: "اسم النشاط",
    city: "المدينة",
    offer: "العرض",
    phone: "رقم واتساب",
    color: "اللون",
    lead: "أرسل الطلب إلى IdealAI Labs",
    name: "اسمك",
    email: "البريد",
    submit: "أريد هذه الصفحة",
    saved: "تم حفظ الطلب في الإدارة.",
    analytics: "معاينة تحليلات العملاء",
  },
} as const;

const accents = [
  { name: "Blue", value: "#2563eb" },
  { name: "Green", value: "#059669" },
  { name: "Rose", value: "#e11d48" },
  { name: "Amber", value: "#d97706" },
];

export default function LandingPagesDemo({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [templateId, setTemplateId] = useState(landingTemplates[0].id);
  const template = landingTemplates.find((item) => item.id === templateId) ?? landingTemplates[0];
  const [settings, setSettings] = useState({
    business: locale === "ar" ? "مطعم الموج" : "Wave Bistro",
    city: locale === "ar" ? "مسقط" : "Muscat",
    offer: template.offer[locale],
    phone: "+968 9000 4455",
    accent: accents[0].value,
    name: "Ali Founder",
    email: "founder@example.com",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const metrics = useMemo(
    () => [
      { label: "Visits", value: 1268, icon: MousePointerClick },
      { label: "Forms", value: 84, icon: BarChart3 },
      { label: "WhatsApp", value: 139, icon: MessageCircle },
    ],
    []
  );

  function chooseTemplate(id: string) {
    const next = landingTemplates.find((item) => item.id === id) ?? landingTemplates[0];
    setTemplateId(id);
    setSettings((current) => ({ ...current, offer: next.offer[locale] }));
  }

  async function submitLead() {
    setStatus("loading");
    const res = await fetch("/api/demo/landing/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        template: template.name.en,
        industry: template.id,
        name: settings.name,
        email: settings.email,
        phone: settings.phone,
        company: settings.business,
        message: `Landing page request for ${settings.business} in ${settings.city}. Offer: ${settings.offer}`,
      }),
    });
    setStatus(res.ok ? "success" : "error");
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[360px_1fr_320px]">
      <aside className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
        <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-sky-600 dark:text-sky-300">
          <Brush className="h-4 w-4" />
          Page generator
        </div>
        <h2 className="mt-2 font-display text-3xl font-bold">{t.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[rgb(var(--text-muted))]">
          {t.subtitle}
        </p>

        <div className="mt-6 space-y-4">
          <label className="text-sm font-medium">
            {t.template}
            <select
              value={templateId}
              onChange={(event) => chooseTemplate(event.target.value)}
              className="mt-2 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3"
            >
              {landingTemplates.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name[locale]}
                </option>
              ))}
            </select>
          </label>
          {(["business", "city", "offer", "phone"] as const).map((key) => (
            <label key={key} className="text-sm font-medium">
              {t[key]}
              <input
                value={settings[key]}
                onChange={(event) => setSettings({ ...settings, [key]: event.target.value })}
                className="mt-2 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3"
              />
            </label>
          ))}
          <div>
            <div className="text-sm font-medium">{t.color}</div>
            <div className="mt-2 flex gap-2">
              {accents.map((accent) => (
                <button
                  key={accent.value}
                  onClick={() => setSettings({ ...settings, accent: accent.value })}
                  aria-label={accent.name}
                  className={`h-9 w-9 rounded-full border-2 ${
                    settings.accent === accent.value ? "border-[rgb(var(--text))]" : "border-transparent"
                  }`}
                  style={{ background: accent.value }}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div className="overflow-hidden rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
        <section className="relative min-h-[640px] overflow-hidden">
          <img
            src={template.image}
            alt={template.name[locale]}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative flex min-h-[640px] flex-col justify-between p-8 text-white md:p-12">
            <nav className="flex items-center justify-between text-sm">
              <div className="font-display text-2xl font-bold">{settings.business}</div>
              <a
                href={`https://wa.me/${settings.phone.replace(/\D/g, "")}`}
                className="rounded-full px-4 py-2 font-semibold text-white"
                style={{ background: settings.accent }}
              >
                WhatsApp
              </a>
            </nav>
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
                {settings.city}
              </div>
              <h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">
                {template.name[locale]}
              </h1>
              <p className="mt-5 max-w-xl text-xl leading-8 text-white/85">
                {settings.offer}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  className="rounded-full px-6 py-3 text-sm font-bold text-white"
                  style={{ background: settings.accent }}
                >
                  {locale === "ar" ? "احجز الآن" : "Book now"}
                </button>
                <button className="rounded-full border border-white/50 px-6 py-3 text-sm font-bold">
                  {locale === "ar" ? "شاهد الأعمال" : "View gallery"}
                </button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                locale === "ar" ? "تصميم سريع" : "Fast launch",
                locale === "ar" ? "نموذج عملاء" : "Lead form",
                locale === "ar" ? "تحليلات" : "Analytics",
              ].map((item) => (
                <div key={item} className="rounded-lg bg-white/15 p-4 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-5">
        <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
          <h3 className="font-display text-2xl font-bold">{t.lead}</h3>
          <div className="mt-4 space-y-3">
            <label className="text-sm font-medium">
              {t.name}
              <input
                value={settings.name}
                onChange={(event) => setSettings({ ...settings, name: event.target.value })}
                className="mt-2 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3"
              />
            </label>
            <label className="text-sm font-medium">
              {t.email}
              <input
                value={settings.email}
                onChange={(event) => setSettings({ ...settings, email: event.target.value })}
                className="mt-2 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-3"
              />
            </label>
            <button
              onClick={submitLead}
              disabled={status === "loading"}
              className="w-full rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {status === "loading" ? "..." : t.submit}
            </button>
            {status === "success" && (
              <p className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
                {t.saved}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
          <h3 className="font-display text-2xl font-bold">{t.analytics}</h3>
          <div className="mt-4 grid gap-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex items-center justify-between rounded-lg bg-[rgb(var(--surface-2))] p-4"
              >
                <div className="flex items-center gap-2">
                  <metric.icon className="h-4 w-4 text-sky-500" />
                  <span className="text-sm">{metric.label}</span>
                </div>
                <span className="font-display text-2xl font-bold">{metric.value}</span>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </section>
  );
}
