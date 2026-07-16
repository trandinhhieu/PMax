import { businessInfo, siteConfig } from "@/config/business";
import { faq } from "@/data/content";
import {
  getMenuItemDescription,
  menuCategories,
  menuGroups,
  menuItems,
} from "@/data/menu";
import { buildAbsoluteUrl, buildLocalizedUrl } from "@/lib/seo/metadata";
import { locales, type Locale } from "@/types/common";

const schemaContext = "https://schema.org" as const;
const openingDays = [
  "https://schema.org/Monday",
  "https://schema.org/Tuesday",
  "https://schema.org/Wednesday",
  "https://schema.org/Thursday",
  "https://schema.org/Friday",
  "https://schema.org/Saturday",
  "https://schema.org/Sunday",
];
const homeLabels = {
  en: "Home",
  vi: "Trang ch\u1EE7",
} satisfies Record<Locale, string>;

type SchemaReference = { "@id": string };

export type RestaurantSchema = {
  "@id": string;
  "@type": "Restaurant";
  acceptsReservations: true;
  address: {
    "@type": "PostalAddress";
    addressCountry: string;
    addressLocality: string;
    addressRegion: string;
    streetAddress: string;
  };
  alternateName: string;
  geo: {
    "@type": "GeoCoordinates";
    latitude: number;
    longitude: number;
  };
  hasMap: string;
  hasMenu: SchemaReference;
  image: string[];
  logo: string;
  mainEntityOfPage: SchemaReference;
  menu: string;
  name: string;
  openingHoursSpecification: Array<{
    "@type": "OpeningHoursSpecification";
    closes: string;
    dayOfWeek: string[];
    opens: string;
  }>;
  priceRange: string;
  sameAs: string[];
  servesCuisine: string[];
  telephone: string;
  url: string;
};

export type WebSiteSchema = {
  "@id": string;
  "@type": "WebSite";
  inLanguage: Locale[];
  name: string;
  publisher: SchemaReference;
  url: string;
};

export type WebPageSchema = {
  "@id": string;
  "@type": "WebPage";
  about: SchemaReference;
  breadcrumb?: SchemaReference;
  description: string;
  hasPart?: SchemaReference[];
  image: string;
  inLanguage: Locale;
  isPartOf: SchemaReference;
  mainEntity?: SchemaReference;
  name: string;
  publisher: SchemaReference;
  url: string;
};

export type MenuItemSchema = {
  "@type": "MenuItem";
  description?: string;
  identifier: string;
  name: string;
};

export type MenuSectionSchema = {
  "@type": "MenuSection";
  description?: string;
  hasMenuItem?: MenuItemSchema[];
  hasMenuSection?: MenuSectionSchema[];
  name: string;
};

export type MenuSchema = {
  "@id": string;
  "@type": "Menu";
  description: string;
  hasMenuSection: MenuSectionSchema[];
  image: string;
  inLanguage: Locale;
  mainEntityOfPage: SchemaReference;
  name: string;
  provider: SchemaReference;
  url: string;
};

export type BreadcrumbListSchema = {
  "@id": string;
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    item: string;
    name: string;
    position: number;
  }>;
};

export type FaqPageSchema = {
  "@id": string;
  "@type": "FAQPage";
  inLanguage: Locale;
  isPartOf: SchemaReference;
  mainEntity: Array<{
    "@type": "Question";
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
    name: string;
  }>;
};

export type SchemaGraph = {
  "@context": typeof schemaContext;
  "@graph": Array<
    | BreadcrumbListSchema
    | FaqPageSchema
    | MenuSchema
    | RestaurantSchema
    | WebPageSchema
    | WebSiteSchema
  >;
};

export type SchemaIds = {
  faq: string;
  menu: string;
  menuBreadcrumb: string;
  menuWebPage: string;
  privacyBreadcrumb: string;
  privacyWebPage: string;
  restaurant: string;
  webPage: string;
  website: string;
};

type PageSchemaOptions = {
  description: string;
  locale: Locale;
  siteUrl?: string;
  title: string;
};

type WebPageSchemaOptions = PageSchemaOptions & {
  breadcrumbId?: string;
  hasPartIds?: string[];
  mainEntityId?: string;
  pathname?: string;
};

type BreadcrumbSchemaOptions = {
  currentName: string;
  locale: Locale;
  pathname: "/menu" | "/privacy-policy";
  siteUrl?: string;
};

