import {
  Bot,
  MessagesSquare,
  Brain,
  Code2,
  Lightbulb,
  Workflow,
} from "lucide-react";
import { getDict, type Locale } from "@/lib/i18n";

const ICONS = [Code2, MessagesSquare, Bot, Brain, Lightbulb, Workflow];

export default function Services({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  return (
    <section id="services" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-wider text-brand-300">
            {d.services.kicker}
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            {d.services.title}
          </h2>
          <p className="mt-4 text-lg text-ink-300">{d.services.subtitle}</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {d.services.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/10 blur-3xl transition group-hover:bg-brand-500/20 rtl:-left-16 rtl:right-auto" />
                <div className="relative">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-700/10 text-brand-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-300">
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
