import { expect, test } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().slice(0, 10);
}

test("Vietnamese booking form enables submit only when valid, handles contact channel, and clears after success", async ({ page }) => {
  let bookingPayload: unknown;

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

  await page.goto(`${baseUrl}/vi#booking`, { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  await page.getByRole("heading", { name: "Đặt bàn cho tối nay" }).scrollIntoViewIfNeeded();

  const submitButton = page.getByRole("button", { name: "Gửi yêu cầu đặt bàn" });
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();

  await page.getByLabel(/Điện thoại hoặc WhatsApp/).fill("+84905906842");
  await page.getByLabel(/Tên/).fill("Nguyễn Văn A");
  await page.getByLabel(/Ngày/).fill(getTomorrowDate());
  await page.getByLabel(/Giờ/).fill("18:30");
  await page.getByLabel(/Số khách/).fill("4");

  const contactChannel = page.getByLabel(/Kênh liên hệ/);
  await expect(contactChannel).toBeVisible();
  await contactChannel.selectOption("zalo");

  await submitButton.click();

  await expect(page.getByRole("status").filter({ hasText: "Yêu cầu đặt bàn đã được gửi" })).toBeVisible();
  await expect(page.getByLabel(/Điện thoại hoặc WhatsApp/)).toHaveValue("");
  await expect(page.getByLabel(/Tên/)).toHaveValue("");
  await expect(page.getByLabel(/Số khách/)).toHaveValue("1");
  await expect(page.getByLabel(/Kênh liên hệ/)).toHaveValue("phone");

  expect(bookingPayload).toMatchObject({
    contact: "+84905906842",
    contactChannel: "zalo",
    guests: 4,
    locale: "vi",
    name: "Nguyễn Văn A",
    time: "18:30",
  });
});
