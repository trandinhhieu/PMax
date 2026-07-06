import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/business";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: siteConfig.domain ? `${siteConfig.domain}/sitemap.xml` : undefined,
  };
}
