import Link from "next/link";
import { getDict, type Locale } from "@/lib/i18n";
import { Mail, MapPin } from "lucide-react";

export default function Footer({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[rgb(var(--border))] bg-[rgb(var(--bg))]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700 shadow-lg shadow-brand-500/30">
                <span className="font-display text-sm font-black text-white">
                  II
                </span>
              </span>
              <span className="font-display text-lg font-bold text-[rgb(var(--text))]">
                {d.company.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[rgb(var(--text-muted))]">
              {d.footer.tagline}
            </p>
            <div className="mt-6 space-y-2 text-sm text-[rgb(var(--text-muted))]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-500" />
                <span>{d.company.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-500" />
                <a
                  href="mailto:idealailabs@gmail.com"
                  className="hover:text-[rgb(var(--text))]"
                >
                  idealailabs@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[rgb(var(--text))]">
              {d.footer.company}
            </h4>
            <ul className="space-y-2 text-sm text-[rgb(var(--text-muted))]">
              <li>
                <Link
                  href={`/${locale}#about`}
                  className="hover:text-[rgb(var(--text))]"
                >
                  {d.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#services`}
                  className="hover:text-[rgb(var(--text))]"
                >
                  {d.nav.services}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#contact`}
                  className="hover:text-[rgb(var(--text))]"
                >
                  {d.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[rgb(var(--text))]">
              {d.footer.resources}
            </h4>
            <ul className="space-y-2 text-sm text-[rgb(var(--text-muted))]">
              <li>
                <Link
                  href={`/${locale}#products`}
                  className="hover:text-[rgb(var(--text))]"
                >
                  {d.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale === "en" ? "ar" : "en"}`}
                  className="hover:text-[rgb(var(--text))]"
                >
                  {locale === "en" ? "العربية" : "English"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[rgb(var(--border))] pt-8 text-xs text-[rgb(var(--text-muted))] md:flex-row md:items-center">
          <div>
            © {year} {d.company.name}. {d.footer.rights}
          </div>
          <div className="flex gap-4">
            <span>{d.footer.privacy}</span>
            <span>·</span>
            <span>{d.footer.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
