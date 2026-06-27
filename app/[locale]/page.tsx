import Hero from "@/components/Hero";
import Services from "@/components/Services";
import DemoShowcase from "@/components/DemoShowcase";
import Products from "@/components/Products";
import Approach from "@/components/Approach";
import Contact from "@/components/Contact";
import { locales, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const l = locale as Locale;

  return (
    <>
      <Hero locale={l} />
      <Services locale={l} />
      <DemoShowcase locale={l} />
      <Products locale={l} />
      <Approach locale={l} />
      <Contact locale={l} />
    </>
  );
}
