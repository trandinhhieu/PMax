"use client";

import { Phone, MessageCircle, Shield } from "lucide-react";
import { businessInfo } from "@/config/business";
import { trackingCtaTypes, trackingEvents } from "@/config/tracking";
import { TrackedLink } from "@/components/landing/TrackedLink";
import { PremiumBookingForm } from "./BookingForm";
import { getPremiumFormCopy } from "./booking-form-premium";
import type { Locale } from "@/types/common";
import { copy } from "@/data/content";

export function BookingSection({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const premiumCopy = getPremiumFormCopy(locale);

  return (
    <section className="safe-area-inline overflow-x-clip bg-cream py-16 sm:py-20" id="booking">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="mb-8 text-center lg:text-left">
          <span className="inline-block rounded-full bg-fire/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-fire">
            {premiumCopy.badge}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          {/* Left: Hero + Trust sidebar */}
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-4xl font-bold leading-tight text-charcoal sm:text-5xl">
                {t.sections.bookingTitle}
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted">
                {t.sections.bookingBody}
              </p>
            </div>

            {/* Trust sidebar */}
            <div className="rounded-xl border border-borderWarm bg-porcelain p-6 shadow-medium">
              <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal">
                {premiumCopy.trustTitle}
              </h3>
              <ul className="mt-4 space-y-3">
                {premiumCopy.trustPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-muted">
                    <Shield className="mt-0.5 h-4 w-4 shrink-0 text-olive" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact action links */}
            <div className="grid gap-3 sm:grid-cols-2">
              <TrackedLink
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-borderWarm bg-porcelain px-5 py-3 font-bold text-charcoal transition hover:border-tomato hover:shadow-small"
                ctaType={trackingCtaTypes.call}
                event={trackingEvents.clickCall}
                href={`tel:${businessInfo.phone}`}
                locale={locale}
                location="booking_premium_section"
              >
                <Phone aria-hidden className="h-4 w-4" />
                {premiumCopy.callLabel}
              </TrackedLink>
              <TrackedLink
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-borderWarm bg-porcelain px-5 py-3 font-bold text-charcoal transition hover:border-tomato hover:shadow-small"
                ctaType={trackingCtaTypes.whatsapp}
                event={trackingEvents.clickWhatsapp}
                href={businessInfo.socials.whatsapp}
                locale={locale}
                location="booking_premium_section"
              >
                <MessageCircle aria-hidden className="h-4 w-4" />
                WhatsApp
              </TrackedLink>
            </div>
          </div>

          {/* Right: Premium form */}
          <PremiumBookingForm locale={locale} />
        </div>
      </div>
    </section>
  );
}
