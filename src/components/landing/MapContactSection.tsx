"use client";

import { Copy, Facebook, Instagram, MapPin, MessageCircle, Music2, Phone } from "lucide-react";
import type { Locale } from "@/types/common";
import { businessInfo } from "@/config/business";
import { trackingEvents } from "@/config/tracking";
import { copy } from "@/data/content";
import { trackEvent } from "@/lib/analytics";
import { TrackedLink } from "./TrackedLink";

export function MapContactSection({ locale }: { locale: Locale }) {
  const t = copy[locale];

  const copyAddress = async () => {
    await navigator.clipboard.writeText(businessInfo.address[locale]);
    trackEvent(trackingEvents.copyAddress, {
      location: "map_section",
      page_language: locale,
    });
  };

  return (
    <section className="bg-cream px-4 py-20 sm:px-6 lg:px-8" id="contact">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg bg-charcoal p-8 text-white shadow-large">
          <p className="text-sm font-bold uppercase tracking-wide text-orange-200">{locale === "en" ? "Location" : "Vị trí"}</p>
          <h2 className="mt-3 font-display text-4xl font-bold">{t.sections.mapTitle}</h2>
          <p className="mt-4 text-lg leading-8 text-stone-100">{t.sections.mapBody}</p>
          <div className="mt-6 space-y-3 text-stone-100">
            <p className="flex gap-3">
              <MapPin aria-hidden className="mt-1 h-5 w-5 shrink-0 text-orange-200" />
              <span>{businessInfo.address[locale]}</span>
            </p>
            <p className="flex gap-3">
              <Phone aria-hidden className="mt-1 h-5 w-5 shrink-0 text-orange-200" />
              <span>{businessInfo.displayPhone}</span>
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <TrackedLink
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-tomato px-5 py-3 font-bold text-white hover:bg-tomato-hover"
              event={trackingEvents.clickGetDirections}
              href={businessInfo.googleMapsUrl}
              locale={locale}
              location="map_section"
            >
              <MapPin aria-hidden className="mr-2 h-4 w-4" />
              {t.nav.directions}
            </TrackedLink>
            <button className="inline-flex min-h-12 items-center justify-center rounded-lg bg-porcelain px-5 py-3 font-bold text-charcoal" onClick={copyAddress} type="button">
              <Copy aria-hidden className="mr-2 h-4 w-4" />
              {locale === "en" ? "Copy" : "Sao chép"}
            </button>
            <TrackedLink
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/50 px-5 py-3 font-bold text-white hover:bg-white/10"
              event={trackingEvents.clickCall}
              href={`tel:${businessInfo.phone}`}
              locale={locale}
              location="map_section"
            >
              <Phone aria-hidden className="mr-2 h-4 w-4" />
              {locale === "en" ? "Call" : "Gọi ngay"}
            </TrackedLink>
          </div>
        </div>
        <div className="rounded-lg border border-borderWarm bg-porcelain p-8">
          <h2 className="font-display text-3xl font-bold text-charcoal">{t.sections.contactTitle}</h2>
          <div className="mt-6 grid gap-3">
            <TrackedLink
              className="inline-flex min-h-12 items-center rounded-lg border border-borderWarm bg-white px-5 py-3 font-bold text-charcoal hover:border-tomato"
              event={trackingEvents.clickFacebookMessage}
              href={businessInfo.socials.facebook}
              locale={locale}
              location="contact_section"
            >
              <Facebook aria-hidden className="mr-3 h-5 w-5" />
              Facebook
            </TrackedLink>
            <TrackedLink
              className="inline-flex min-h-12 items-center rounded-lg border border-borderWarm bg-white px-5 py-3 font-bold text-charcoal hover:border-tomato"
              event={trackingEvents.socialClick}
              href={businessInfo.socials.instagram}
              locale={locale}
              location="contact_section"
            >
              <Instagram aria-hidden className="mr-3 h-5 w-5" />
              Instagram
            </TrackedLink>
            <TrackedLink
              className="inline-flex min-h-12 items-center rounded-lg border border-borderWarm bg-white px-5 py-3 font-bold text-charcoal hover:border-tomato"
              event={trackingEvents.clickWhatsapp}
              href={businessInfo.socials.whatsapp}
              locale={locale}
              location="contact_section"
            >
              <MessageCircle aria-hidden className="mr-3 h-5 w-5" />
              WhatsApp
            </TrackedLink>
            {businessInfo.socials.zalo ? (
              <TrackedLink
                className="inline-flex min-h-12 items-center rounded-lg border border-borderWarm bg-white px-5 py-3 font-bold text-charcoal hover:border-tomato"
                event={trackingEvents.clickZalo}
                href={businessInfo.socials.zalo}
                locale={locale}
                location="contact_section"
              >
                <MessageCircle aria-hidden className="mr-3 h-5 w-5" />
                Zalo
              </TrackedLink>
            ) : null}
            {businessInfo.socials.tiktok ? (
              <TrackedLink
                className="inline-flex min-h-12 items-center rounded-lg border border-borderWarm bg-white px-5 py-3 font-bold text-charcoal hover:border-tomato"
                event={trackingEvents.socialClick}
                href={businessInfo.socials.tiktok}
                locale={locale}
                location="contact_section"
              >
                <Music2 aria-hidden className="mr-3 h-5 w-5" />
                TikTok
              </TrackedLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
