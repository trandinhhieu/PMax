import { expect, test } from "@playwright/test";
import { menuCategories, menuGroups, menuItems } from "../src/data/menu";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test.describe("menu and supporting pages", () => {
  test.describe.configure({ mode: "serial" });

  test("returns the complete menu directory in raw server HTML", async ({ request }) => {
    const response = await request.get(`${baseUrl}/en/menu`);
    const html = await response.text();
    const renderedItemIds = [
      ...html.matchAll(/data-menu-item-id="([^"]+)"/g),
    ].map((match) => match[1]);

    expect(response.ok()).toBe(true);
    expect(new Set(renderedItemIds)).toEqual(
      new Set(menuItems.map((item) => item.id)),
    );

    for (const category of menuCategories) {
      expect(html).toContain(`href="#menu-directory-${category.id}"`);
    }
  });

  test("supports desktop category and group navigation with clear next actions", async ({ page }) => {
    const drinksCategory = menuCategories.find((category) => category.id === "drinks") ?? menuCategories[menuCategories.length - 1]!;
    const nextCategory = menuCategories[(menuCategories.findIndex((category) => category.id === drinksCategory.id) + 1) % menuCategories.length]!;
    const firstGroup = menuGroups.find((group) => group.category === drinksCategory.id)!;

    await page.goto(`${baseUrl}/en/menu`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: drinksCategory.label.en, exact: true }).click();
    await expect(page.locator("#menu-catalog")).toContainText(drinksCategory.description.en);
    await expect(page.getByText("No photo yet").first()).toBeVisible();

    await page.getByRole("button", { name: new RegExp(escapeRegExp(firstGroup.title.en)) }).click();
    await expect(page.locator("#menu-items h4").filter({ hasText: firstGroup.title.en }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /show all groups/i })).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const nextAction = page.getByRole("button", { name: new RegExp(`^Explore ${escapeRegExp(nextCategory.label.en)}$`) });
    await expect(nextAction).toBeVisible();
    await nextAction.click();

    await expect(page.locator("#menu-catalog")).toContainText(nextCategory.description.en);
  });

  test("keeps sticky menu controls available on mobile", async ({ page }) => {
    const defaultCategory = menuCategories[0]!;
    const firstGroup = menuGroups.find((group) => group.category === defaultCategory.id)!;

    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${baseUrl}/en/menu`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await page.locator("#menu-catalog").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 320));
    const stickyBar = page.locator("#menu-catalog > div").first();
    await expect(stickyBar).toBeVisible();
    const navBox = await stickyBar.boundingBox();
    expect(navBox?.y ?? 999).toBeLessThanOrEqual(120);

    await page.getByRole("button", { name: new RegExp(escapeRegExp(firstGroup.title.en)) }).click();
    await expect(page.locator("#menu-items h4").filter({ hasText: firstGroup.title.en }).first()).toBeVisible();

    const itemsBox = await page.locator("#menu-items").boundingBox();
    const stickyBox = await stickyBar.boundingBox();
    expect(itemsBox).not.toBeNull();
    expect(stickyBox).not.toBeNull();
    expect(itemsBox!.y).toBeGreaterThanOrEqual(stickyBox!.y + stickyBox!.height);
    expect(itemsBox!.y).toBeLessThanOrEqual(stickyBox!.y + stickyBox!.height + 24);

    const nextCategory = menuCategories[1]!;
    await page.getByRole("button", { name: nextCategory.label.en, exact: true }).click();
    const switchedStickyBox = await stickyBar.boundingBox();
    expect(switchedStickyBox).not.toBeNull();
    expect(switchedStickyBox!.y).toBeLessThanOrEqual(72);
  });

  test("respects reduced motion during menu navigation scrolling", async ({ page }) => {
    const drinksCategory = menuCategories.find((category) => category.id === "drinks") ?? menuCategories[menuCategories.length - 1]!;

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      const scrollCalls: ScrollToOptions[] = [];
      const originalScrollTo = window.scrollTo.bind(window);

      window.scrollTo = ((...args: Parameters<typeof window.scrollTo>) => {
        const [firstArg] = args;
        if (typeof firstArg === "object") {
          scrollCalls.push(firstArg);
        }
        return originalScrollTo(...args);
      }) as typeof window.scrollTo;

      Object.defineProperty(window, "__menuScrollCalls", {
        value: scrollCalls,
      });
    });

    await page.goto(`${baseUrl}/en/menu`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: drinksCategory.label.en, exact: true }).click();
    await expect(page.locator("#menu-catalog")).toContainText(drinksCategory.description.en);

    const scrollCalls = await page.evaluate(() => (window as unknown as { __menuScrollCalls: ScrollToOptions[] }).__menuScrollCalls);
    expect(scrollCalls.some((call) => call.behavior === "auto")).toBe(true);
  });

  test("renders supporting pages with localized Vietnamese copy", async ({ page }) => {
    await page.goto(`${baseUrl}/vi/privacy-policy`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Chính sách riêng tư" })).toBeVisible();
    await expect(page.getByText("Yêu cầu đặt bàn")).toBeVisible();

    await page.request.get(`${baseUrl}/vi/thank-you`);
    await page.goto(`${baseUrl}/vi/thank-you`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { name: "Cảm ơn bạn" })).toBeVisible();
    await expect(page.getByText("Đã nhận yêu cầu", { exact: true })).toBeVisible();
  });
});
