import { expect, test, type Page } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const isOtpEnabled = process.env.NEXT_PUBLIC_BOOKING_OTP_ENABLED?.toLowerCase() === "true";

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
}

async function gotoBookingForm(page: Page) {
  await page.goto(`${baseUrl}/en#booking`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  await page.locator("#booking form").scrollIntoViewIfNeeded();
}

async function fillValidBookingDetails(page: Page) {
  await page.locator("#booking-name").fill("Alex Nguyen");
  await page.locator("#booking-date").fill(getTomorrowDate());
  await page.locator("#booking-time").fill("18:30");
  await page.locator("#booking-guests").fill("4");
}

test.describe("booking OTP flow", () => {
  test.skip(!isOtpEnabled, "OTP-only coverage runs with NEXT_PUBLIC_BOOKING_OTP_ENABLED=true");

  test("sends an OTP and submits the verified booking code", async ({ page }) => {
    let otpPayload: unknown;
    let bookingPayload: unknown;

    await page.route("**/api/booking/otp/start", async (route) => {
      otpPayload = route.request().postDataJSON();
      await route.fulfill({
        contentType: "application/json",
        status: 200,
        body: JSON.stringify({
          ok: true,
          message: "Verification code sent.",
        }),
      });
    });

    await page.route("**/api/booking", async (route) => {
      bookingPayload = route.request().postDataJSON();
      await route.fulfill({
        contentType: "application/json",
        status: 200,
        body: JSON.stringify({
          ok: true,
          message: "Booking request sent.",
        }),
      });
    });

    await gotoBookingForm(page);

    await page.locator("#booking-contact").fill("+84905906842");
    await page.getByRole("button", { name: "OTP" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Verification code sent by SMS." })).toBeVisible();
    await expect(page.locator("#booking-otp")).toBeVisible();

    await fillValidBookingDetails(page);
    await page.locator("#booking-otp").fill("123456");
    await page.getByRole("button", { name: "Send booking request" }).click();

    await expect(page.getByRole("status").filter({ hasText: "Your booking request has been sent" })).toBeVisible();
    expect(otpPayload).toMatchObject({ contact: "+84905906842" });
    expect(bookingPayload).toMatchObject({
      contact: "+84905906842",
      contactChannel: "phone",
      locale: "en",
      name: "Alex Nguyen",
      otpCode: "123456",
    });
  });

  test("requires a fresh OTP after the phone number changes", async ({ page }) => {
    await page.route("**/api/booking/otp/start", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        status: 200,
        body: JSON.stringify({
          ok: true,
          message: "Verification code sent.",
        }),
      });
    });

    await gotoBookingForm(page);

    await page.locator("#booking-contact").fill("+84905906842");
    await page.getByRole("button", { name: "OTP" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Verification code sent by SMS." })).toBeVisible();

    await page.locator("#booking-otp").fill("123456");
    await page.locator("#booking-contact").fill("+84905906843");

    await expect(page.locator("#booking-otp")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#booking-otp")).toHaveAttribute("aria-describedby", "booking-otp-error");
    await expect(page.locator("#booking-otp-error")).toContainText("Please request a new SMS verification code");
  });
});
