import Link from "next/link";
import { getDict, type Locale } from "@/lib/i18n";
import { Mail, MapPin } from "lucide-react";

export default function Footer({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-ink-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 via-brand-500 to-brand-700">
                <span className="font-display text-sm font-black text-white">II</span>
              </span>
              <span className="font-display text-lg font-bold">
                {d.company.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-300">
              {d.footer.tagline}
            </p>
            <div className="mt-6 space-y-2 text-sm text-ink-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-brand-400" />
                <span>{d.company.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-brand-400" />
                <a
                  href="mailto:idealailabs@gmail.com"
                  className="hover:text-white"
                >
                  idealailabs@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-200">
              {d.footer.company}
            </h4>
            <ul className="space-y-2 text-sm text-ink-300">
              <li>
                <Link href={`/${locale}#about`} className="hover:text-white">
                  {d.nav.about}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#services`} className="hover:text-white">
                  {d.nav.services}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}#contact`} className="hover:text-white">
                  {d.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ink-200">
              {d.footer.resources}
            </h4>
            <ul className="space-y-2 text-sm text-ink-300">
              <li>
                <Link href={`/${locale}#products`} className="hover:text-white">
                  {d.nav.products}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale === "en" ? "ar" : "en"}`}
                  className="hover:text-white"
                >
                  {locale === "en" ? "العربية" : "English"}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-ink-400 md:flex-row md:items-center">
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
