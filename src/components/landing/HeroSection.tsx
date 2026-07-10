import Image from "next/image";
import { CalendarCheck, MapPin, Utensils } from "lucide-react";
import { businessInfo } from "@/config/business";
import { trackingEvents } from "@/config/tracking";
import { copy } from "@/data/content";
import type { Locale } from "@/types/common";
import { TrackedLink } from "./TrackedLink";

export function HeroSection({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return (
    <section className="relative min-h-[680px] overflow-hidden bg-charcoal text-white lg:min-h-[760px]">
      <div className="absolute inset-0">
        <Image
          priority
          alt="Wood-fired pizza served at Hermanos Da Nang"
          className="object-cover"
          fetchPriority="high"
          fill
          quality={72}
          sizes="100vw"
          src={businessInfo.assets.hero}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E120C]/90 via-[#1E120C]/60 to-[#1E120C]/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_55%,rgba(196,154,90,0.20),transparent_38%)]" />
      </div>
      <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-4 pb-14 pt-24 sm:px-6 lg:min-h-[760px] lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            {t.hero.eyebrow}
          </p>
          <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">{t.hero.body}</p>
          <p className="mt-6 max-w-2xl text-sm font-semibold leading-6 text-white/80 sm:inline-flex sm:items-center">
            {t.hero.trustLine}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <TrackedLink
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-tomato px-7 py-4 text-base font-bold text-white shadow-large transition hover:-translate-y-0.5 hover:bg-tomato-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tomato focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
              event={trackingEvents.viewMenu}
              href={`/${locale}/menu`}
              locale={locale}
              location="hero"
            >
              <Utensils aria-hidden className="mr-2 h-5 w-5" />
              {t.hero.menu}
            </TrackedLink>
            <TrackedLink
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tomato focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
              event={trackingEvents.bookingStart}
              href="#booking"
              locale={locale}
              location="hero"
            >
              <CalendarCheck aria-hidden className="mr-2 h-5 w-5" />
              {t.hero.booking}
            </TrackedLink>
            <TrackedLink
              className="inline-flex min-h-14 items-center justify-center rounded-2xl px-7 py-4 text-base font-bold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tomato focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
              event={trackingEvents.clickGetDirections}
              href={businessInfo.googleMapsUrl}
              locale={locale}
              location="hero"
            >
              <MapPin aria-hidden className="mr-2 h-5 w-5" />
              {t.hero.directions}
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
