import { notFound } from "next/navigation";
import { isLocale } from "@/types/common";

export default async function ThankYouPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <main className="bg-cream px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-lg border border-borderWarm bg-porcelain p-8 shadow-large">
        <p className="text-sm font-bold uppercase tracking-wide text-tomato">{locale === "en" ? "Booking" : "Đặt bàn"}</p>
        <h1 className="mt-3 font-display text-5xl font-bold text-charcoal">{locale === "en" ? "Thank you" : "Cảm ơn bạn"}</h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          {locale === "en"
            ? "Your booking request has been received. Please wait for Hermanos to confirm by your preferred contact channel."
            : "Hermanos đã nhận yêu cầu đặt bàn của bạn. Vui lòng chờ xác nhận qua kênh liên hệ bạn đã chọn."}
        </p>
      </div>
    </main>
  );
}
