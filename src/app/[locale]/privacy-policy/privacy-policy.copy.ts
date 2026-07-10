import type { Locale } from "@/types/common";

type PrivacyPolicyCopy = {
  eyebrow: string;
  sections: Array<{
    body: string;
    title: string;
  }>;
  title: string;
};

export const privacyPolicyCopy = {
  en: {
    eyebrow: "Privacy",
    sections: [
      {
        body: "Hermanos uses booking contact information to respond to reservation requests.",
        title: "Booking requests",
      },
      {
        body: "Analytics and advertising tools may collect standard usage data to improve the website and campaign performance.",
        title: "Website analytics",
      },
    ],
    title: "Privacy policy",
  },
  vi: {
    eyebrow: "Riêng tư",
    sections: [
      {
        body: "Hermanos dùng thông tin liên hệ khi đặt bàn để phản hồi yêu cầu đặt chỗ.",
        title: "Yêu cầu đặt bàn",
      },
      {
        body: "Công cụ đo lường và quảng cáo có thể thu thập dữ liệu sử dụng tiêu chuẩn để cải thiện website và hiệu quả chiến dịch.",
        title: "Phân tích website",
      },
    ],
    title: "Chính sách riêng tư",
  },
} satisfies Record<Locale, PrivacyPolicyCopy>;
