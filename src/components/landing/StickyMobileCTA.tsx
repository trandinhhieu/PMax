"use client";

import Link from "next/link";
import { CalendarCheck, MapPin, Utensils } from "lucide-react";
import { businessInfo } from "@/config/business";
import { trackingEvents } from "@/config/tracking";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/types/common";

export function StickyMobileCTA({ locale }: { locale: Locale }) {
  return (
    <nav
      aria-label={locale === "en" ? "Sticky mobile actions" : "Hành động nhanh trên di động"}
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 gap-1 border-t border-borderWarm bg-porcelain p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-large md:hidden"
    >
      <a
        className="flex min-h-12 flex-col items-center justify-center rounded-lg bg-tomato px-2 text-xs font-bold text-white"
        href={businessInfo.googleMapsUrl}
        onClick={() =>
          trackEvent(trackingEvents.clickGetDirections, {
            location: "sticky_mobile_cta",
            page_language: locale,
          })
        }
        rel="noreferrer"
        target="_blank"
      >
        <MapPin aria-hidden className="mb-1 h-4 w-4" />
        {locale === "en" ? "Directions" : "Chỉ đường"}
      </a>
      <Link
        className="flex min-h-12 flex-col items-center justify-center rounded-lg px-2 text-xs font-bold text-charcoal"
        href={`/${locale}/menu`}
        onClick={() =>
          trackEvent(trackingEvents.viewMenu, {
            location: "sticky_mobile_cta",
            page_language: locale,
          })
        }
      >
        <Utensils aria-hidden className="mb-1 h-4 w-4" />
        {locale === "en" ? "Menu" : "Thực đơn"}
      </Link>
      <a
        className="flex min-h-12 flex-col items-center justify-center rounded-lg px-2 text-xs font-bold text-charcoal"
        href={`/${locale}#booking`}
        onClick={() =>
          trackEvent(trackingEvents.bookingStart, {
            location: "sticky_mobile_cta",
            page_language: locale,
          })
        }
      >
        <CalendarCheck aria-hidden className="mb-1 h-4 w-4" />
        {locale === "en" ? "Book" : "Đặt bàn"}
      </a>
    </nav>
  );
}
