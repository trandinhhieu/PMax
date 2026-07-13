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
  await expect(page.locator("#premium-custom-time")).toHaveValue(/\d{2}:\d{2}/);

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

test("preset and custom times share one validated booking value", async ({ page }) => {
  await page.goto(baseUrl + "/vi#booking", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  await page.locator("#premium-date").fill(getTomorrowDate());
  const preset = page.getByRole("button", { name: /^20:00/ });
  if (await preset.isEnabled()) {
    await preset.click();
    await expect(page.locator("#premium-custom-time")).toHaveValue("20:00");
  }

  await page.locator("#premium-custom-time").fill("18:45");
  await expect(page.locator("#premium-custom-time")).toHaveValue("18:45");
  await expect(page.getByRole("button", { name: /^20:00/ })).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByText("Vui lòng chọn giờ hợp lệ trong giờ mở cửa.")).toHaveCount(0);
});

test("today only shows preset slots later than the Hermanos local time", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-07-13T10:15:00Z"));
  await page.goto(baseUrl + "/en#booking", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  await page.locator("#premium-date").fill("2026-07-13");

  for (const elapsedSlot of ["16:00", "16:30", "17:00"]) {
    await expect(page.getByRole("button", { name: new RegExp(`^${elapsedSlot}`) })).toHaveCount(0);
  }

  for (const futureSlot of ["17:30", "18:00", "22:30"]) {
    await expect(page.getByRole("button", { name: new RegExp(`^${futureSlot}`) })).toHaveCount(1);
  }
});

test("mobile WebKit contains native date/time controls and hides fixed actions while typing", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(baseUrl + "/vi#booking", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");

  for (const selector of ["#premium-date", "#premium-custom-time"]) {
    const input = page.locator(selector);
    const inputBox = await input.boundingBox();
    const formBox = await page.locator("#booking form").boundingBox();

    expect(inputBox).not.toBeNull();
    expect(formBox).not.toBeNull();
    expect(inputBox!.x).toBeGreaterThanOrEqual(formBox!.x);
    expect(inputBox!.x + inputBox!.width).toBeLessThanOrEqual(formBox!.x + formBox!.width + 0.5);
  }

  await page.locator("#premium-date").fill(getTomorrowDate());
  await page.locator("#premium-custom-time").fill("18:45");
  await page.locator("#premium-custom-time").blur();

  const fixedActions = page.locator("[data-mobile-fixed-action]");
  await expect(fixedActions.first()).toBeVisible();
  await page.locator("#booking-contact").focus();

  await expect(fixedActions.first()).toHaveCSS("visibility", "hidden");
  await expect(fixedActions.last()).toHaveCSS("visibility", "hidden");

  await page.locator("#booking-contact").blur();
  await expect(fixedActions.first()).toHaveCSS("visibility", "visible");
});
