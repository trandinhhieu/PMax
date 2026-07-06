import { notFound } from "next/navigation";
import { isLocale } from "@/types/common";

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className="flex min-h-[calc(100vh-312px)] bg-cream px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-5xl font-bold text-charcoal">{locale === "en" ? "Privacy policy" : "Chính sách riêng tư"}</h1>
        <p className="mt-6 leading-8 text-muted">
          {locale === "en"
            ? "Hermanos uses booking contact information to respond to reservation requests. Analytics and advertising tools may collect standard usage data to improve the website and campaign performance."
            : "Hermanos dùng thông tin liên hệ khi đặt bàn để phản hồi yêu cầu đặt chỗ. Công cụ đo lường và quảng cáo có thể thu thập dữ liệu sử dụng tiêu chuẩn để cải thiện website và hiệu quả chiến dịch."}
        </p>
      </div>
    </main>
  );
}
