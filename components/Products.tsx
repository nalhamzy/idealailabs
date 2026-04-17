import { Briefcase, Users, Check, ArrowRight, Layers } from "lucide-react";
import { getDict, type Locale } from "@/lib/i18n";

export default function Products({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section
      id="products"
      className="section-pad relative border-y border-[rgb(var(--border))] bg-[rgb(var(--surface-2))]"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            <Layers className="h-3.5 w-3.5" />
            {d.products.kicker}
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl text-[rgb(var(--text))]">
            {d.products.title}
          </h2>
          <p className="mt-4 text-lg text-[rgb(var(--text-muted))]">
            {d.products.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <ProductCard
            Icon={Briefcase}
            name={d.products.careers.name}
            tag={d.products.careers.tag}
            desc={d.products.careers.desc}
            features={d.products.careers.features}
            grad="from-brand-500 via-brand-600 to-indigo-700"
            cta={d.products.cta}
            href="https://careersagent.ai"
          />
          <ProductCard
            Icon={Users}
            name={d.products.recruit.name}
            tag={d.products.recruit.tag}
            desc={d.products.recruit.desc}
            features={d.products.recruit.features}
            grad="from-emerald-500 via-teal-600 to-cyan-700"
            cta={d.products.cta}
            href="#"
          />
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  Icon,
  name,
  tag,
  desc,
  features,
  grad,
  cta,
  href,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
  tag: string;
  desc: string;
  features: readonly string[];
  grad: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-8 lift transition hover:lift-strong">
      <div
        className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br ${grad} opacity-10 blur-3xl transition group-hover:scale-110 group-hover:opacity-20 rtl:-left-24 rtl:right-auto`}
      />
      <div className="relative">
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-white shadow-lg`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[rgb(var(--text-muted))]">
              {tag}
            </div>
            <h3 className="font-display text-2xl font-bold text-[rgb(var(--text))]">
              {name}
            </h3>
          </div>
        </div>
        <p className="mt-5 text-[rgb(var(--text-muted))] leading-relaxed">
          {desc}
        </p>
        <ul className="mt-6 space-y-2.5">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2 text-sm text-[rgb(var(--text))]"
            >
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-300 transition hover:text-brand-700 dark:hover:text-brand-200"
        >
          {cta}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </a>
      </div>
    </div>
  );
}
