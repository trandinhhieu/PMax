import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/business";
import { buildLocalizedUrl } from "@/lib/seo/metadata";
import { locales } from "@/types/common";

const sitemapRoutes = [
  { changeFrequency: "weekly", pathname: "", priority: 1 },
  { changeFrequency: "weekly", pathname: "/menu", priority: 0.9 },
  { changeFrequency: "yearly", pathname: "/privacy-policy", priority: 0.2 },
] as const;

export function buildSitemap(host: string): MetadataRoute.Sitemap {
  if (!host) return [];

  return locales.flatMap((locale) =>
    sitemapRoutes.flatMap(({ changeFrequency, pathname, priority }) => {
      const url = buildLocalizedUrl(locale, pathname, host);
      return url ? [{ url, changeFrequency, priority }] : [];
    }),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteConfig.domain);
}
