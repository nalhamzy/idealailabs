import { Workflow } from "lucide-react";
import { getDict, type Locale } from "@/lib/i18n";

export default function Approach({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section id="about" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            <Workflow className="h-3.5 w-3.5" />
            {d.approach.kicker}
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl text-[rgb(var(--text))]">
            {d.approach.title}
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {d.approach.steps.map((step) => (
            <div
              key={step.n}
              className="relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-8 lift"
            >
              <div className="font-display text-6xl font-black text-brand-500/20 dark:text-brand-400/20">
                {step.n}
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold text-[rgb(var(--text))]">
                {step.title}
              </h3>
              <p className="mt-3 text-[rgb(var(--text-muted))] leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
