export const bookingContactChannels = ["phone", "whatsapp", "zalo", "messenger"] as const;
export const bookingLocales = ["en", "vi"] as const;

export type BookingContactChannel = (typeof bookingContactChannels)[number];
export type BookingLocale = (typeof bookingLocales)[number];

export type BookingField = "name" | "contact" | "contactChannel" | "date" | "time" | "guests" | "note";
export type BookingApiField = BookingField | "email" | "phone" | "otpCode";

export type BookingFieldErrorCode =
  | "BOOKING_NAME_REQUIRED"
  | "BOOKING_NAME_TOO_LONG"
  | "BOOKING_CONTACT_REQUIRED"
  | "BOOKING_CONTACT_TOO_LONG"
  | "BOOKING_CONTACT_INVALID_SYMBOLS"
  | "BOOKING_CONTACT_METHOD_REQUIRED"
  | "BOOKING_CONTACT_CHANNEL_INVALID"
  | "BOOKING_EMAIL_INVALID"
  | "BOOKING_DATE_REQUIRED"
  | "BOOKING_DATE_INVALID"
  | "BOOKING_DATE_PAST"
  | "BOOKING_TIME_REQUIRED"
  | "BOOKING_TIME_INVALID"
  | "BOOKING_TIME_PAST"
  | "BOOKING_TIME_OUTSIDE_OPENING_HOURS"
  | "BOOKING_GUESTS_INTEGER"
  | "BOOKING_GUESTS_MIN"
  | "BOOKING_GUESTS_MAX"
  | "BOOKING_NOTE_TOO_LONG"
  | "BOOKING_OTP_REQUIRED"
  | "BOOKING_OTP_INVALID_CODE"
  | "BOOKING_OTP_CONTACT_CHANGED"
  | "BOOKING_OTP_PHONE_REQUIRED"
  | "BOOKING_OTP_PHONE_INVALID"
  | "BOOKING_OTP_CHANNEL_REQUIRED";

export type BookingSubmitErrorCode =
  | "INVALID_BOOKING_PAYLOAD"
  | "BOOKING_OTP_NOT_CONFIGURED"
  | "BOOKING_OTP_INVALID"
  | "BOOKING_EMAIL_NOT_CONFIGURED"
  | "RESEND_DELIVERY_FAILED"
  | "BOOKING_EMAIL_FAILED";

export type BookingOtpStartErrorCode =
  | "BOOKING_OTP_DISABLED"
  | "INVALID_OTP_PAYLOAD"
  | "OTP_NOT_CONFIGURED"
  | "OTP_DELIVERY_FAILED";

export type BookingFieldErrors = Partial<Record<BookingApiField, string>>;
export type BookingFieldErrorCodes = Partial<Record<BookingApiField, BookingFieldErrorCode>>;

export type SubmitBookingResult =
  | { ok: true; emailId: string }
  | {
      ok: false;
      status: 400 | 500 | 502;
      message: string;
      code: BookingSubmitErrorCode;
      fieldErrors?: BookingFieldErrors;
      fieldErrorCodes?: BookingFieldErrorCodes;
    };

export type StartBookingOtpResult =
  | { ok: true; message: string }
  | {
      ok: false;
      status: 400 | 500 | 502;
      message: string;
      code: BookingOtpStartErrorCode;
      fieldErrors?: BookingFieldErrors;
      fieldErrorCodes?: BookingFieldErrorCodes;
    };

const bookingFieldErrorCodes: ReadonlySet<string> = new Set([
  "BOOKING_NAME_REQUIRED",
  "BOOKING_NAME_TOO_LONG",
  "BOOKING_CONTACT_REQUIRED",
  "BOOKING_CONTACT_TOO_LONG",
  "BOOKING_CONTACT_INVALID_SYMBOLS",
  "BOOKING_CONTACT_METHOD_REQUIRED",
  "BOOKING_CONTACT_CHANNEL_INVALID",
  "BOOKING_EMAIL_INVALID",
  "BOOKING_DATE_REQUIRED",
  "BOOKING_DATE_INVALID",
  "BOOKING_DATE_PAST",
  "BOOKING_TIME_REQUIRED",
  "BOOKING_TIME_INVALID",
  "BOOKING_TIME_PAST",
  "BOOKING_TIME_OUTSIDE_OPENING_HOURS",
  "BOOKING_GUESTS_INTEGER",
  "BOOKING_GUESTS_MIN",
  "BOOKING_GUESTS_MAX",
  "BOOKING_NOTE_TOO_LONG",
  "BOOKING_OTP_REQUIRED",
  "BOOKING_OTP_INVALID_CODE",
  "BOOKING_OTP_CONTACT_CHANGED",
  "BOOKING_OTP_PHONE_REQUIRED",
  "BOOKING_OTP_PHONE_INVALID",
  "BOOKING_OTP_CHANNEL_REQUIRED",
]);

export function isBookingFieldErrorCode(value: string): value is BookingFieldErrorCode {
  return bookingFieldErrorCodes.has(value);
}
