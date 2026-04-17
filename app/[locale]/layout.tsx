import { notFound } from "next/navigation";
import { locales, type Locale, getDict } from "@/lib/i18n";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const d = getDict(locale as Locale);

  return (
    <div
      dir={d.dir}
      lang={locale}
      className={locale === "ar" ? "font-arabic" : ""}
      suppressHydrationWarning
    >
      <Nav locale={locale as Locale} />
      <main>{children}</main>
      <Footer locale={locale as Locale} />
    </div>
  );
}
