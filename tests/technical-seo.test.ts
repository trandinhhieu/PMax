import { expect, test } from "@playwright/test";
import nextConfig from "../next.config";
import { buildRobots } from "../src/app/robots";
import { buildSitemap } from "../src/app/sitemap";
import { thankYouMetadata } from "../src/app/[locale]/thank-you/metadata";
import { MenuDirectory } from "../src/components/menu/MenuDirectory";
import { menuCategories, menuItems } from "../src/data/menu";
import {
  buildAbsoluteUrl,
  buildHreflangMap,
  buildLocalizedMetadata,
  buildLocalizedUrl,
  getSiteVerificationMetadata,
} from "../src/lib/seo/metadata";

type ElementLike = {
  props?: Record<string, unknown> & {
    children?: unknown;
  };
};

function visitElements(node: unknown, visitor: (element: ElementLike) => void) {
  if (Array.isArray(node)) {
    node.forEach((child) => visitElements(child, visitor));
    return;
  }

  if (!node || typeof node !== "object") return;

  const element = node as ElementLike;
  visitor(element);
  visitElements(element.props?.children, visitor);
}

const siteUrl = "https://www.hermanos.asia";

test("builds absolute localized URLs and hreflang alternates", () => {
  expect(buildAbsoluteUrl("/images/food/pizza.jpg", siteUrl)).toBe(
    `${siteUrl}/images/food/pizza.jpg`,
  );
  expect(buildLocalizedUrl("vi", "menu/", siteUrl)).toBe(`${siteUrl}/vi/menu`);
  expect(buildHreflangMap("/menu", siteUrl)).toEqual({
    en: `${siteUrl}/en/menu`,
    vi: `${siteUrl}/vi/menu`,
    "x-default": `${siteUrl}/en/menu`,
  });
});

test("builds localized metadata with Open Graph locale alternates", () => {
  const metadata = buildLocalizedMetadata({
    locale: "vi",
    pathname: "/menu",
    siteUrl,
    title: "Menu Hermanos",
    description: "Menu description",
  });

  expect(metadata.alternates).toEqual({
    canonical: `${siteUrl}/vi/menu`,
    languages: {
      en: `${siteUrl}/en/menu`,
      vi: `${siteUrl}/vi/menu`,
      "x-default": `${siteUrl}/en/menu`,
    },
  });
  expect(metadata.openGraph).toMatchObject({
    locale: "vi_VN",
    alternateLocale: ["en_US"],
  });
});

test("renders optional Google and Bing verification metadata", () => {
  expect(
    getSiteVerificationMetadata({
      GOOGLE_SITE_VERIFICATION: " google-token ",
      BING_SITE_VERIFICATION: " bing-token ",
    }),
  ).toEqual({
    google: "google-token",
    other: { "msvalidate.01": "bing-token" },
  });
  expect(getSiteVerificationMetadata({})).toBeUndefined();
});

test("uses permanent redirects for canonical aliases", async () => {
  const redirects = (await nextConfig.redirects?.()) ?? [];
  const canonicalAliases = ["/", "/menu", "/privacy-policy", "/thank-you"];

  for (const source of canonicalAliases) {
    expect(redirects.find((redirect) => redirect.source === source)).toMatchObject({
      permanent: true,
    });
  }
});

test("keeps thank-you pages out of the index", () => {
  expect(thankYouMetadata.robots).toMatchObject({
    follow: false,
    index: false,
  });
});

test("keeps robots and sitemap limited to canonical indexable URLs", () => {
  expect(buildRobots(siteUrl)).toMatchObject({
    rules: { allow: "/", userAgent: "*" },
    sitemap: `${siteUrl}/sitemap.xml`,
  });

  const entries = buildSitemap(siteUrl);
  expect(entries).toHaveLength(6);
  expect(entries.every((entry) => entry.lastModified === undefined)).toBe(true);
  expect(entries.some((entry) => entry.url.includes("thank-you"))).toBe(false);

  const home = entries.find((entry) => entry.url === `${siteUrl}/en`);
  const menu = entries.find((entry) => entry.url === `${siteUrl}/en/menu`);
  const privacy = entries.find((entry) => entry.url === `${siteUrl}/en/privacy-policy`);
  expect(home?.priority).toBeGreaterThan(menu?.priority ?? 0);
  expect(menu?.priority).toBeGreaterThan(privacy?.priority ?? 0);
});

test("server-renders every menu item with crawlable category anchors", () => {
  const directory = MenuDirectory({ locale: "en" }) as unknown as ElementLike;
  const renderedItemIds: string[] = [];
  const renderedIds = new Set<string>();
  const renderedHrefs = new Set<string>();

  visitElements(directory, (element) => {
    const itemId = element.props?.["data-menu-item-id"];
    const id = element.props?.id;
    const href = element.props?.href;

    if (typeof itemId === "string") renderedItemIds.push(itemId);
    if (typeof id === "string") renderedIds.add(id);
    if (typeof href === "string") renderedHrefs.add(href);
  });

  expect(new Set(renderedItemIds)).toEqual(
    new Set(menuItems.map((item) => item.id)),
  );
  expect(renderedItemIds).toHaveLength(menuItems.length);

  for (const category of menuCategories) {
    expect(renderedIds).toContain(`menu-directory-${category.id}`);
    expect(renderedHrefs).toContain(`#menu-directory-${category.id}`);
  }
});
