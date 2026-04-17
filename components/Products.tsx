import { Briefcase, Users, Check, ArrowRight } from "lucide-react";
import { getDict, type Locale } from "@/lib/i18n";

export default function Products({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section
      id="products"
      className="section-pad relative border-y border-white/5 bg-gradient-to-b from-ink-950 via-ink-900/40 to-ink-950"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-wider text-brand-300">
            {d.products.kicker}
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            {d.products.title}
          </h2>
          <p className="mt-4 text-lg text-ink-300">{d.products.subtitle}</p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <ProductCard
            Icon={Briefcase}
            name={d.products.careers.name}
            tag={d.products.careers.tag}
            desc={d.products.careers.desc}
            features={d.products.careers.features}
            accent="from-brand-500/30 via-brand-600/20 to-transparent"
            cta={d.products.cta}
            href="https://careersagent.ai"
          />
          <ProductCard
            Icon={Users}
            name={d.products.recruit.name}
            tag={d.products.recruit.tag}
            desc={d.products.recruit.desc}
            features={d.products.recruit.features}
            accent="from-emerald-400/25 via-teal-500/15 to-transparent"
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
  accent,
  cta,
  href,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
  tag: string;
  desc: string;
  features: readonly string[];
  accent: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 transition hover:border-white/20">
      <div
        className={`absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gradient-to-br ${accent} blur-3xl transition group-hover:scale-110 rtl:-left-20 rtl:right-auto`}
      />
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white ring-1 ring-white/10">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-300">
              {tag}
            </div>
            <h3 className="font-display text-2xl font-bold">{name}</h3>
          </div>
        </div>
        <p className="mt-5 text-ink-200 leading-relaxed">{desc}</p>
        <ul className="mt-6 space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-ink-200">
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-300" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition hover:text-brand-300"
        >
          {cta}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </a>
      </div>
    </div>
  );
}
