import {
  Bot,
  MessageCircle,
  BrainCircuit,
  Code2,
  Compass,
  Network,
  Sparkles,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";

const serviceCopy = {
  en: {
    kicker: "What we build",
    title: "Practical software for real business workflows.",
    subtitle:
      "We build the pieces that help customers buy, book, ask, upload, pay, and get served faster.",
    items: [
      {
        title: "Business Websites",
        desc: "Fast bilingual websites, landing pages, service pages, SEO foundations, analytics, lead forms, and WhatsApp CTAs.",
      },
      {
        title: "Online Stores",
        desc: "Product catalogs, carts, checkout flows, OMR pricing, Thawani-ready payments, order management, and fulfillment dashboards.",
      },
      {
        title: "WhatsApp Automation",
        desc: "Web-tested WhatsApp bot flows for sales, support, booking, reminders, qualification, handoff, and follow-up.",
      },
      {
        title: "Appointment Systems",
        desc: "Booking calendars, staff availability, service menus, reminders, schedule boards, and admin controls.",
      },
      {
        title: "Custom Software",
        desc: "Dashboards, CRMs, internal tools, portals, integrations, and client-specific platforms built for daily operations.",
      },
      {
        title: "Document & Data AI",
        desc: "Upload spreadsheets and documents, ask questions, generate charts, compare evidence, and turn files into decisions.",
      },
    ],
  },
  ar: {
    kicker: "ما نبنيه",
    title: "برمجيات عملية لسير العمل التجاري.",
    subtitle:
      "نبني ما يساعد العملاء على الشراء والحجز والسؤال ورفع الملفات والدفع والحصول على الخدمة بسرعة.",
    items: [
      {
        title: "مواقع للشركات",
        desc: "مواقع عربية وإنجليزية سريعة، صفحات هبوط، صفحات خدمات، أساسيات SEO، تحليلات، نماذج عملاء، وأزرار واتساب.",
      },
      {
        title: "متاجر إلكترونية",
        desc: "كتالوج منتجات، سلة، دفع بالريال العماني، تكامل ثواني، إدارة طلبات، ولوحات شحن.",
      },
      {
        title: "أتمتة واتساب",
        desc: "مسارات روبوتات واتساب للمبيعات والدعم والحجز والتذكير والتأهيل والتحويل لموظف.",
      },
      {
        title: "أنظمة مواعيد",
        desc: "تقويمات حجز، توفر موظفين، قوائم خدمات، تذكيرات، لوحات جدول، وتحكم إداري.",
      },
      {
        title: "برمجيات مخصصة",
        desc: "لوحات، CRM، أدوات داخلية، بوابات، تكاملات، ومنصات مخصصة للعمل اليومي.",
      },
      {
        title: "ذكاء المستندات والبيانات",
        desc: "رفع جداول ومستندات، أسئلة، رسوم بيانية، مقارنة أدلة، وتحويل الملفات إلى قرارات.",
      },
    ],
  },
} as const;

const VARIANTS = [
  {
    Icon: Code2,
    grad: "from-sky-500 to-indigo-600",
    soft: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    Icon: MessageCircle,
    grad: "from-emerald-500 to-teal-600",
    soft: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    Icon: Bot,
    grad: "from-fuchsia-500 to-pink-600",
    soft: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
  },
  {
    Icon: BrainCircuit,
    grad: "from-amber-500 to-orange-600",
    soft: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    Icon: Compass,
    grad: "from-violet-500 to-purple-600",
    soft: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    Icon: Network,
    grad: "from-rose-500 to-red-600",
    soft: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
];

export default function Services({ locale }: { locale: Locale }) {
  const d = serviceCopy[locale];
  return (
    <section id="services" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            {d.kicker}
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl text-[rgb(var(--text))]">
            {d.title}
          </h2>
          <p className="mt-4 text-lg text-[rgb(var(--text-muted))]">
            {d.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {d.items.map((item, i) => {
            const v = VARIANTS[i % VARIANTS.length];
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-7 transition hover:border-transparent hover:lift-strong"
              >
                <div
                  className={`absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${v.grad} opacity-0 blur-3xl transition group-hover:opacity-20 rtl:-left-16 rtl:right-auto`}
                />
                <div className="relative">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${v.soft} ring-1 ring-inset ring-current/10`}
                  >
                    <v.Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-[rgb(var(--text))]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--text-muted))]">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
