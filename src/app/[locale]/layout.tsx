import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { Footer } from "@/components/layout/Footer";
import { businessInfo } from "@/config/business";
import { getGtmId } from "@/config/public-env";
import { Header, StickyMobileCTA } from "@/features/landing";
import { getDeploymentUrl } from "@/lib/site-url";
import { isLocale, locales, type Locale } from "@/types/common";
import "../globals.css";

const deploymentUrl = getDeploymentUrl();
const gtmId = getGtmId();

export const metadata: Metadata = {
  metadataBase: deploymentUrl ? new URL(deploymentUrl) : undefined,
  title: {
    default: "Hermanos Wood-fired Pizza Da Nang",
    template: "%s | Hermanos Wood-fired Pizza",
  },
  description: "Wood-fired pizza, tacos, pasta, burgers and drinks near My Khe Beach in Da Nang.",
  icons: {
    icon: businessInfo.assets.logo,
    apple: businessInfo.assets.logo,
  },
  openGraph: deploymentUrl ? { images: [`${deploymentUrl}/images/food/hero-pizza-tacos.jpeg`] } : undefined,
};

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
    <html lang={locale}>
      <body className="font-sans">
        <GoogleTagManager gtmId={gtmId} />
        <Header locale={locale as Locale} />
        {children}
        <Footer locale={locale as Locale} />
        <StickyMobileCTA locale={locale as Locale} />
      </body>
    </html>
  );
}
