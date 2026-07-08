import { expect, test, type Page } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

function getYesterdayDate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function getTomorrowDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

async function gotoBookingForm(page: Page) {
  await page.goto(`${baseUrl}/vi#booking`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  await page.locator("#booking form").scrollIntoViewIfNeeded();
}

async function submitBookingForm(page: Page) {
  await page.locator("#booking form").evaluate((form) => {
    if (form instanceof HTMLFormElement) {
      form.requestSubmit();
    }
  });
}

function bookingSummaryAlert(page: Page) {
  return page.locator("#booking form div[role='alert']").first();
}

async function fillValidRequiredFields(page: Page) {
  await page.locator("#booking-contact").fill("+84905906842");
  await page.locator("#booking-name").fill("Nguyen Van A");
  await page.locator("#booking-date").fill(getTomorrowDate());
  await page.locator("#booking-time").fill("18:30");
  await page.locator("#booking-guests").fill("4");
  await page.locator("#booking-channel").selectOption("phone");
}

test.describe("booking form invalid states", () => {
  test("shows realtime field errors while typing invalid values", async ({ page }) => {
    await gotoBookingForm(page);

    await page.locator("#booking-contact").fill("abc");
    await page.locator("#booking-name").click();
    await expect(page.locator("#booking-contact-error")).toBeVisible();

    await page.locator("#booking-name").fill("A");
    await page.locator("#booking-date").click();
    await expect(page.locator("#booking-name-error")).toBeVisible();

    await page.locator("#booking-guests").fill("12312392");
    await page.locator("#booking-channel").click();
    await expect(page.locator("#booking-guests-error")).toBeVisible();
  });

  test("shows field errors when required fields are empty", async ({ page }) => {
    await gotoBookingForm(page);

    await submitBookingForm(page);

    await expect(bookingSummaryAlert(page)).toBeVisible();
    await expect(page.locator("#booking-contact-error")).toBeVisible();
    await expect(page.locator("#booking-name-error")).toBeVisible();
    await expect(page.locator("#booking-date-error")).toBeVisible();
    await expect(page.locator("#booking-time-error")).toBeVisible();
  });

  test("blocks invalid contact, past date, out-of-hours time, decimal guests, and oversized note", async ({ page }) => {
    await gotoBookingForm(page);

    await page.locator("#booking-contact").fill("abc");
    await page.locator("#booking-name").fill("Nguyen Van A");
    await page.locator("#booking-date").evaluate((input, value) => {
      if (input instanceof HTMLInputElement) {
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, getYesterdayDate());
    await page.locator("#booking-time").evaluate((input) => {
      if (input instanceof HTMLInputElement) {
        input.value = "12:00";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    await page.locator("#booking-guests").fill("2.5");
    await page.locator("#booking-note").evaluate((textarea) => {
      if (textarea instanceof HTMLTextAreaElement) {
        textarea.value = "x".repeat(301);
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    await submitBookingForm(page);

    await expect(bookingSummaryAlert(page)).toBeVisible();
    await expect(page.locator("#booking-contact-error")).toContainText(/hợp lệ|phone/i);
    await expect(page.locator("#booking-date-error")).toContainText(/date|ngày|today|future|hợp lệ/i);
    await expect(page.locator("#booking-time-error")).toContainText(/giờ|time|between/i);
    await expect(page.locator("#booking-guests-error")).toContainText(/số khách nguyên|whole number/i);
  });

  test("clears a field error after the user corrects that field", async ({ page }) => {
    await gotoBookingForm(page);

    await page.locator("#booking-contact").fill("abc");
    await page.locator("#booking-name").fill("Nguyen Van A");
    await page.locator("#booking-date").fill(getTomorrowDate());
    await page.locator("#booking-time").fill("18:30");
    await page.locator("#booking-guests").fill("4");

    await submitBookingForm(page);
    await expect(page.locator("#booking-contact-error")).toBeVisible();

    await page.locator("#booking-contact").fill("+84905906842");

    await expect(page.locator("#booking-contact-error")).toHaveCount(0);
  });

  test("renders server fieldErrors on the matching fields", async ({ page }) => {
    await page.route("**/api/booking", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        status: 400,
        body: JSON.stringify({
          ok: false,
          message: "Invalid booking request.",
          fieldErrors: {
            contact: "Please enter a valid phone number.",
            time: "Please choose a time between 16:00 and 23:00.",
          },
        }),
      });
    });

    await gotoBookingForm(page);
    await fillValidRequiredFields(page);

    await page.locator("#booking-contact").fill("+84abc");
    await page.locator("#booking-time").evaluate((input) => {
      if (input instanceof HTMLInputElement) {
        input.value = "12:00";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    await page.locator("#booking-contact").fill("+84905906842");
    await page.locator("#booking-time").fill("18:30");

    await page.getByRole("button", { name: /Gửi yêu cầu|Send booking request/i }).click();

    await expect(bookingSummaryAlert(page)).toBeVisible();
    await expect(page.locator("#booking-contact-error")).toBeVisible();
    await expect(page.locator("#booking-time-error")).toBeVisible();
  });
});
