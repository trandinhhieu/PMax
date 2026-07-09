import { expect, test } from "@playwright/test";
import { sendBookingEmail } from "../src/server/booking/booking-notifier";

test.describe("booking notifier adapter", () => {
  test("rejects missing booking email configuration", async () => {
    const previousFrom = process.env.BOOKING_FROM_EMAIL;
    const previousTo = process.env.BOOKING_NOTIFY_EMAIL;
    delete process.env.BOOKING_FROM_EMAIL;
    delete process.env.BOOKING_NOTIFY_EMAIL;

    try {
      await expect(sendBookingEmail({
        name: "Nguyen Van A",
        contact: "+84905906842",
        contactChannel: "phone",
        date: "2099-01-01",
        time: "18:30",
        guests: 2,
        locale: "en",
      } as never)).rejects.toThrow("BOOKING_FROM_EMAIL and BOOKING_NOTIFY_EMAIL must be configured.");
    } finally {
      if (previousFrom === undefined) delete process.env.BOOKING_FROM_EMAIL; else process.env.BOOKING_FROM_EMAIL = previousFrom;
      if (previousTo === undefined) delete process.env.BOOKING_NOTIFY_EMAIL; else process.env.BOOKING_NOTIFY_EMAIL = previousTo;
    }
  });
});
