import { expect, test } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

test.describe("landing navigation and ctas", () => {
  test("shows the main journey sections in order", async ({ page }) => {
    await page.goto(baseUrl + "/en", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("#menu")).toBeVisible();
    await expect(page.locator("#booking")).toBeVisible();
    await expect(page.getByRole("link", { name: "View Full Menu" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: /book a table/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /pizza/i }).first()).toHaveAttribute("aria-pressed", "true");
  });

  test("switches preview category and keeps booking anchor available", async ({ page }) => {
    await page.goto(baseUrl + "/en", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Mexican", exact: true }).click();
    await expect(page.getByRole("button", { name: "Mexican", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#booking")).toBeVisible();
    await page.locator("main").getByRole("link", { name: /view full menu/i }).click();
    await expect(page).toHaveURL(/\/en\/menu$/);
  });

  test("preserves scroll position when switching languages", async ({ page }) => {
    await page.goto(baseUrl + "/en", { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    await page.locator("#reviews").scrollIntoViewIfNeeded();
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeGreaterThan(0);

    await page.getByRole("link", { name: "Switch language to Vietnamese" }).click();

    await expect(page).toHaveURL(/\/vi$/);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollPosition - 2);
  });
});
