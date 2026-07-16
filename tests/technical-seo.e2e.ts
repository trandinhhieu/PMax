import { expect, test, type Page } from "@playwright/test";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hermanos.asia";

type SchemaNode = {
  "@id": string;
  "@type": string;
  [key: string]: unknown;
};

type SchemaGraph = {
  "@context": string;
  "@graph": SchemaNode[];
};

async function getSchemaGraph(page: Page) {
  const scripts = page.locator('script[type="application/ld+json"]');
  await expect(scripts).toHaveCount(1);
  const text = await scripts.first().textContent();
  expect(text).not.toBeNull();

  const graph = JSON.parse(text ?? "{}") as SchemaGraph;
  expect(graph["@context"]).toBe("https://schema.org");
  expect(Array.isArray(graph["@graph"])).toBe(true);
  return graph;
}

function getSchemaNode(graph: SchemaGraph, type: string) {
  const node = graph["@graph"].find((candidate) => candidate["@type"] === type);
  expect(node).toBeDefined();
  if (!node) throw new Error(`Missing ${type} schema node`);
  return node;
}

async function expectLanguageAlternates(page: Page, pathname = "") {
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    "href",
    `${siteUrl}/en${pathname}`,
  );
  await expect(page.locator('link[rel="alternate"][hreflang="vi"]')).toHaveAttribute(
    "href",
    `${siteUrl}/vi${pathname}`,
  );
  await expect(
    page.locator('link[rel="alternate"][hreflang="x-default"]'),
  ).toHaveAttribute("href", `${siteUrl}/en${pathname}`);
}

test("renders canonical, hreflang and localized Open Graph metadata", async ({ page }) => {
  await page.goto("/en");

  await expect(page).toHaveTitle(/Hermanos Wood-fired Pizza Da Nang/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Fresh wood-fired pizza/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${siteUrl}/en`);
  await expectLanguageAlternates(page);
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "en_US");
  await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveAttribute(
    "content",
    "vi_VN",
  );

  await page.goto("/vi/menu");
  await expect(page).toHaveTitle(/Menu Hermanos/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /VND/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteUrl}/vi/menu`,
  );
  await expectLanguageAlternates(page, "/menu");
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "vi_VN");
});

test("uses the metadata helper on privacy policy pages", async ({ page }) => {
  await page.goto("/en/privacy-policy");

  await expect(page).toHaveTitle(/Privacy policy/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /booking contact information/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${siteUrl}/en/privacy-policy`,
  );
  await expectLanguageAlternates(page, "/privacy-policy");
});

test("renders linked localized structured data graphs", async ({ page }) => {
  await page.goto("/en");
  const homeGraph = await getSchemaGraph(page);
  const restaurant = getSchemaNode(homeGraph, "Restaurant");
  const website = getSchemaNode(homeGraph, "WebSite");
  const homePage = getSchemaNode(homeGraph, "WebPage");
  const faqPage = getSchemaNode(homeGraph, "FAQPage");

  expect(restaurant["@id"]).toBe(`${siteUrl}/#restaurant`);
  expect(restaurant.url).toBe(`${siteUrl}/en`);
  expect(restaurant.menu).toBe(`${siteUrl}/en/menu`);
  expect(restaurant.hasMenu).toEqual({ "@id": `${siteUrl}/en/menu#menu` });
  expect(website.publisher).toEqual({ "@id": `${siteUrl}/#restaurant` });
  expect(homePage["@id"]).toBe(`${siteUrl}/en#webpage`);
  expect(homePage.mainEntity).toEqual({ "@id": `${siteUrl}/#restaurant` });
  expect(faqPage.mainEntity).toHaveLength(3);
  expect(JSON.stringify(homeGraph)).not.toContain("aggregateRating");
  expect(JSON.stringify(homeGraph)).not.toContain("undefined");

  await page.goto("/vi/menu");
  const menuGraph = await getSchemaGraph(page);
  const menu = getSchemaNode(menuGraph, "Menu");
  const menuPage = getSchemaNode(menuGraph, "WebPage");
  const menuBreadcrumb = getSchemaNode(menuGraph, "BreadcrumbList");
  const menuItems = menuBreadcrumb.itemListElement as Array<Record<string, unknown>>;

  expect(menu["@id"]).toBe(`${siteUrl}/vi/menu#menu`);
  expect(menu.url).toBe(`${siteUrl}/vi/menu`);
  expect(menu.inLanguage).toBe("vi");
  expect(menuPage.mainEntity).toEqual({ "@id": `${siteUrl}/vi/menu#menu` });
  expect(menuPage.breadcrumb).toEqual({ "@id": `${siteUrl}/vi/menu#breadcrumb` });
  expect(menuItems.at(-1)?.item).toBe(`${siteUrl}/vi/menu`);

  await page.goto("/en/privacy-policy");
  const privacyGraph = await getSchemaGraph(page);
  const privacyPage = getSchemaNode(privacyGraph, "WebPage");
  const privacyBreadcrumb = getSchemaNode(privacyGraph, "BreadcrumbList");
  const privacyItems = privacyBreadcrumb.itemListElement as Array<Record<string, unknown>>;

  expect(privacyPage["@id"]).toBe(`${siteUrl}/en/privacy-policy#webpage`);
  expect(privacyPage.breadcrumb).toEqual({
    "@id": `${siteUrl}/en/privacy-policy#breadcrumb`,
  });
  expect(privacyItems.at(-1)?.item).toBe(`${siteUrl}/en/privacy-policy`);
});

test("keeps thank-you pages noindex and renders verification tokens", async ({ page }) => {
  await page.goto("/en/thank-you");

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /nofollow/);
  await expect(page.locator('meta[name="google-site-verification"]')).toHaveAttribute(
    "content",
    "seo-google-test-token",
  );
  await expect(page.locator('meta[name="msvalidate.01"]')).toHaveAttribute(
    "content",
    "seo-bing-test-token",
  );
});

test("serves stable robots and sitemap output", async ({ request }) => {
  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.ok()).toBe(true);
  const robotsText = await robotsResponse.text();
  expect(robotsText).toContain("User-Agent: *");
  expect(robotsText).toContain("Allow: /");
  expect(robotsText).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);

  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBe(true);
  expect(sitemapResponse.headers()["content-type"]).toContain("application/xml");
  const sitemapText = await sitemapResponse.text();
  expect(sitemapText).toContain(`<loc>${siteUrl}/en</loc>`);
  expect(sitemapText).toContain(`<loc>${siteUrl}/vi/menu</loc>`);
  expect(sitemapText).not.toContain("thank-you");
  expect(sitemapText).not.toContain("<lastmod>");
  expect(sitemapText).toContain("<priority>0.2</priority>");
});