export function buildSchemaIds(
  locale: Locale,
  siteUrl = siteConfig.domain,
): SchemaIds | undefined {
  const homeUrl = buildLocalizedUrl(locale, "", siteUrl);
  const menuUrl = buildLocalizedUrl(locale, "/menu", siteUrl);
  const privacyUrl = buildLocalizedUrl(locale, "/privacy-policy", siteUrl);
  const restaurant = buildAbsoluteUrl("/#restaurant", siteUrl);
  const website = buildAbsoluteUrl("/#website", siteUrl);
  if (!homeUrl || !menuUrl || !privacyUrl || !restaurant || !website) return undefined;

  return {
    restaurant,
    website,
    webPage: `${homeUrl}#webpage`,
    faq: `${homeUrl}#faq`,
    menuWebPage: `${menuUrl}#webpage`,
    menu: `${menuUrl}#menu`,
    menuBreadcrumb: `${menuUrl}#breadcrumb`,
    privacyWebPage: `${privacyUrl}#webpage`,
    privacyBreadcrumb: `${privacyUrl}#breadcrumb`,
  };
}

export function buildRestaurantSchema(
  locale: Locale,
  siteUrl = siteConfig.domain,
): RestaurantSchema | undefined {
  const ids = buildSchemaIds(locale, siteUrl);
  const url = buildLocalizedUrl(locale, "", siteUrl);
  const menu = buildLocalizedUrl(locale, "/menu", siteUrl);
  const logo = buildAbsoluteUrl(businessInfo.assets.logo, siteUrl);
  const images = businessInfo.images.flatMap((imagePath) => {
    const image = buildAbsoluteUrl(imagePath, siteUrl);
    return image ? [image] : [];
  });
  if (!ids || !url || !menu || !logo || images.length === 0) return undefined;

  return {
    "@id": ids.restaurant,
    "@type": "Restaurant",
    name: businessInfo.displayName,
    alternateName: businessInfo.name,
    url,
    image: images,
    logo,
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
        dayOfWeek: openingDays,
        opens: businessInfo.openingHoursStructured.opens,
        closes: businessInfo.openingHoursStructured.closes,
      },
    ],
    acceptsReservations: true,
    priceRange: businessInfo.priceRange,
    menu,
    hasMenu: { "@id": ids.menu },
    hasMap: businessInfo.googleMapsUrl,
    sameAs: [...businessInfo.profiles],
    mainEntityOfPage: { "@id": ids.webPage },
  };
}

export function buildWebSiteSchema(
  siteUrl = siteConfig.domain,
): WebSiteSchema | undefined {
  const ids = buildSchemaIds(siteConfig.defaultLocale as Locale, siteUrl);
  const url = buildAbsoluteUrl("/", siteUrl);
  if (!ids || !url) return undefined;

  return {
    "@id": ids.website,
    "@type": "WebSite",
    url,
    name: businessInfo.displayName,
    publisher: { "@id": ids.restaurant },
    inLanguage: [...locales],
  };
}

export function buildWebPageSchema({
  breadcrumbId,
  description,
  hasPartIds,
  locale,
  mainEntityId,
  pathname = "",
  siteUrl = siteConfig.domain,
  title,
}: WebPageSchemaOptions): WebPageSchema | undefined {
  const ids = buildSchemaIds(locale, siteUrl);
  const url = buildLocalizedUrl(locale, pathname, siteUrl);
  const image = buildAbsoluteUrl(businessInfo.assets.ogImage, siteUrl);
  if (!ids || !url || !image) return undefined;

  return {
    "@id": `${url}#webpage`,
    "@type": "WebPage",
    url,
    name: title,
    description,
    image,
    inLanguage: locale,
    isPartOf: { "@id": ids.website },
    publisher: { "@id": ids.restaurant },
    about: { "@id": ids.restaurant },
    ...(mainEntityId ? { mainEntity: { "@id": mainEntityId } } : {}),
    ...(breadcrumbId ? { breadcrumb: { "@id": breadcrumbId } } : {}),
    ...(hasPartIds?.length
      ? { hasPart: hasPartIds.map((id) => ({ "@id": id })) }
      : {}),
  };
}

function buildMenuSections(locale: Locale): MenuSectionSchema[] {
  return menuCategories.map((category) => ({
    "@type": "MenuSection",
    name: category.label[locale],
    description: category.description[locale],
    hasMenuSection: menuGroups
      .filter((group) => group.category === category.id)
      .map((group) => ({
        "@type": "MenuSection",
        name: group.title[locale],
        ...(group.note ? { description: group.note[locale] } : {}),
        hasMenuItem: menuItems
          .filter((item) => item.groupId === group.id)
          .map((item) => {
            const description = getMenuItemDescription(item, locale);
            return {
              "@type": "MenuItem" as const,
              identifier: item.id,
              name: item.name,
              ...(description ? { description } : {}),
            };
          }),
      })),
  }));
}

