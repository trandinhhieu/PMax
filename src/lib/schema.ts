import { businessInfo, siteConfig } from "@/config/business";
import type { Locale } from "@/types/common";

export function restaurantJsonLd(locale: Locale) {
  const url = siteConfig.domain ? `${siteConfig.domain}/${locale}` : undefined;
  const sameAs = [
    businessInfo.socials.facebook,
    businessInfo.socials.instagram,
    businessInfo.socials.tripadvisor,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: businessInfo.displayName,
    image: url ? [`${siteConfig.domain}${businessInfo.assets.ogImage}`] : undefined,
    servesCuisine: businessInfo.cuisine,
    telephone: businessInfo.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: businessInfo.addressStructured.streetAddress,
      addressLocality: businessInfo.addressStructured.addressLocality,
      addressRegion: businessInfo.addressStructured.addressRegion,
      addressCountry: businessInfo.addressStructured.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: businessInfo.coordinates.latitude,
      longitude: businessInfo.coordinates.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: businessInfo.openingHoursStructured.opens,
        closes: businessInfo.openingHoursStructured.closes,
      },
    ],
    acceptsReservations: true,
    priceRange: businessInfo.priceRange,
    menu: url ? `${url}${businessInfo.menuUrl}` : undefined,
    hasMenu: url ? `${url}${businessInfo.menuUrl}` : undefined,
    hasMap: businessInfo.googleMapsUrl,
    url,
    sameAs,
  };
}
