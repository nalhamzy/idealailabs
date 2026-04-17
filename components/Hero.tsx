import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getDict, type Locale } from "@/lib/i18n";

export default function Hero({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-70" />
      <div className="absolute inset-x-0 top-0 h-[600px] bg-grid-fade" />
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-ink-100 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-brand-300" />
            {d.hero.badge}
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            {d.hero.title}{" "}
            <span className="gradient-text">{d.hero.titleAccent}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-200 md:text-xl">
            {d.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/${locale}#contact`}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:bg-ink-100"
            >
              {d.hero.ctaPrimary}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
            <Link
              href={`/${locale}#products`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-ink-50 transition hover:bg-white/10"
            >
              {d.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          <Metric value="2+" label={d.hero.metricClients} />
          <Metric value="10k+" label={d.hero.metricReq} />
          <Metric value="3" label={d.hero.metricCountries} />
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass rounded-2xl p-6 text-center">
      <div className="font-display text-4xl font-bold gradient-text">
        {value}
      </div>
      <div className="mt-1 text-sm text-ink-300">{label}</div>
    </div>
  );
}
