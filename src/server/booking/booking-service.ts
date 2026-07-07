import { bookingRequestSchema, type BookingField } from "@/lib/validation/booking";
import { sendBookingEmail } from "@/server/booking/booking-email";
import { EmailConfigurationError, EmailDeliveryError } from "@/server/email/resend";

type SubmitBookingResult =
  | { ok: true; emailId: string }
  | {
      ok: false;
      status: 400 | 500 | 502;
      message: string;
      code: "INVALID_BOOKING_PAYLOAD" | "BOOKING_EMAIL_NOT_CONFIGURED" | "RESEND_DELIVERY_FAILED" | "BOOKING_EMAIL_FAILED";
      fieldErrors?: Partial<Record<BookingField | "email" | "phone", string>>;
    };

export async function submitBooking(input: unknown): Promise<SubmitBookingResult> {
  const parsed = bookingRequestSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<BookingField | "email" | "phone", string>> = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as BookingField | undefined;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }

    return {
      ok: false,
      status: 400,
      message: "Invalid booking request.",
      code: "INVALID_BOOKING_PAYLOAD",
      fieldErrors,
    };
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
