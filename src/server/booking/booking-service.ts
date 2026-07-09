import type { SubmitBookingResult } from "@/features/booking/contracts/api";
import type { BookingRequestValues } from "@/lib/validation/booking";
import { formatBookingValidationIssues, bookingRequestSchema } from "@/lib/validation/booking";

export type BookingSubmissionDependencies = {
  isOtpEnabled: () => boolean;
  verifySmsOtp: (contact: string, otpCode: string) => Promise<unknown>;
  sendBookingEmail: (booking: BookingRequestValues) => Promise<{ id: string }>;
};

export async function submitBooking(input: unknown, dependencies: BookingSubmissionDependencies): Promise<SubmitBookingResult> {
  const parsed = bookingRequestSchema.safeParse(input);
  if (!parsed.success) {
    const { fieldErrors, fieldErrorCodes } = formatBookingValidationIssues(parsed.error);
    return { ok: false, status: 400, message: "Invalid booking request.", code: "INVALID_BOOKING_PAYLOAD", fieldErrors, fieldErrorCodes };
  }
  if (dependencies.isOtpEnabled()) {
    if (!parsed.data.otpCode) return { ok: false, status: 400, message: "Please enter the SMS verification code.", code: "BOOKING_OTP_INVALID", fieldErrors: { otpCode: "Please enter the SMS verification code." }, fieldErrorCodes: { otpCode: "BOOKING_OTP_REQUIRED" } };
    try {
      await dependencies.verifySmsOtp(parsed.data.contact, parsed.data.otpCode);
    } catch (error) {
      console.error("Booking OTP verification failed", error);
      const message = error instanceof Error ? error.message : "";
      const name = error instanceof Error ? error.name : "";
      if (name === "OtpConfigurationError") return { ok: false, status: 500, message, code: "BOOKING_OTP_NOT_CONFIGURED" };
      if (name === "OtpVerificationError") return { ok: false, status: 400, message, code: "BOOKING_OTP_INVALID", fieldErrors: { otpCode: message }, fieldErrorCodes: { otpCode: "BOOKING_OTP_INVALID_CODE" } };
      if (name === "OtpDeliveryError") return { ok: false, status: 502, message: `Verification code could not be checked: ${message}`, code: "BOOKING_OTP_INVALID" };
      return { ok: false, status: 502, message: "Verification code could not be checked.", code: "BOOKING_OTP_INVALID" };
    }
  }
  try {
    const email = await dependencies.sendBookingEmail(parsed.data);
    return { ok: true, emailId: email.id };
  } catch (error) {
    console.error("Booking email failed", error);
    const message = error instanceof Error ? error.message : "";
    const name = error instanceof Error ? error.name : "";
    if (name === "EmailConfigurationError") return { ok: false, status: 500, message, code: "BOOKING_EMAIL_NOT_CONFIGURED" };
    if (name === "EmailDeliveryError") return { ok: false, status: 502, message: `Resend could not send the booking notification: ${message}`, code: "RESEND_DELIVERY_FAILED" };
    return { ok: false, status: 502, message: "Booking request could not be sent.", code: "BOOKING_EMAIL_FAILED" };
  }
}
