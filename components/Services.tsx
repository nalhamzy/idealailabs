import {
  Bot,
  MessageCircle,
  BrainCircuit,
  Code2,
  Compass,
  Network,
  Sparkles,
} from "lucide-react";
import { getDict, type Locale } from "@/lib/i18n";

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
  const d = getDict(locale);
  return (
    <section id="services" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            {d.services.kicker}
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl text-[rgb(var(--text))]">
            {d.services.title}
          </h2>
          <p className="mt-4 text-lg text-[rgb(var(--text-muted))]">
            {d.services.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {d.services.items.map((item, i) => {
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
