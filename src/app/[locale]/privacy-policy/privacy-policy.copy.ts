import type { Locale } from "@/types/common";

type PrivacyPolicyCopy = {
  description: string;
  eyebrow: string;
  sections: Array<{
    body: string;
    title: string;
  }>;
  title: string;
};

export const privacyPolicyCopy = {
  en: {
    description: "Learn how Hermanos uses booking contact information and website analytics data.",
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
    description: "T\u00ECm hi\u1EC3u c\u00E1ch Hermanos s\u1EED d\u1EE5ng th\u00F4ng tin li\u00EAn h\u1EC7 \u0111\u1EB7t b\u00E0n v\u00E0 d\u1EEF li\u1EC7u ph\u00E2n t\u00EDch website.",
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
