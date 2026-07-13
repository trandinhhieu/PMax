import { businessInfo } from "@/config/business";
import type { BookingFieldErrorCode } from "@/features/booking/contracts/api";

export const bookingFieldErrorMessages: Record<BookingFieldErrorCode, string> = {
  BOOKING_NAME_REQUIRED: "Please enter your name.",
  BOOKING_NAME_TOO_LONG: "Please keep your name under 80 characters.",
  BOOKING_CONTACT_REQUIRED: "Please enter a phone number or chat contact.",
  BOOKING_CONTACT_TOO_LONG: "Please keep the contact detail under 50 characters.",
  BOOKING_CONTACT_INVALID_SYMBOLS: "Please enter only digits and phone symbols.",
  BOOKING_CONTACT_METHOD_REQUIRED: "Please enter a phone number, email, or chat contact.",
  BOOKING_CONTACT_CHANNEL_INVALID: "Please choose a contact channel.",
  BOOKING_EMAIL_INVALID: "Please enter a valid email address.",
  BOOKING_DATE_REQUIRED: "Please choose a date.",
  BOOKING_DATE_INVALID: "Please choose a valid date.",
  BOOKING_DATE_PAST: "Please choose today or a future date.",
  BOOKING_TIME_REQUIRED: "Please choose a time.",
  BOOKING_TIME_INVALID: "Please choose a valid time.",
  BOOKING_TIME_PAST: "Please choose a time later than the current time.",
  BOOKING_TIME_OUTSIDE_OPENING_HOURS: `Please choose a time between ${businessInfo.openingHoursStructured.opens} and ${businessInfo.openingHoursStructured.closes}.`,
  BOOKING_GUESTS_INTEGER: "Please enter a whole number of guests.",
  BOOKING_GUESTS_MIN: "Please enter at least 1 guest.",
  BOOKING_GUESTS_MAX: "Please contact us directly for groups over 20.",
  BOOKING_NOTE_TOO_LONG: "Please keep your note under 300 characters.",
  BOOKING_OTP_REQUIRED: "Please enter the SMS verification code.",
  BOOKING_OTP_INVALID_CODE: "Please enter the verification code.",
  BOOKING_OTP_CONTACT_CHANGED: "Please request a new SMS verification code for this phone number.",
  BOOKING_OTP_PHONE_REQUIRED: "Please enter a phone number before requesting OTP.",
  BOOKING_OTP_PHONE_INVALID: "Please enter a valid phone number before requesting OTP.",
  BOOKING_OTP_CHANNEL_REQUIRED: "Please choose Phone to receive the SMS verification code.",
};

export function getBookingFieldErrorMessage(code: BookingFieldErrorCode) {
  return bookingFieldErrorMessages[code];
}
