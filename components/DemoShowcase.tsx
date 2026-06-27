import Link from "next/link";
import { ArrowRight, ExternalLink, Layers } from "lucide-react";
import {
  demoDefinitions,
  platformCopy,
  type DemoDefinition,
} from "@/lib/platform";
import type { Locale } from "@/lib/i18n";

export default function DemoShowcase({ locale }: { locale: Locale }) {
  const copy = platformCopy[locale];

  return (
    <section
      id="demos"
      className="section-pad border-y border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-brand-600 dark:text-brand-300">
              <Layers className="h-3.5 w-3.5" />
              {copy.demoHubEyebrow}
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl text-[rgb(var(--text))]">
              {copy.homepageDemosTitle}
            </h2>
            <p className="mt-4 text-lg text-[rgb(var(--text-muted))]">
              {copy.homepageDemosSubtitle}
            </p>
          </div>
          <Link
            href={`/${locale}/demos`}
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {copy.openDemo}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {demoDefinitions.map((demo) => (
            <DemoCard key={demo.key} demo={demo} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoCard({
  demo,
  locale,
}: {
  demo: DemoDefinition;
  locale: Locale;
}) {
  const copy = platformCopy[locale];
  return (
    <Link
      href={`/${locale}/demos/${demo.key}`}
      className="group overflow-hidden rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[rgb(var(--surface-2))]">
        <img
          src={demo.image}
          alt={demo.title[locale]}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="text-xs font-semibold uppercase text-[rgb(var(--text-muted))]">
          {demo.eyebrow[locale]}
        </div>
        <h3 className="mt-2 font-display text-xl font-bold text-[rgb(var(--text))]">
          {demo.title[locale]}
        </h3>
        <p className="mt-3 line-clamp-4 text-sm leading-6 text-[rgb(var(--text-muted))]">
          {demo.summary[locale]}
        </p>
        <div className="mt-5 flex items-center justify-between text-sm font-semibold text-brand-600 dark:text-brand-300">
          <span>{copy.demoStatus}</span>
          <ExternalLink className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
