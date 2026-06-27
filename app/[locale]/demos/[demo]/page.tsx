import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import {
  demoDefinitions,
  getDemo,
  platformCopy,
  type DemoKey,
} from "@/lib/platform";
import StoreDemo from "@/components/demos/StoreDemo";
import SpaDemo from "@/components/demos/SpaDemo";
import WhatsAppBotsDemo from "@/components/demos/WhatsAppBotsDemo";
import LandingPagesDemo from "@/components/demos/LandingPagesDemo";
import DocumentSuiteDemo from "@/components/demos/DocumentSuiteDemo";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    demoDefinitions.map((demo) => ({ locale, demo: demo.key }))
  );
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string; demo: string }>;
}) {
  const { locale, demo } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  const definition = getDemo(demo);
  if (!definition) notFound();
  const copy = platformCopy[l];

  return (
    <main>
      <section className="border-b border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href={`/${l}/demos`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-300"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {copy.backToDemos}
          </Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="text-sm font-semibold uppercase text-[rgb(var(--text-muted))]">
                {definition.eyebrow[l]}
              </div>
              <h1 className="mt-2 font-display text-5xl font-bold md:text-6xl">
                {definition.title[l]}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-[rgb(var(--text-muted))]">
                {definition.summary[l]}
              </p>
            </div>
            <div className="overflow-hidden rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
              <div className="aspect-[16/9] overflow-hidden bg-[rgb(var(--surface-2))]">
                <img
                  src={definition.image}
                  alt={definition.title[l]}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold uppercase text-[rgb(var(--text-muted))]">
                  Target subdomain
                </div>
                <div className="mt-2 flex items-center gap-2 font-display text-xl font-bold">
                  {definition.subdomain}
                  <ExternalLink className="h-4 w-4 text-brand-500" />
                </div>
                <Link
                  href={`/${l}#contact`}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white"
                >
                  {copy.requestSystemCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-10">
        <DemoSwitch demo={definition.key} locale={l} />
      </section>
    </main>
  );
}

function DemoSwitch({ demo, locale }: { demo: DemoKey; locale: Locale }) {
  switch (demo) {
    case "store":
      return <StoreDemo locale={locale} />;
    case "spa":
      return <SpaDemo locale={locale} />;
    case "whatsapp":
      return <WhatsAppBotsDemo locale={locale} />;
    case "landing-pages":
      return <LandingPagesDemo locale={locale} />;
    case "documents":
      return <DocumentSuiteDemo locale={locale} />;
    default:
      return null;
  }
}
