import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/business";
import { getLocalizedPaths } from "@/lib/locale-routing";
import { isLocale } from "@/types/common";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const localizedPaths = getLocalizedPaths("/privacy-policy");

  return {
    title: locale === "en" ? "Privacy Policy" : "Chính sách riêng tư",
    alternates: {
      canonical: siteConfig.domain ? `${siteConfig.domain}/${locale}/privacy-policy` : undefined,
      languages: siteConfig.domain
        ? {
            en: `${siteConfig.domain}${localizedPaths.en}`,
            vi: `${siteConfig.domain}${localizedPaths.vi}`,
          }
        : undefined,
    },
  };
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
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
