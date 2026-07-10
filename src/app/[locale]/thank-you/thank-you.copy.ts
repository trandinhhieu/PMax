import type { Locale } from "@/types/common";

type ThankYouCopy = {
  body: string;
  eyebrow: string;
  status: Array<{
    label: string;
    value: string;
  }>;
  title: string;
};

export const thankYouCopy = {
  en: {
    body: "Your booking request has been received. Please wait for Hermanos to confirm by your preferred contact channel.",
    eyebrow: "Booking",
    status: [
      {
        label: "Status",
        value: "Request received",
      },
      {
        label: "Confirmation",
        value: "Hermanos will reply through your preferred contact channel.",
      },
    ],
    title: "Thank you",
  },
  vi: {
    body: "Hermanos đã nhận yêu cầu đặt bàn của bạn. Vui lòng chờ xác nhận qua kênh liên hệ bạn đã chọn.",
    eyebrow: "Đặt bàn",
    status: [
      {
        label: "Trạng thái",
        value: "Đã nhận yêu cầu",
      },
      {
        label: "Xác nhận",
        value: "Hermanos sẽ phản hồi qua kênh liên hệ bạn đã chọn.",
      },
    ],
    title: "Cảm ơn bạn",
  },
} satisfies Record<Locale, ThankYouCopy>;
