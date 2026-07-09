import { expect, test } from "@playwright/test";
import { buildBookingEmailHtml } from "../src/server/booking/booking-email";
import { startBookingOtp } from "../src/server/booking/booking-otp-service";
import { submitBooking } from "../src/server/booking/booking-service";

const validBooking = {
  name: "Nguyen Van A",
  contact: "+84905906842",
  contactChannel: "phone" as const,
  date: "2099-01-01",
  time: "18:30",
  guests: 4,
  locale: "en" as const,
  email: undefined,
  phone: undefined,
};

test.describe("booking server boundaries", () => {
  test("submits booking with injected email port and OTP gate", async () => {
    const result = await submitBooking({ ...validBooking, otpCode: "123456" }, { isOtpEnabled: () => true, verifySmsOtp: async () => undefined, sendBookingEmail: async () => ({ id: "email_123" }) });
    expect(result).toEqual({ ok: true, emailId: "email_123" });
  });

  test("maps OTP verification failures without exposing internals", async () => {
    const result = await submitBooking({ ...validBooking, otpCode: "123456" }, {
      isOtpEnabled: () => true,
      verifySmsOtp: async () => {
        const error = new Error("The verification code is invalid or expired.");
        error.name = "OtpVerificationError";
        throw error;
      },
      sendBookingEmail: async () => ({ id: "email_123" }),
    });
    expect(result).toMatchObject({ ok: false, status: 400, code: "BOOKING_OTP_INVALID", fieldErrors: { otpCode: "The verification code is invalid or expired." }, fieldErrorCodes: { otpCode: "BOOKING_OTP_INVALID_CODE" } });
  });

  test("maps email delivery failures to stable booking errors", async () => {
    const result = await submitBooking({ ...validBooking, otpCode: "123456" }, {
      isOtpEnabled: () => false,
      verifySmsOtp: async () => undefined,
      sendBookingEmail: async () => {
        const error = new Error("Resend did not return an email id.");
        error.name = "EmailDeliveryError";
        throw error;
      },
    });
    expect(result).toMatchObject({ ok: false, status: 502, code: "RESEND_DELIVERY_FAILED" });
  });

  test("starts OTP through an injected adapter", async () => {
    const result = await startBookingOtp({ contact: "+84905906842" }, { isOtpEnabled: () => true, startSmsOtp: async () => undefined });
    expect(result).toEqual({ ok: true, message: "Verification code sent by SMS." });
  });

  test("escapes HTML in booking email output", () => {
    const html = buildBookingEmailHtml({ name: 'A & B <test>', contact: "+84905906842", contactChannel: "phone", date: "2099-01-01", time: "18:30", guests: 2, note: 'Need "window" seat & quiet', locale: "en", email: undefined, phone: undefined }, new Date("2099-01-01T12:00:00Z"));
    expect(html).toContain("A &amp; B &lt;test&gt;");
    expect(html).toContain("Need &quot;window&quot; seat &amp; quiet");
  });
});