export function buildMenuSchema({
  description,
  locale,
  siteUrl = siteConfig.domain,
  title,
}: PageSchemaOptions): MenuSchema | undefined {
  const ids = buildSchemaIds(locale, siteUrl);
  const url = buildLocalizedUrl(locale, "/menu", siteUrl);
  const image = buildAbsoluteUrl(businessInfo.assets.ogImage, siteUrl);
  if (!ids || !url || !image) return undefined;

  return {
    "@id": ids.menu,
    "@type": "Menu",
    url,
    name: title,
    description,
    image,
    inLanguage: locale,
    provider: { "@id": ids.restaurant },
    mainEntityOfPage: { "@id": ids.menuWebPage },
    hasMenuSection: buildMenuSections(locale),
  };
}

export function buildBreadcrumbListSchema({
  currentName,
  locale,
  pathname,
  siteUrl = siteConfig.domain,
}: BreadcrumbSchemaOptions): BreadcrumbListSchema | undefined {
  const ids = buildSchemaIds(locale, siteUrl);
  const homeUrl = buildLocalizedUrl(locale, "", siteUrl);
  const currentUrl = buildLocalizedUrl(locale, pathname, siteUrl);
  if (!ids || !homeUrl || !currentUrl) return undefined;

  return {
    "@id": pathname === "/menu" ? ids.menuBreadcrumb : ids.privacyBreadcrumb,
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: homeLabels[locale],
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: currentName,
        item: currentUrl,
      },
    ],
  };
}

export function buildFaqPageSchema(
  locale: Locale,
  siteUrl = siteConfig.domain,
): FaqPageSchema | undefined {
  const ids = buildSchemaIds(locale, siteUrl);
  if (!ids) return undefined;

  return {
    "@id": ids.faq,
    "@type": "FAQPage",
    inLanguage: locale,
    isPartOf: { "@id": ids.webPage },
    mainEntity: faq[locale].map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

export function buildHomePageGraph({
  description,
  locale,
  siteUrl = siteConfig.domain,
  title,
}: PageSchemaOptions): SchemaGraph | undefined {
  const ids = buildSchemaIds(locale, siteUrl);
  const restaurant = buildRestaurantSchema(locale, siteUrl);
  const website = buildWebSiteSchema(siteUrl);
  const faqPage = buildFaqPageSchema(locale, siteUrl);
  if (!ids || !restaurant || !website || !faqPage) return undefined;

  const webPage = buildWebPageSchema({
    locale,
    title,
    description,
    siteUrl,
    mainEntityId: ids.restaurant,
    hasPartIds: [ids.faq],
  });
  if (!webPage) return undefined;

  return {
    "@context": schemaContext,
    "@graph": [restaurant, website, webPage, faqPage],
  };
}

export function buildMenuPageGraph({
  description,
  locale,
  siteUrl = siteConfig.domain,
  title,
}: PageSchemaOptions): SchemaGraph | undefined {
  const ids = buildSchemaIds(locale, siteUrl);
  const restaurant = buildRestaurantSchema(locale, siteUrl);
  const website = buildWebSiteSchema(siteUrl);
  const menu = buildMenuSchema({ locale, title, description, siteUrl });
  const breadcrumb = buildBreadcrumbListSchema({
    locale,
    pathname: "/menu",
    currentName: title,
    siteUrl,
  });
  if (!ids || !restaurant || !website || !menu || !breadcrumb) return undefined;

  const webPage = buildWebPageSchema({
    locale,
    pathname: "/menu",
    title,
    description,
    siteUrl,
    mainEntityId: ids.menu,
    breadcrumbId: ids.menuBreadcrumb,
  });
  if (!webPage) return undefined;

  return {
    "@context": schemaContext,
    "@graph": [restaurant, website, webPage, menu, breadcrumb],
  };
}

export function buildPrivacyPageGraph({
  description,
  locale,
  siteUrl = siteConfig.domain,
  title,
}: PageSchemaOptions): SchemaGraph | undefined {
  const ids = buildSchemaIds(locale, siteUrl);
  const restaurant = buildRestaurantSchema(locale, siteUrl);
  const website = buildWebSiteSchema(siteUrl);
  const breadcrumb = buildBreadcrumbListSchema({
    locale,
    pathname: "/privacy-policy",
    currentName: title,
    siteUrl,
  });
  if (!ids || !restaurant || !website || !breadcrumb) return undefined;

  const webPage = buildWebPageSchema({
    locale,
    pathname: "/privacy-policy",
    title,
    description,
    siteUrl,
    breadcrumbId: ids.privacyBreadcrumb,
  });
  if (!webPage) return undefined;

  return {
    "@context": schemaContext,
    "@graph": [restaurant, website, webPage, breadcrumb],
  };
}
