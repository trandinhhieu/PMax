import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/business";
import { locales } from "@/types/common";

export default function sitemap(): MetadataRoute.Sitemap {
  const host = siteConfig.domain;
  if (!host) return [];

  const routes = ["", "/menu", "/privacy-policy"];

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${host}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : 0.7,
    })),
  );
}
