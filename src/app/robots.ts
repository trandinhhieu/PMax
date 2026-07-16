import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/business";

export function buildRobots(host: string): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: host ? `${host}/sitemap.xml` : undefined,
  };
}

export default function robots(): MetadataRoute.Robots {
  return buildRobots(siteConfig.domain);
}
