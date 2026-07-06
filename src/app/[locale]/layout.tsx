import { notFound } from "next/navigation";
import { Header } from "@/components/landing/Header";
import { StickyMobileCTA } from "@/components/landing/StickyMobileCTA";
import { Footer } from "@/components/layout/Footer";
import { isLocale, locales, type Locale } from "@/types/common";

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

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <>
      <Header locale={locale as Locale} />
      {children}
      <Footer locale={locale as Locale} />
      <StickyMobileCTA locale={locale as Locale} />
    </>
  );
}
