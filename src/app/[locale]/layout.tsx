import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Header } from "@/components/landing/Header";
import { StickyMobileCTA } from "@/components/landing/StickyMobileCTA";
import { Footer } from "@/components/layout/Footer";
import { businessInfo } from "@/config/business";
import { getDeploymentUrl } from "@/lib/site-url";
import { isLocale, locales, type Locale } from "@/types/common";
import "../globals.css";

const deploymentUrl = getDeploymentUrl();
const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();

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
      {gtmId ? (
        <Script
          id="gtm-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':` +
              `new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],` +
              `j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=` +
              `'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);` +
              `})(window,document,'script','dataLayer','${gtmId}');`,
          }}
        />
      ) : null}
      <body className="font-sans">
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <Header locale={locale as Locale} />
        {children}
        <Footer locale={locale as Locale} />
        <StickyMobileCTA locale={locale as Locale} />
      </body>
    </html>
  );
}
