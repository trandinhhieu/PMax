import { expect, test } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
}

test("Vietnamese booking form enables submit only when valid, handles contact channel, and clears after success", async ({ page }) => {
  await page.goto(baseUrl + "/vi#booking", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  const submitButton = page.locator("#booking button[type=\"submit\"]");
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeDisabled();

  await page.locator("#premium-date").fill(getTomorrowDate());
  for (const slot of ["20:00", "19:30", "19:00", "18:30", "18:00", "17:30"]) {
    const timeButton = page.getByRole("button", { name: new RegExp(`^${slot}`) });
    if (await timeButton.isEnabled()) {
      await timeButton.click();
      break;
    }
  }
  await page.locator("#premium-guests").fill("4");

  await expect(submitButton).toBeEnabled();

  await page.locator("#booking-contact").fill("+84905906842");
  await page.locator("#premium-name").fill("Nguyễn Văn A");

  const contactChannel = page.locator("#booking-channel");
  await expect(contactChannel).toBeVisible();
  await contactChannel.selectOption("zalo");

  await page.locator("#booking form").evaluate((form) => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });

  await expect(submitButton).toBeVisible();
  await expect(page.locator("#booking-contact")).toBeVisible();
  await expect(page.locator("#booking-channel")).toHaveValue("zalo");
});
