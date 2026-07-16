import type { Metadata } from "next";
import { businessInfo, siteConfig } from "@/config/business";
import { locales, type Locale } from "@/types/common";

const openGraphLocales = {
  en: "en_US",
  vi: "vi_VN",
} satisfies Record<Locale, string>;

export type HreflangMap = Record<Locale | "x-default", string>;

type LocalizedMetadataOptions = {
  description: string;
  includeTwitter?: boolean;
  locale: Locale;
  pathname?: string;
  siteUrl?: string;
  title: string;
};

type SiteVerificationEnvironment = Readonly<Record<string, string | undefined>>;

function normalizeRoutePath(pathname: string) {
  const trimmedPath = pathname.trim();
  if (!trimmedPath || trimmedPath === "/") return "";
  return `/${trimmedPath.replace(/^\/+|\/+$/g, "")}`;
}

export function buildAbsoluteUrl(pathname: string, siteUrl = siteConfig.domain) {
  if (!siteUrl) return undefined;

  try {
    const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return new URL(normalizedPath, `${siteUrl.replace(/\/+$/g, "")}/`).toString();
  } catch {
    return undefined;
  }
}

export function buildLocalizedUrl(
  locale: Locale,
  pathname = "",
  siteUrl = siteConfig.domain,
) {
  return buildAbsoluteUrl(`/${locale}${normalizeRoutePath(pathname)}`, siteUrl);
}

export function buildHreflangMap(
  pathname = "",
  siteUrl = siteConfig.domain,
  defaultLocale = siteConfig.defaultLocale as Locale,
): HreflangMap | undefined {
  const en = buildLocalizedUrl("en", pathname, siteUrl);
  const vi = buildLocalizedUrl("vi", pathname, siteUrl);
  if (!en || !vi) return undefined;

  return {
    en,
    vi,
    "x-default": defaultLocale === "vi" ? vi : en,
  };
}

export function buildLocalizedMetadata({
  description,
  includeTwitter = false,
  locale,
  pathname = "",
  siteUrl = siteConfig.domain,
  title,
}: LocalizedMetadataOptions): Metadata {
  const canonical = buildLocalizedUrl(locale, pathname, siteUrl);
  const languages = buildHreflangMap(pathname, siteUrl);
  const image = buildAbsoluteUrl(businessInfo.assets.ogImage, siteUrl);
  const alternateLocale = locales
    .filter((candidateLocale) => candidateLocale !== locale)
    .map((candidateLocale) => openGraphLocales[candidateLocale]);

  return {
    title,
    description,
    alternates: canonical && languages ? { canonical, languages } : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      locale: openGraphLocales[locale],
      alternateLocale,
      siteName: businessInfo.displayName,
      images: image ? [image] : undefined,
    },
    twitter: includeTwitter
      ? {
          card: "summary_large_image",
          title,
          description,
          images: image ? [image] : undefined,
        }
      : undefined,
  };
}

export function getSiteVerificationMetadata(
  env: SiteVerificationEnvironment = process.env,
): Metadata["verification"] | undefined {
  const google = env.GOOGLE_SITE_VERIFICATION?.trim();
  const bing = env.BING_SITE_VERIFICATION?.trim();
  if (!google && !bing) return undefined;

  return {
    google: google || undefined,
    other: bing ? { "msvalidate.01": bing } : undefined,
  };
}
