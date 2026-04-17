import { getDict, type Locale } from "@/lib/i18n";

export default function Approach({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section id="about" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-wider text-brand-300">
            {d.approach.kicker}
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            {d.approach.title}
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {d.approach.steps.map((step) => (
            <div
              key={step.n}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8"
            >
              <div className="font-display text-6xl font-black text-brand-500/20">
                {step.n}
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold">
                {step.title}
              </h3>
              <p className="mt-3 text-ink-300 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
