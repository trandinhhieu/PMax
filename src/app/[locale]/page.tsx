import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FloatingActionGroup } from "@/components/layout/FloatingActionGroup";
import { JsonLd } from "@/components/seo/JsonLd";
import { BookingSection, FaqSection, GallerySection, HeroSection, MapContactSection, MenuPreview, ReviewsSection, TrustBar, WhySection } from "@/features/landing";
import { buildHomePageGraph } from "@/lib/schema";
import { buildLocalizedMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/types/common";

type PageProps = {
  params: Promise<{ locale: string }>;
};

function getLandingPageMetadata(locale: Locale) {
  return locale === "en"
    ? {
        title: "Hermanos Wood-fired Pizza Da Nang | Wood-fired Pizza Near My Khe",
        description:
          "Fresh wood-fired pizza, cold drinks, and cozy open-air dining near My Khe Beach in Da Nang. View menu, get directions or book a table.",
      }
    : {
        title: "Hermanos Wood-fired Pizza \u0110\u00E0 N\u1EB5ng | Pizza n\u01B0\u1EDBng c\u1EE7i g\u1EA7n bi\u1EC3n M\u1EF9 Kh\u00EA",
        description:
          "Th\u01B0\u1EDFng th\u1EE9c pizza n\u01B0\u1EDBng c\u1EE7i, m\u00F3n \u0103n d\u1EC5 chia s\u1EBB v\u00E0 kh\u00F4ng gian open-air g\u1EA7n bi\u1EC3n M\u1EF9 Kh\u00EA. Xem menu, ch\u1EC9 \u0111\u01B0\u1EDDng ho\u1EB7c \u0111\u1EB7t b\u00E0n nhanh.",
      };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { description, title } = getLandingPageMetadata(locale);
  return buildLocalizedMetadata({
    locale,
    title,
    description,
    includeTwitter: true,
  });
}

export default async function LandingPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const { description, title } = getLandingPageMetadata(typedLocale);
  const schemaGraph = buildHomePageGraph({
    locale: typedLocale,
    title,
    description,
  });

  return (
    <main>
      {schemaGraph ? <JsonLd data={schemaGraph} /> : null}
      <HeroSection locale={typedLocale} />
      <TrustBar locale={typedLocale} />
      <MenuPreview locale={typedLocale} />
      <BookingSection locale={typedLocale} />
      <WhySection locale={typedLocale} />
      <ReviewsSection locale={typedLocale} />
      <GallerySection locale={typedLocale} />
      <MapContactSection locale={typedLocale} />
      <FaqSection locale={typedLocale} />
      <FloatingActionGroup locale={typedLocale} />
    </main>
  );
}
