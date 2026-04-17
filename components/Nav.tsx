"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { getDict, type Locale } from "@/lib/i18n";

export default function Nav({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const [open, setOpen] = useState(false);
  const other: Locale = locale === "en" ? "ar" : "en";
  const base = `/${locale}`;

  const links = [
    { href: `${base}#services`, label: d.nav.services },
    { href: `${base}#products`, label: d.nav.products },
    { href: `${base}#about`, label: d.nav.about },
    { href: `${base}#contact`, label: d.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={base} className="flex items-center gap-2 font-display text-lg font-bold">
          <LogoMark />
          <span className="tracking-tight">
            {locale === "ar" ? "آيديال إنتليجنس" : "Ideal Intelligence"}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-ink-200 transition hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={`/${other}`}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-sm text-ink-100 transition hover:border-white/20 hover:bg-white/5"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            {other === "ar" ? "العربية" : "English"}
          </Link>
          <Link
            href={`${base}#contact`}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-950 transition hover:bg-ink-100"
          >
            {d.nav.quote}
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-ink-950 md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-ink-200 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-2 border-t border-white/5 pt-3">
              <Link
                href={`/${other}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-sm"
              >
                <Globe className="h-4 w-4" />
                {other === "ar" ? "العربية" : "English"}
              </Link>
              <Link
                href={`${base}#contact`}
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-ink-950"
              >
                {d.nav.quote}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function LogoMark() {
  return (
    <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 shadow-glow">
      <span className="font-display text-sm font-black text-white">II</span>
    </span>
  );
}
