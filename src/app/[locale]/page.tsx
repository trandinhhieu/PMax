import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/landing/BookingForm";
import { FaqSection } from "@/components/landing/FaqSection";
import { GallerySection } from "@/components/landing/GallerySection";
import { HeroSection } from "@/components/landing/HeroSection";
import { MapContactSection } from "@/components/landing/MapContactSection";
import { MenuPreview } from "@/components/landing/MenuPreview";
import { ReviewsSection } from "@/components/landing/ReviewsSection";
import { TrustBar } from "@/components/landing/TrustBar";
import { WhySection } from "@/components/landing/WhySection";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { businessInfo, siteConfig } from "@/config/business";
import { restaurantJsonLd } from "@/lib/schema";
import { isLocale, type Locale } from "@/types/common";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const title =
    locale === "en"
      ? "Hermanos Wood-fired Pizza Da Nang | Wood-fired Pizza Near My Khe"
      : "Hermanos Wood-fired Pizza Đà Nẵng | Pizza nướng củi gần biển Mỹ Khê";
  const description =
    locale === "en"
      ? "Fresh wood-fired pizza, cold drinks, and cozy open-air dining near My Khe Beach in Da Nang. View menu, get directions or book a table."
      : "Thưởng thức pizza nướng củi, món ăn dễ chia sẻ và không gian open-air gần biển Mỹ Khê. Xem menu, chỉ đường hoặc đặt bàn nhanh.";

  return {
    title,
    description,
    alternates: {
      canonical: siteConfig.domain ? `${siteConfig.domain}/${locale}` : undefined,
      languages:
        siteConfig.domain
          ? {
              en: `${siteConfig.domain}/en`,
              vi: `${siteConfig.domain}/vi`,
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: siteConfig.domain ? [`${siteConfig.domain}${businessInfo.assets.ogImage}`] : undefined,
    },
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;

  return (
    <main>
      <JsonLd data={restaurantJsonLd(typedLocale)} />
      <HeroSection locale={typedLocale} />
      <TrustBar locale={typedLocale} />
      <MenuPreview locale={typedLocale} />
      <WhySection locale={typedLocale} />
      <GallerySection locale={typedLocale} />
      <ReviewsSection locale={typedLocale} />
      <BookingForm locale={typedLocale} />
      <MapContactSection locale={typedLocale} />
      <FaqSection locale={typedLocale} />
      <BackToTopButton locale={typedLocale} />
    </main>
  );
}
