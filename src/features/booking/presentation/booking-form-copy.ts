import type { Locale } from "@/types/common";

export function getBookingFormCopy(locale: Locale) {
  return bookingFormCopy[locale];
}

const bookingFormCopy = {
  en: {
    eyebrow: "Booking",
    requestNotice: "This is a booking request, not an instant confirmation. Hermanos will confirm by your preferred channel.",
    callLabel: "Call Hermanos",
    otpIntro: "Enter your phone number first, request the SMS code, then complete the booking details.",
    defaultIntro: "Share your contact details and preferred table time below.",
    defaultError: "Please check the highlighted fields before sending.",
    otpSendFailed: "We could not send the verification code.",
    otpSent: "Verification code sent by SMS.",
    otpSending: "Sending",
    smsCode: "SMS code",
    submitPending: "Sending...",
    channelPhone: "Phone",
  },
  vi: {
    eyebrow: "Đặt bàn",
    requestNotice: "Đây là yêu cầu đặt bàn, không phải xác nhận tức thì. Hermanos sẽ xác nhận qua kênh bạn chọn.",
    callLabel: "Gọi Hermanos",
    otpIntro: "Nhập số điện thoại, lấy mã SMS, rồi hoàn tất thông tin đặt bàn.",
    defaultIntro: "Điền thông tin liên hệ và thời gian bạn muốn đặt bàn bên dưới.",
    defaultError: "Vui lòng kiểm tra các trường đang bị lỗi trước khi gửi.",
    otpSendFailed: "Không thể gửi mã xác thực.",
    otpSent: "Mã xác thực đã được gửi qua SMS.",
    otpSending: "Đang gửi",
    smsCode: "Mã SMS",
    submitPending: "Đang gửi...",
    channelPhone: "Điện thoại",
  },
} satisfies Record<Locale, Record<string, string>>;
