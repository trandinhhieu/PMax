import { expect, test, type Locator, type Page } from "@playwright/test";
import { businessInfo } from "../src/config/business";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

test.describe.configure({ mode: "serial" });

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
}

async function clickWithoutNavigation(locator: Locator) {
  await locator.evaluate((element) => {
    element.addEventListener("click", (event) => event.preventDefault(), {
      capture: true,
      once: true,
    });
  });
  await locator.click();
}

async function fillBookingForm(page: Page) {
  await page.locator("#premium-date").fill(getTomorrowDate());

  for (const slot of ["20:00", "19:30", "19:00", "18:30", "18:00", "17:30"]) {
    const timeButton = page.getByRole("button", { name: new RegExp(`^${slot}`) });
    if (await timeButton.isEnabled()) {
      await timeButton.click();
      break;
    }
  }

  await page.locator("#premium-guests").fill("4");
  await page.locator("#booking-contact").fill("+84905906842");
  await page.locator("#premium-name").fill("Analytics Test");
  await page.locator("#booking-channel").selectOption("phone");
}

async function submitBookingForm(page: Page) {
  await page.locator("#booking form").evaluate((form) => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
}

test("standardizes outbound and menu-category payloads in the data layer", async ({ page }) => {
  await page.goto(`${baseUrl}/en`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  await clickWithoutNavigation(page.getByRole("banner").getByRole("link", { name: /directions/i }));
  await clickWithoutNavigation(page.locator("#contact").locator(`a[href="${businessInfo.socials.facebook}"]`));
  await clickWithoutNavigation(page.locator(`a[href="${businessInfo.socials.instagram}"]`).first());
  await clickWithoutNavigation(page.locator(`a[href="${businessInfo.socials.tripadvisor}"]`).first());
  await clickWithoutNavigation(page.locator(`a[href="${businessInfo.socials.tiktok}"]`).first());
  await page.getByRole("button", { name: "Mexican", exact: true }).click();

  const trackedEvents = await page.evaluate(() => window.dataLayer ?? []);

  expect(trackedEvents).toContainEqual(expect.objectContaining({
    cta_type: "directions",
    event: "click_get_directions",
    location: "header",
    outbound_platform: "google_maps",
    page_language: "en",
    page_path: "/en",
  }));
  expect(trackedEvents).toContainEqual(expect.objectContaining({
    event: "click_facebook_message",
    outbound_platform: "facebook",
  }));
  expect(trackedEvents).toContainEqual(expect.objectContaining({
    event: "social_click",
    outbound_platform: "instagram",
  }));
  expect(trackedEvents).toContainEqual(expect.objectContaining({
    event: "review_click",
    outbound_platform: "tripadvisor",
  }));
  expect(trackedEvents).toContainEqual(expect.objectContaining({
    event: "social_click",
    outbound_platform: "tiktok",
  }));
  expect(trackedEvents).toContainEqual(expect.objectContaining({
    cta_type: "menu_category",
    event: "menu_category_click",
    location: "menu_preview",
    menu_category: "mexican",
    page_language: "en",
    page_path: "/en",
  }));
});

test("tracks category switches in the full menu catalog", async ({ page }) => {
  await page.goto(`${baseUrl}/en/menu`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: "Drinks", exact: true }).first().click();

  const categoryEvent = await page.evaluate(() =>
    (window.dataLayer ?? []).findLast((entry) => entry.event === "menu_category_click"),
  );

  expect(categoryEvent).toEqual(expect.objectContaining({
    cta_type: "menu_category",
    location: "menu_catalog",
    menu_category: "drinks",
    page_language: "en",
    page_path: "/en/menu",
  }));
});

test("fires booking_success once for repeated responses with the same booking key", async ({ page }) => {
  await page.route("**/api/booking", async (route) => {
    await route.fulfill({
      body: JSON.stringify({ ok: true, emailId: "email_e2e_dedupe" }),
      contentType: "application/json",
      status: 200,
    });
  });

  await page.goto(`${baseUrl}/en#booking`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  await fillBookingForm(page);
  await submitBookingForm(page);
  await expect(page.getByText("Request sent!", { exact: false })).toBeVisible();

  await fillBookingForm(page);
  await submitBookingForm(page);
  await expect(page.getByText("Request sent!", { exact: false })).toBeVisible();

  const bookingEvents = await page.evaluate(() =>
    (window.dataLayer ?? []).filter((entry) =>
      entry.event === "booking_success" || entry.event === "booking_submit",
    ),
  );
  const successEvents = bookingEvents.filter((entry) => entry.event === "booking_success");
  const submitEvents = bookingEvents.filter((entry) => entry.event === "booking_submit");

  expect(submitEvents).toHaveLength(2);
  expect(successEvents).toHaveLength(1);
  expect(successEvents[0]).toEqual(expect.objectContaining({
    cta_type: "booking",
    handoff_channel: "email",
    location: "booking_section",
    page_language: "en",
    page_path: "/en",
  }));
  expect(successEvents[0]).not.toHaveProperty("emailId");
  expect(successEvents[0]).not.toHaveProperty("email_id");
});
