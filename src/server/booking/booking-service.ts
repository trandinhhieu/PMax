import { isBookingOtpEnabled } from "@/config/booking";
import type { SubmitBookingResult } from "@/features/booking/contracts/api";
import { formatBookingValidationIssues, bookingRequestSchema } from "@/lib/validation/booking";
import { sendBookingEmail } from "@/server/booking/booking-email";
import { EmailConfigurationError, EmailDeliveryError } from "@/server/email/resend";
import { OtpConfigurationError, OtpDeliveryError, OtpVerificationError, verifySmsOtp } from "@/server/otp/twilio-verify";

export async function submitBooking(input: unknown): Promise<SubmitBookingResult> {
  const parsed = bookingRequestSchema.safeParse(input);

  if (!parsed.success) {
    const { fieldErrors, fieldErrorCodes } = formatBookingValidationIssues(parsed.error);

    return {
      ok: false,
      status: 400,
      message: "Invalid booking request.",
      code: "INVALID_BOOKING_PAYLOAD",
      fieldErrors,
      fieldErrorCodes,
    };
  }

  if (isBookingOtpEnabled()) {
    if (!parsed.data.otpCode) {
      return {
        ok: false,
        status: 400,
        message: "Please enter the SMS verification code.",
        code: "BOOKING_OTP_INVALID",
        fieldErrors: {
          otpCode: "Please enter the SMS verification code.",
        },
        fieldErrorCodes: {
          otpCode: "BOOKING_OTP_REQUIRED",
        },
      };
    }

    try {
      await verifySmsOtp(parsed.data.contact, parsed.data.otpCode);
    } catch (error) {
      console.error("Booking OTP verification failed", error);

      if (error instanceof OtpConfigurationError) {
        return {
          ok: false,
          status: 500,
          message: error.message,
          code: "BOOKING_OTP_NOT_CONFIGURED",
        };
      }

      if (error instanceof OtpVerificationError) {
        return {
          ok: false,
          status: 400,
          message: error.message,
          code: "BOOKING_OTP_INVALID",
          fieldErrors: {
            otpCode: error.message,
          },
          fieldErrorCodes: {
            otpCode: "BOOKING_OTP_INVALID_CODE",
          },
        };
      }

      if (error instanceof OtpDeliveryError) {
        return {
          ok: false,
          status: 502,
          message: `Verification code could not be checked: ${error.message}`,
          code: "BOOKING_OTP_INVALID",
        };
      }

      return {
        ok: false,
        status: 502,
        message: "Verification code could not be checked.",
        code: "BOOKING_OTP_INVALID",
      };
    }
  }

  try {
    const email = await sendBookingEmail(parsed.data);
    return { ok: true, emailId: email.id };
  } catch (error) {
    console.error("Booking email failed", error);

    if (error instanceof EmailConfigurationError) {
      return {
        ok: false,
        status: 500,
        message: error.message,
        code: "BOOKING_EMAIL_NOT_CONFIGURED",
      };
    }

    if (error instanceof EmailDeliveryError) {
      return {
        ok: false,
        status: 502,
        message: `Resend could not send the booking notification: ${error.message}`,
        code: "RESEND_DELIVERY_FAILED",
      };
    }

    return {
      ok: false,
      status: 502,
      message: "Booking request could not be sent.",
      code: "BOOKING_EMAIL_FAILED",
    };
  }
}
