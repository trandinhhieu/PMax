import { isBookingOtpEnabled } from "@/config/booking";
import { bookingOtpStartSchema } from "@/lib/validation/booking";
import { OtpConfigurationError, OtpDeliveryError, OtpVerificationError, startSmsOtp } from "@/server/otp/twilio-verify";

type StartBookingOtpResult =
  | { ok: true; message: string }
  | {
      ok: false;
      status: 400 | 500 | 502;
      message: string;
      code: "BOOKING_OTP_DISABLED" | "INVALID_OTP_PAYLOAD" | "OTP_NOT_CONFIGURED" | "OTP_DELIVERY_FAILED";
    };

export async function startBookingOtp(input: unknown): Promise<StartBookingOtpResult> {
  if (!isBookingOtpEnabled()) {
    return {
      ok: false,
      status: 400,
      message: "Booking OTP verification is disabled.",
      code: "BOOKING_OTP_DISABLED",
    };
  }

  const parsed = bookingOtpStartSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      message: "Please enter a valid phone number before requesting OTP.",
      code: "INVALID_OTP_PAYLOAD",
    };
  }

  try {
    await startSmsOtp(parsed.data.contact);

    return {
      ok: true,
      message: "Verification code sent by SMS.",
    };
  } catch (error) {
    console.error("Booking OTP start failed", error);

    if (error instanceof OtpConfigurationError) {
      return {
        ok: false,
        status: 500,
        message: error.message,
        code: "OTP_NOT_CONFIGURED",
      };
    }

    if (error instanceof OtpVerificationError || error instanceof OtpDeliveryError) {
      return {
        ok: false,
        status: error instanceof OtpVerificationError ? 400 : 502,
        message: error.message,
        code: "OTP_DELIVERY_FAILED",
      };
    }

    return {
      ok: false,
      status: 502,
      message: "Verification code could not be sent.",
      code: "OTP_DELIVERY_FAILED",
    };
  }
}
