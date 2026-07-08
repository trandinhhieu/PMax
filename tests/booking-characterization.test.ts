import { expect, test } from "@playwright/test";
import { bookingRequestSchema } from "../src/lib/validation/booking";
import { submitBooking } from "../src/server/booking/booking-service";

const validFutureDate = "2099-01-01";

test.describe("booking behavior characterization", () => {
  test("normalizes compatible booking request payloads without changing public fields", () => {
    const parsed = bookingRequestSchema.safeParse({
      name: "Nguyen Van A",
      phone: "+84905906842",
      email: "",
      contactChannel: "zalo",
      date: validFutureDate,
      time: "18:30",
      guests: "4",
      note: " Window table ",
      locale: "vi",
    });

    expect(parsed.success).toBe(true);
    if (!parsed.success) return;

    expect(parsed.data).toMatchObject({
      name: "Nguyen Van A",
      phone: "+84905906842",
      contact: "+84905906842",
      contactChannel: "zalo",
      date: validFutureDate,
      time: "18:30",
      guests: 4,
      note: "Window table",
      locale: "vi",
    });
    expect(parsed.data.email).toBeUndefined();
  });

  test("keeps server validation failures machine-readable for invalid payloads", async () => {
    const result = await submitBooking({
      name: "A",
      contact: "+84abc",
      date: "not-a-date",
      time: "12:00",
      guests: "2.5",
      contactChannel: "phone",
    });

    expect(result).toMatchObject({
      ok: false,
      status: 400,
      message: "Invalid booking request.",
      code: "INVALID_BOOKING_PAYLOAD",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.fieldErrors).toMatchObject({
      name: "Please enter your name.",
      contact: "Please enter only digits and phone symbols.",
      date: "Please choose a valid date.",
      time: "Please choose a time between 16:00 and 23:00.",
      guests: "Please enter a whole number of guests.",
    });
  });
});
