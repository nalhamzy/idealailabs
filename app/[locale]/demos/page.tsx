import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe2 } from "lucide-react";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { demoDefinitions, platformCopy } from "@/lib/platform";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function DemosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;
  const copy = platformCopy[l];

  return (
    <main>
      <section className="relative overflow-hidden border-b border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-brand-600 dark:text-brand-300">
              <Globe2 className="h-4 w-4" />
              {copy.demoHubEyebrow}
            </div>
            <h1 className="mt-4 font-display text-5xl font-bold leading-tight md:text-6xl">
              {copy.demoHubTitle}
            </h1>
            <p className="mt-5 text-xl leading-8 text-[rgb(var(--text-muted))]">
              {copy.demoHubSubtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2">
          {demoDefinitions.map((demo) => (
            <Link
              key={demo.key}
              href={`/${l}/demos/${demo.key}`}
              className="group grid overflow-hidden rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] transition hover:-translate-y-1 hover:shadow-2xl md:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="min-h-72 overflow-hidden bg-[rgb(var(--surface-2))]">
                <img
                  src={demo.image}
                  alt={demo.title[l]}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-7">
                <div className="text-xs font-semibold uppercase text-[rgb(var(--text-muted))]">
                  {demo.eyebrow[l]} - {demo.subdomain}
                </div>
                <h2 className="mt-3 font-display text-3xl font-bold">
                  {demo.title[l]}
                </h2>
                <p className="mt-4 leading-7 text-[rgb(var(--text-muted))]">
                  {demo.summary[l]}
                </p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {demo.proof[l].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-300">
                  {copy.openDemo}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
