import type { BookingApiField, BookingFieldErrorCode } from "@/features/booking/contracts/api";
import { getBookingFieldErrorMessage } from "@/features/booking/domain/validation-errors";
import type { Locale } from "@/types/common";

const viFieldErrorMessages: Record<BookingFieldErrorCode, string> = {
  BOOKING_NAME_REQUIRED: "Vui lòng nhập tên hợp lệ.",
  BOOKING_NAME_TOO_LONG: "Vui lòng nhập tên hợp lệ.",
  BOOKING_CONTACT_REQUIRED: "Vui lòng nhập số điện thoại hoặc liên hệ chat hợp lệ.",
  BOOKING_CONTACT_TOO_LONG: "Vui lòng nhập số điện thoại hoặc liên hệ chat hợp lệ.",
  BOOKING_CONTACT_INVALID_SYMBOLS: "Vui lòng nhập số điện thoại hoặc liên hệ chat hợp lệ.",
  BOOKING_CONTACT_METHOD_REQUIRED: "Vui lòng nhập số điện thoại hoặc liên hệ chat hợp lệ.",
  BOOKING_CONTACT_CHANNEL_INVALID: "Vui lòng chọn kênh liên hệ.",
  BOOKING_EMAIL_INVALID: "Vui lòng nhập email hợp lệ.",
  BOOKING_DATE_REQUIRED: "Vui lòng chọn ngày hợp lệ từ hôm nay trở đi.",
  BOOKING_DATE_INVALID: "Vui lòng chọn ngày hợp lệ từ hôm nay trở đi.",
  BOOKING_DATE_PAST: "Vui lòng chọn ngày hợp lệ từ hôm nay trở đi.",
  BOOKING_TIME_REQUIRED: "Vui lòng chọn giờ hợp lệ trong giờ mở cửa.",
  BOOKING_TIME_INVALID: "Vui lòng chọn giờ hợp lệ trong giờ mở cửa.",
  BOOKING_TIME_OUTSIDE_OPENING_HOURS: "Vui lòng chọn giờ hợp lệ trong giờ mở cửa.",
  BOOKING_GUESTS_INTEGER: "Vui lòng nhập số khách nguyên từ 1 đến 20.",
  BOOKING_GUESTS_MIN: "Vui lòng nhập số khách nguyên từ 1 đến 20.",
  BOOKING_GUESTS_MAX: "Vui lòng nhập số khách nguyên từ 1 đến 20.",
  BOOKING_NOTE_TOO_LONG: "Vui lòng giữ ghi chú dưới 300 ký tự.",
  BOOKING_OTP_REQUIRED: "Vui lòng nhập mã xác thực SMS hợp lệ.",
  BOOKING_OTP_INVALID_CODE: "Vui lòng nhập mã xác thực SMS hợp lệ.",
  BOOKING_OTP_CONTACT_CHANGED: "Vui lòng lấy mã SMS mới cho đúng số điện thoại đang nhập.",
  BOOKING_OTP_PHONE_REQUIRED: "Vui lòng nhập số điện thoại trước khi lấy mã OTP.",
  BOOKING_OTP_PHONE_INVALID: "Vui lòng nhập số điện thoại hợp lệ để nhận mã OTP.",
  BOOKING_OTP_CHANNEL_REQUIRED: "Vui lòng chọn Điện thoại để nhận mã xác thực SMS.",
};

const fallbackViMessages: Partial<Record<BookingApiField, string>> = {
  name: viFieldErrorMessages.BOOKING_NAME_REQUIRED,
  contact: viFieldErrorMessages.BOOKING_CONTACT_REQUIRED,
  contactChannel: viFieldErrorMessages.BOOKING_CONTACT_CHANNEL_INVALID,
  email: viFieldErrorMessages.BOOKING_EMAIL_INVALID,
  phone: viFieldErrorMessages.BOOKING_CONTACT_REQUIRED,
  date: viFieldErrorMessages.BOOKING_DATE_INVALID,
  time: viFieldErrorMessages.BOOKING_TIME_INVALID,
  guests: viFieldErrorMessages.BOOKING_GUESTS_INTEGER,
  note: viFieldErrorMessages.BOOKING_NOTE_TOO_LONG,
  otpCode: viFieldErrorMessages.BOOKING_OTP_INVALID_CODE,
};

export function getLocalizedBookingFieldError(
  locale: Locale,
  field: BookingApiField,
  message: string,
  code?: BookingFieldErrorCode,
) {
  if (code) {
    return locale === "vi" ? viFieldErrorMessages[code] : getBookingFieldErrorMessage(code);
  }

  if (locale === "vi") {
    return fallbackViMessages[field] ?? message;
  }

  return message;
}
