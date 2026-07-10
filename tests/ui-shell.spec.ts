import { expect, test, type Page } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

async function openMobileHeader(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/en`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Menu" }).click();
}

test.describe("ui shell primitives", () => {
  test("uses the readable solid header treatment at the top of utility pages", async ({ page }) => {
    await page.goto(`${baseUrl}/en/menu`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await expect(page.locator("header").first()).toHaveClass(/bg-cream\/95/);
    await expect(page.locator("header a[href='/en']").first()).toHaveClass(/text-charcoal/);
  });

  test("opens and closes the mobile header drawer", async ({ page }) => {
    await openMobileHeader(page);

    await expect(page.getByRole("dialog", { name: /hermanos navigation/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Menu", exact: true })).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();

    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(page.getByRole("dialog", { name: /hermanos navigation/i })).toBeHidden();
    await expect(page.getByRole("button", { name: "Menu", exact: true })).toBeFocused();
  });

  for (const locale of ["en", "vi"] as const) {
    for (const route of ["", "/menu"] as const) {
      test(`prioritizes the ${locale} mobile menu affordance on ${route || "home"}`, async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(`${baseUrl}/${locale}${route}`, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("networkidle");

        const menuButton = page.getByRole("button", { name: "Menu" });
        const languageSwitch = page.getByRole("link", { name: /switch language|chuyển ngôn ngữ/i });

        await expect(menuButton).toBeVisible();
        await expect(menuButton).toHaveAttribute("aria-expanded", "false");
        await expect(languageSwitch).toBeVisible();
        await expect(menuButton).toHaveClass(/min-h-12/);
        await expect(languageSwitch).toHaveClass(/text-xs/);
      });
    }
  }

  test("scrolls back to the top from the shared back-to-top control", async ({ page }) => {
    await page.goto(`${baseUrl}/en/menu`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByRole("button", { name: /back to top/i })).toBeVisible();

    await page.getByRole("button", { name: /back to top/i }).click();
    await page.waitForFunction(() => window.scrollY < 50);
    await expect(page.getByRole("button", { name: /back to top/i })).toHaveClass(/opacity-0/);
  });
  test("expands and dismisses the floating contact information", async ({ page }) => {
    await page.goto(`${baseUrl}/en/menu`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    const contactButton = page.getByRole("button", { name: "Contact Hermanos" });
    await expect(contactButton).toHaveAttribute("aria-expanded", "false");
    await contactButton.click();
    await expect(page.getByRole("region", { name: "Hermanos contact information" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Call" })).toHaveAttribute("href", /^tel:/);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("region", { name: "Hermanos contact information" })).toBeHidden();
    await expect(contactButton).toBeFocused();
  });

});
