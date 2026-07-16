import { expect, test } from "@playwright/test";
import { faq } from "../src/data/content";
import { menuCategories, menuGroups, menuItems } from "../src/data/menu";
import {
  buildBreadcrumbListSchema,
  buildFaqPageSchema,
  buildHomePageGraph,
  buildMenuPageGraph,
  buildMenuSchema,
  buildPrivacyPageGraph,
  buildRestaurantSchema,
  buildSchemaIds,
  buildWebPageSchema,
  buildWebSiteSchema,
} from "../src/lib/schema";

const siteUrl = "https://www.hermanos.asia";
const absoluteUrlKeys = new Set([
  "@context",
  "@id",
  "dayOfWeek",
  "hasMap",
  "image",
  "item",
  "logo",
  "menu",
  "sameAs",
  "url",
]);

function required<T>(value: T | undefined): T {
  expect(value).toBeDefined();
  if (value === undefined) throw new Error("Expected schema builder output");
  return value;
}

function expectProductionSafe(value: unknown, key?: string) {
  expect(value).not.toBeUndefined();

  if (typeof value === "string") {
    if (key && absoluteUrlKeys.has(key)) expect(value).toMatch(/^https:\/\//);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => expectProductionSafe(item, key));
    return;
  }

  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([entryKey, entryValue]) => {
    expectProductionSafe(entryValue, entryKey);
  });
}

test("builds stable entity IDs for each locale", () => {
  expect(buildSchemaIds("en", siteUrl)).toEqual({
    restaurant: `${siteUrl}/#restaurant`,
    website: `${siteUrl}/#website`,
    webPage: `${siteUrl}/en#webpage`,
    faq: `${siteUrl}/en#faq`,
    menuWebPage: `${siteUrl}/en/menu#webpage`,
    menu: `${siteUrl}/en/menu#menu`,
    menuBreadcrumb: `${siteUrl}/en/menu#breadcrumb`,
    privacyWebPage: `${siteUrl}/en/privacy-policy#webpage`,
    privacyBreadcrumb: `${siteUrl}/en/privacy-policy#breadcrumb`,
  });
  expect(buildSchemaIds("vi", siteUrl)?.menu).toBe(`${siteUrl}/vi/menu#menu`);
});

test("builds the Restaurant entity from canonical business data", () => {
  const restaurant = required(buildRestaurantSchema("vi", siteUrl));

  expect(restaurant).toMatchObject({
    "@id": `${siteUrl}/#restaurant`,
    "@type": "Restaurant",
    url: `${siteUrl}/vi`,
    menu: `${siteUrl}/vi/menu`,
    hasMenu: { "@id": `${siteUrl}/vi/menu#menu` },
    telephone: "+84905906842",
    priceRange: "$$",
  });
  expect(restaurant.sameAs.length).toBeGreaterThanOrEqual(4);
  expect(restaurant).not.toHaveProperty("aggregateRating");
  expect(restaurant).not.toHaveProperty("review");
  expectProductionSafe(restaurant);
});

test("builds linked WebSite and WebPage entities", () => {
  const website = required(buildWebSiteSchema(siteUrl));
  const webPage = required(
    buildWebPageSchema({
      locale: "en",
      pathname: "/menu",
      title: "Hermanos menu",
      description: "Full menu",
      mainEntityId: `${siteUrl}/en/menu#menu`,
      breadcrumbId: `${siteUrl}/en/menu#breadcrumb`,
      siteUrl,
    }),
  );

  expect(website).toMatchObject({
    "@id": `${siteUrl}/#website`,
    publisher: { "@id": `${siteUrl}/#restaurant` },
  });
  expect(webPage).toMatchObject({
    "@id": `${siteUrl}/en/menu#webpage`,
    url: `${siteUrl}/en/menu`,
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntity: { "@id": `${siteUrl}/en/menu#menu` },
    breadcrumb: { "@id": `${siteUrl}/en/menu#breadcrumb` },
  });
  expectProductionSafe(website);
  expectProductionSafe(webPage);
});

test("builds a localized Menu from every rendered group and item", () => {
  const menu = required(
    buildMenuSchema({
      locale: "vi",
      title: "Menu Hermanos",
      description: "Menu description",
      siteUrl,
    }),
  );
  const structuredGroups = menu.hasMenuSection.flatMap(
    (category) => category.hasMenuSection ?? [],
  );
  const structuredItems = structuredGroups.flatMap((group) => group.hasMenuItem ?? []);

  expect(menu).toMatchObject({
    "@id": `${siteUrl}/vi/menu#menu`,
    url: `${siteUrl}/vi/menu`,
    inLanguage: "vi",
    provider: { "@id": `${siteUrl}/#restaurant` },
  });
  expect(menu.hasMenuSection).toHaveLength(menuCategories.length);
  expect(structuredGroups).toHaveLength(menuGroups.length);
  expect(structuredItems).toHaveLength(menuItems.length);
  expectProductionSafe(menu);
});

test("builds localized breadcrumb and FAQ nodes from visible copy", () => {
  const breadcrumb = required(
    buildBreadcrumbListSchema({
      locale: "vi",
      pathname: "/privacy-policy",
      currentName: "Ch\u00EDnh s\u00E1ch ri\u00EAng t\u01B0",
      siteUrl,
    }),
  );
  const faqPage = required(buildFaqPageSchema("en", siteUrl));

  expect(breadcrumb.itemListElement).toEqual([
    {
      "@type": "ListItem",
      position: 1,
      name: "Trang ch\u1EE7",
      item: `${siteUrl}/vi`,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Ch\u00EDnh s\u00E1ch ri\u00EAng t\u01B0",
      item: `${siteUrl}/vi/privacy-policy`,
    },
  ]);
  expect(faqPage.mainEntity).toHaveLength(faq.en.length);
  expect(faqPage.mainEntity[0]).toMatchObject({
    name: faq.en[0]?.[0],
    acceptedAnswer: { text: faq.en[0]?.[1] },
  });
  expectProductionSafe(breadcrumb);
  expectProductionSafe(faqPage);
});

test("builds parseable linked graphs for homepage, menu and privacy", () => {
  const homeGraph = required(
    buildHomePageGraph({
      locale: "en",
      title: "Hermanos",
      description: "Homepage description",
      siteUrl,
    }),
  );
  const menuGraph = required(
    buildMenuPageGraph({
      locale: "vi",
      title: "Menu Hermanos",
      description: "Menu description",
      siteUrl,
    }),
  );
  const privacyGraph = required(
    buildPrivacyPageGraph({
      locale: "en",
      title: "Privacy policy",
      description: "Privacy description",
      siteUrl,
    }),
  );

  expect(homeGraph["@graph"].map((node) => node["@type"])).toEqual([
    "Restaurant",
    "WebSite",
    "WebPage",
    "FAQPage",
  ]);
  expect(menuGraph["@graph"].map((node) => node["@type"])).toContain("Menu");
  expect(privacyGraph["@graph"].map((node) => node["@type"])).toContain(
    "BreadcrumbList",
  );

  for (const graph of [homeGraph, menuGraph, privacyGraph]) {
    expect(JSON.parse(JSON.stringify(graph))).toEqual(graph);
    expect(JSON.stringify(graph)).not.toContain("undefined");
    expectProductionSafe(graph);
  }
});
