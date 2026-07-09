import type { StartBookingOtpResult } from "@/features/booking/contracts/api";
import { getBookingFieldErrorMessage } from "@/features/booking/domain/validation-errors";
import { bookingOtpStartSchema } from "@/lib/validation/booking";

export type BookingOtpStartDependencies = {
  isOtpEnabled: () => boolean;
  startSmsOtp: (contact: string) => Promise<unknown>;
};

export async function startBookingOtp(input: unknown, dependencies: BookingOtpStartDependencies): Promise<StartBookingOtpResult> {
  if (!dependencies.isOtpEnabled()) {
    return { ok: false, status: 400, message: "Booking OTP verification is disabled.", code: "BOOKING_OTP_DISABLED" };
  }
  const parsed = bookingOtpStartSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, status: 400, message: "Please enter a valid phone number before requesting OTP.", code: "INVALID_OTP_PAYLOAD", fieldErrors: { contact: getBookingFieldErrorMessage("BOOKING_OTP_PHONE_INVALID") }, fieldErrorCodes: { contact: "BOOKING_OTP_PHONE_INVALID" } };
  }
  try {
    await dependencies.startSmsOtp(parsed.data.contact);
    return { ok: true, message: "Verification code sent by SMS." };
  } catch (error) {
    console.error("Booking OTP start failed", error);
    const message = error instanceof Error ? error.message : "";
    const name = error instanceof Error ? error.name : "";
    if (name === "OtpConfigurationError") return { ok: false, status: 500, message, code: "OTP_NOT_CONFIGURED" };
    if (name === "OtpVerificationError") return { ok: false, status: 400, message, code: "INVALID_OTP_PAYLOAD", fieldErrors: { contact: getBookingFieldErrorMessage("BOOKING_OTP_PHONE_INVALID") }, fieldErrorCodes: { contact: "BOOKING_OTP_PHONE_INVALID" } };
    if (name === "OtpDeliveryError") return { ok: false, status: 502, message: `Verification code could not be sent: ${message}`, code: "OTP_DELIVERY_FAILED" };
    return { ok: false, status: 502, message: "Verification code could not be sent.", code: "OTP_DELIVERY_FAILED" };
  }
}
