import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { businessInfo, siteConfig } from "@/config/business";
import { MenuCatalog } from "@/features/menu";
import { getLocalizedPaths } from "@/lib/locale-routing";
import { isLocale, type Locale } from "@/types/common";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const title = locale === "en" ? "Hermanos Full Menu | Pizza, Tacos, Pasta & Drinks" : "Menu Hermanos | Pizza, Taco, Pasta & Đồ uống";
  const description =
    locale === "en"
      ? "Browse the full Hermanos menu with wood-fired pizza, pasta, salads, burgers, Mexican dishes, beer, wine and fresh drinks."
      : "Xem menu đầy đủ của Hermanos với pizza nướng củi, pasta, salad, burger, món Mexico, bia, rượu vang và đồ uống tươi.";
  const localizedPaths = getLocalizedPaths("/menu");

  return {
    title,
    description,
    alternates: {
      canonical: siteConfig.domain ? `${siteConfig.domain}/${locale}/menu` : undefined,
      languages: siteConfig.domain
        ? {
            en: `${siteConfig.domain}${localizedPaths.en}`,
            vi: `${siteConfig.domain}${localizedPaths.vi}`,
          }
        : undefined,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale,
      siteName: businessInfo.displayName,
      images: siteConfig.domain ? [`${siteConfig.domain}${businessInfo.assets.ogImage}`] : undefined,
    },
  };
}

export default async function MenuPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  return (
    <main className="bg-cream px-4 pb-14 pt-20 sm:px-6 sm:pt-24 lg:px-8" id="menu">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-tomato">{typedLocale === "en" ? "Full menu" : "Menu đầy đủ"}</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-charcoal sm:text-5xl lg:text-6xl">Hermanos menu</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
            {typedLocale === "en"
              ? "Browse wood-fired pizza, pasta, salads, burgers, Mexican plates, beer, wine and fresh drinks. Prices are shown in thousand VND."
              : "Xem pizza nướng củi, pasta, salad, burger, món Mexico, bia, rượu vang và đồ uống tươi. Giá hiển thị theo nghìn VND."}
          </p>
        </div>

        <MenuCatalog locale={typedLocale} />
      </div>
      <BackToTopButton locale={typedLocale} />
    </main>
  );
}
