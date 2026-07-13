import type { Locale } from "@/types/common";

export interface PremiumFormCopy {
  badge: string;
  trustTitle: string;
  trustPoints: readonly string[];
  callLabel: string;
  stepDate: string;
  stepContact: string;
  submitButton: string;
  successTitle: string;
  successBody: string;
  selectDate: string;
  selectTime: string;
  customTime: string;
  customTimeHint: string;
  selectGuests: string;
  contactUnlockHint: string;
  specialRequests: string;
  requestChipPlaceholder: string;
  slotAvailable: string;
  slotLimited: string;
  slotFull: string;
  slotRemaining: string;
  noFutureSlots: string;
}

const premiumCopy: Record<Locale, PremiumFormCopy> = {
  en: {
    badge: "Booking",
    trustTitle: "Why book with Hermanos?",
    trustPoints: [
      "Reserved table upon arrival",
      "Priority seating for groups",
      "Special occasion ready",
      "Instant phone/chat confirmation",
    ],
    callLabel: "Call Hermanos",
    stepDate: "When & how many?",
    stepContact: "Your details",
    submitButton: "Confirm booking request",
    successTitle: "Request sent! 🎉",
    successBody: "Hermanos will confirm your table through your preferred channel. Expect a reply shortly.",
    selectDate: "Select a date",
    selectTime: "Choose a time slot",
    customTime: "Or enter a custom time",
    customTimeHint: "Custom times must be within opening hours and later than the current time for today.",
    selectGuests: "Number of guests",
    contactUnlockHint: "Pick a date, time, and available slot above to continue.",
    specialRequests: "Special requests (optional)",
    requestChipPlaceholder: "Or type your own…",
    slotAvailable: "Available",
    slotLimited: "Limited",
    slotFull: "Full",
    slotRemaining: "only {n} left",
    noFutureSlots: "No later preset slots remain today. Choose another date or enter a later custom time.",
  },
  vi: {
    badge: "Đặt bàn",
    trustTitle: "Tại sao đặt bàn tại Hermanos?",
    trustPoints: [
      "Bàn đã giữ sẵn khi đến",
      "Ưu tiên chỗ ngồi nhóm đông",
      "Sẵn sàng cho dịp đặc biệt",
      "Xác nhận qua điện thoại/chat nhanh",
    ],
    callLabel: "Gọi Hermanos",
    stepDate: "Khi nào & bao nhiêu khách?",
    stepContact: "Thông tin liên hệ",
    submitButton: "Xác nhận yêu cầu đặt bàn",
    successTitle: "Đã gửi yêu cầu! 🎉",
    successBody: "Hermanos sẽ xác nhận bàn qua kênh liên hệ bạn chọn. Sẽ phản hồi trong thời gian sớm nhất.",
    selectDate: "Chọn ngày",
    selectTime: "Chọn giờ",
    customTime: "Hoặc nhập giờ khác",
    customTimeHint: "Giờ tự chọn phải nằm trong giờ mở cửa và muộn hơn thời gian hiện tại nếu đặt hôm nay.",
    selectGuests: "Số khách",
    contactUnlockHint: "Chọn ngày, giờ và slot còn trống bên trên để tiếp tục.",
    specialRequests: "Yêu cầu đặc biệt (không bắt buộc)",
    requestChipPlaceholder: "Hoặc nhập yêu cầu của bạn…",
    slotAvailable: "Còn trống",
    slotLimited: "Sắp hết",
    slotFull: "Hết chỗ",
    slotRemaining: "còn {n} chỗ",
    noFutureSlots: "Hôm nay không còn khung giờ đặt sẵn nào muộn hơn. Vui lòng chọn ngày khác hoặc nhập giờ muộn hơn.",
  },
};

export function getPremiumFormCopy(locale: Locale): PremiumFormCopy {
  return premiumCopy[locale];
}
