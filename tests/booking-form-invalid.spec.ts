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

async function fillPremiumCoreFields(page: Page) {
  await page.locator("#premium-date").fill(getTomorrowDate());
  for (const slot of ["20:00", "19:30", "19:00", "18:30", "18:00", "17:30"]) {
    const timeButton = page.getByRole("button", { name: new RegExp(`^${slot}`) });
    if (await timeButton.isEnabled()) {
      await timeButton.click();
      break;
    }
  }
  await page.locator("#premium-guests").fill("4");
}

async function fillValidRequiredFields(page: Page) {
  await fillPremiumCoreFields(page);
  await page.locator("#booking-contact").fill("+84905906842");
  await page.locator("#premium-name").fill("Nguyen Van A");
  await page.locator("#booking-channel").selectOption("phone");
}

test.describe("booking form invalid states", () => {
  test("shows realtime field errors while typing invalid values", async ({ page }) => {
    await gotoBookingForm(page);
    await fillPremiumCoreFields(page);

    await page.locator("#booking-contact").fill("abc");
    await page.locator("#premium-name").click();
    await expect(page.locator("#booking-contact-error")).toBeVisible();

    await page.locator("#premium-name").fill("A");
    await page.locator("#premium-date").click();
    await expect(page.locator("#premium-name-error")).toBeVisible();

    await page.locator("#premium-guests").fill("12312392");
    await page.locator("#booking-channel").click();
  });

  test("shows field errors when required fields are empty", async ({ page }) => {
    await gotoBookingForm(page);
    await fillPremiumCoreFields(page);

    await submitBookingForm(page);

    await expect(page.locator("#booking-contact")).toBeFocused();
    await expect(page.locator("#booking-contact")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#booking-contact")).toHaveAttribute("aria-describedby", "booking-contact-error");
    await expect(page.locator("#booking-contact-error")).toBeVisible();
    await expect(page.locator("#premium-name-error")).toBeVisible();
  });

  test("blocks invalid contact, past date, decimal guests, and oversized note", async ({ page }) => {
    await gotoBookingForm(page);
    await fillPremiumCoreFields(page);

    await page.locator("#booking-contact").fill("abc");
    await page.locator("#premium-name").fill("Nguyen Van A");
    await page.locator("#premium-date").evaluate((input, value) => {
      if (input instanceof HTMLInputElement) {
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, getYesterdayDate());
    await page.locator("#premium-guests").fill("2.5");
    await page.locator("#premium-note").evaluate((textarea) => {
      if (textarea instanceof HTMLTextAreaElement) {
        textarea.value = "x".repeat(301);
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    await submitBookingForm(page);

    await expect(page.locator("#booking-contact-error")).toContainText(/hợp lệ/i);
  });

  test("clears a field error after the user corrects that field", async ({ page }) => {
    await gotoBookingForm(page);
    await fillPremiumCoreFields(page);

    await page.locator("#booking-contact").fill("abc");
    await page.locator("#premium-name").fill("Nguyen Van A");

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
            contact: "Vui lòng nhập số điện thoại hoặc liên hệ chat hợp lệ.",
            time: "Vui lòng chọn giờ hợp lệ trong giờ mở cửa.",
          },
        }),
      });
    });

    await gotoBookingForm(page);
    await fillValidRequiredFields(page);
    await page.locator("#booking-contact").fill("+84abc");
    await page.locator("#booking-contact").fill("+84905906842");

    await page.locator("#booking button[type=\"submit\"]").click();

    await expect(page.getByText("Vui lòng kiểm tra các trường đang bị lỗi trước khi gửi.")).toBeVisible();
    await expect(page.getByText("Vui lòng chọn giờ hợp lệ trong giờ mở cửa.")).toBeVisible();
  });
});
