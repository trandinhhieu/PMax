import { expect, test } from "@playwright/test";
import { getLocalizedBookingFieldError } from "../src/features/booking/presentation/error";
import { isValidBookingOtpPhoneNumber, normalizeBookingPhoneNumber } from "../src/features/booking/domain/phone-policy";
import { bookingRequestSchema, createBookingSchemas, formatBookingValidationIssues } from "../src/lib/validation/booking";
import { startBookingOtp } from "../src/server/booking/booking-otp-service";
import { submitBooking } from "../src/server/booking/booking-service";

const validFutureDate = "2099-01-01";

test.describe("booking behavior characterization", () => {
  test("normalizes compatible booking request payloads without changing public fields", () => {
    const parsed = bookingRequestSchema.safeParse({ name: "Nguyen Van A", phone: "+84905906842", email: "", contactChannel: "zalo", date: validFutureDate, time: "18:30", guests: "4", note: " Window table ", locale: "vi" });
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data).toMatchObject({ name: "Nguyen Van A", phone: "+84905906842", contact: "+84905906842", contactChannel: "zalo", date: validFutureDate, time: "18:30", guests: 4, note: "Window table", locale: "vi" });
    expect(parsed.data.email).toBeUndefined();
  });

  test("keeps server validation failures machine-readable for invalid payloads", async () => {
    const result = await submitBooking({ name: "A", contact: "+84abc", date: "not-a-date", time: "12:00", guests: "2.5", contactChannel: "phone" }, { isOtpEnabled: () => false, verifySmsOtp: async () => undefined, sendBookingEmail: async () => ({ id: "email_123" }) });
    expect(result).toMatchObject({ ok: false, status: 400, message: "Invalid booking request.", code: "INVALID_BOOKING_PAYLOAD" });
    if (result.ok) return;
    expect(result.fieldErrors).toMatchObject({ name: "Please enter your name.", contact: "Please enter only digits and phone symbols.", date: "Please choose a valid date.", time: "Please choose a time between 16:00 and 23:00.", guests: "Please enter a whole number of guests." });
    expect(result.fieldErrorCodes).toMatchObject({ name: "BOOKING_NAME_REQUIRED", contact: "BOOKING_CONTACT_INVALID_SYMBOLS", date: "BOOKING_DATE_INVALID", time: "BOOKING_TIME_OUTSIDE_OPENING_HOURS", guests: "BOOKING_GUESTS_INTEGER" });
  });

  test("validates booking dates deterministically from controlled time", () => {
    const { bookingRequestSchema: controlledSchema } = createBookingSchemas({ now: new Date("2026-07-09T01:00:00+07:00") });
    const parsed = controlledSchema.safeParse({ name: "Nguyen Van A", contact: "+84905906842", contactChannel: "phone", date: "2026-07-08", time: "18:30", guests: 2, locale: "en" });
    expect(parsed.success).toBe(false);
    if (parsed.success) return;
    expect(formatBookingValidationIssues(parsed.error)).toMatchObject({ fieldErrors: { date: "Please choose today or a future date." }, fieldErrorCodes: { date: "BOOKING_DATE_PAST" } });
  });

  test("rejects same-day booking times that are not later than the restaurant clock", () => {
    const { bookingRequestSchema: controlledSchema } = createBookingSchemas({
      now: new Date("2026-07-13T10:15:00Z"),
    });
    const baseBooking = {
      name: "Nguyen Van A",
      contact: "+84905906842",
      contactChannel: "phone" as const,
      date: "2026-07-13",
      guests: 2,
      locale: "en" as const,
    };

    for (const time of ["17:00", "17:15"]) {
      const parsed = controlledSchema.safeParse({ ...baseBooking, time });
      expect(parsed.success).toBe(false);
      if (parsed.success) continue;
      expect(formatBookingValidationIssues(parsed.error)).toMatchObject({
        fieldErrors: { time: "Please choose a time later than the current time." },
        fieldErrorCodes: { time: "BOOKING_TIME_PAST" },
      });
    }

    expect(controlledSchema.safeParse({ ...baseBooking, time: "17:16" }).success).toBe(true);
    expect(controlledSchema.safeParse({ ...baseBooking, date: "2026-07-14", time: "16:00" }).success).toBe(true);
  });

  test("localizes booking field errors from stable codes", () => {
    expect(getLocalizedBookingFieldError("en", "contact", "ignored", "BOOKING_OTP_PHONE_INVALID")).toBe("Please enter a valid phone number before requesting OTP.");
    expect(getLocalizedBookingFieldError("vi", "otpCode", "ignored", "BOOKING_OTP_CONTACT_CHANGED")).toBe("Vui lòng lấy mã SMS mới cho đúng số điện thoại đang nhập.");
  });

  test("uses one booking OTP phone normalization policy", () => {
    expect(normalizeBookingPhoneNumber("0905 906 842")).toBe("+84905906842");
    expect(normalizeBookingPhoneNumber("0084905906842")).toBe("+84905906842");
    expect(isValidBookingOtpPhoneNumber("0905 906 842")).toBe(true);
    expect(isValidBookingOtpPhoneNumber("123456")).toBe(false);
  });

  test("keeps OTP start failure responses compatible while exposing field codes", async () => {
    const previousServerOtp = process.env.BOOKING_OTP_ENABLED;
    const previousPublicOtp = process.env.NEXT_PUBLIC_BOOKING_OTP_ENABLED;
    process.env.BOOKING_OTP_ENABLED = "true";
    process.env.NEXT_PUBLIC_BOOKING_OTP_ENABLED = "true";
    try {
      const result = await startBookingOtp({ contact: "abc" }, { isOtpEnabled: () => true, startSmsOtp: async () => undefined });
      expect(result).toMatchObject({ ok: false, status: 400, message: "Please enter a valid phone number before requesting OTP.", code: "INVALID_OTP_PAYLOAD", fieldErrors: { contact: "Please enter a valid phone number before requesting OTP." }, fieldErrorCodes: { contact: "BOOKING_OTP_PHONE_INVALID" } });
    } finally {
      if (previousServerOtp === undefined) delete process.env.BOOKING_OTP_ENABLED; else process.env.BOOKING_OTP_ENABLED = previousServerOtp;
      if (previousPublicOtp === undefined) delete process.env.NEXT_PUBLIC_BOOKING_OTP_ENABLED; else process.env.NEXT_PUBLIC_BOOKING_OTP_ENABLED = previousPublicOtp;
    }
  });
});
