import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const heroCopy = {
  en: {
    badge: "Software - Websites - Stores - WhatsApp Automation - AI",
    title: "Build the digital system your business actually needs.",
    accent: "IdealAI Labs",
    subtitle:
      "We design, build, and operate practical software for Oman and the Gulf: websites, ecommerce stores, booking systems, WhatsApp automation, AI assistants, and custom business platforms.",
    primary: "Start a Project",
    secondary: "Explore Demos",
    metricOne: "Working demos",
    metricTwo: "Business workflows",
    metricThree: "Bilingual delivery",
  },
  ar: {
    badge: "برمجيات - مواقع - متاجر - واتساب - ذكاء اصطناعي",
    title: "نبني النظام الرقمي الذي يحتاجه عملك فعلاً.",
    accent: "IdealAI Labs",
    subtitle:
      "نصمم ونبني ونشغل حلولاً عملية للشركات في عمان والخليج: مواقع، متاجر إلكترونية، أنظمة مواعيد، أتمتة واتساب، مساعدين بالذكاء الاصطناعي، ومنصات مخصصة.",
    primary: "ابدأ مشروعك",
    secondary: "شاهد العروض",
    metricOne: "عروض عملية",
    metricTwo: "سير عمل تجاري",
    metricThree: "عربي وإنجليزي",
  },
} as const;

export default function Hero({ locale }: { locale: Locale }) {
  const copy = heroCopy[locale];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-70" />
      <div className="absolute inset-x-0 top-0 h-[700px] hero-glow" />
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-4 py-1.5 text-xs font-medium text-[rgb(var(--text-muted))] backdrop-blur lift">
            <Sparkles className="h-3.5 w-3.5 text-brand-500" />
            {copy.badge}
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] md:text-7xl text-[rgb(var(--text))]">
            {copy.title}{" "}
            <span className="gradient-text">{copy.accent}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[rgb(var(--text-muted))] md:text-xl">
            {copy.subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/${locale}#contact`}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white lift-strong transition hover:bg-brand-700"
            >
              {copy.primary}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <Link
              href={`/${locale}/demos`}
              className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-6 py-3 text-sm font-semibold text-[rgb(var(--text))] transition hover:bg-[rgb(var(--surface-2))]"
            >
              {copy.secondary}
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          <Metric value="5" label={copy.metricOne} />
          <Metric value="30+" label={copy.metricTwo} />
          <Metric value="EN/AR" label={copy.metricThree} />
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="surface lift rounded-2xl p-6 text-center">
      <div className="font-display text-4xl font-bold gradient-text">
        {value}
      </div>
      <div className="mt-1 text-sm text-[rgb(var(--text-muted))]">{label}</div>
    </div>
  );
}
