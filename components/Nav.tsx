"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { getDict, type Locale } from "@/lib/i18n";
import ThemeToggle from "./ThemeToggle";

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
    <header className="sticky top-0 z-50 border-b border-[rgb(var(--border))] bg-[rgb(var(--bg)/0.8)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href={base}
          className="flex items-center gap-2.5 font-display text-lg font-bold"
        >
          <LogoMark />
          <span className="tracking-tight whitespace-nowrap">
            {d.company.shortName ?? d.company.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[rgb(var(--text-muted))] transition hover:text-[rgb(var(--text))]"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            href={`/${other}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3.5 text-sm font-medium text-[rgb(var(--text-muted))] transition hover:text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))]"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            {other === "ar" ? "العربية" : "English"}
          </Link>
          <Link
            href={`${base}#contact`}
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {d.nav.quote}
          </Link>
        </div>

        <button
          className="md:hidden text-[rgb(var(--text))]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[rgb(var(--border))] bg-[rgb(var(--bg))] md:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[rgb(var(--text-muted))] hover:bg-[rgb(var(--surface-2))] hover:text-[rgb(var(--text))]"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-2 border-t border-[rgb(var(--border))] pt-3">
              <ThemeToggle />
              <Link
                href={`/${other}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2 text-sm"
              >
                <Globe className="h-4 w-4" />
                {other === "ar" ? "العربية" : "English"}
              </Link>
              <Link
                href={`${base}#contact`}
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full bg-brand-600 px-4 py-2 text-center text-sm font-semibold text-white"
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
    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 shadow-lg shadow-brand-500/30">
      <span className="font-display text-sm font-black text-white">II</span>
    </span>
  );
}
