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
    <section className="relative min-h-[calc(86vh-72px)] overflow-hidden bg-charcoal text-white">
      <Image
        priority
        alt="Wood-fired pizza served at Hermanos Da Nang"
        className="absolute inset-0 h-full w-full object-cover"
        fill
        sizes="100vw"
        src={businessInfo.assets.hero}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,14,10,0.80),rgba(20,14,10,0.46),rgba(20,14,10,0.18))]" />
      <div className="relative mx-auto flex min-h-[72vh] max-w-7xl items-center px-4 pb-14 pt-24 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-orange-100 backdrop-blur">
            {t.hero.eyebrow}
          </p>
          <h1 className="font-display text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">{t.hero.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-100 sm:text-xl">{t.hero.body}</p>
          <p className="mt-5 inline-flex max-w-2xl rounded-lg border border-white/20 bg-black/20 px-4 py-3 text-sm font-semibold text-stone-100 backdrop-blur">
            {businessInfo.openingHours[locale]} - {businessInfo.address[locale]}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <TrackedLink
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-tomato px-6 py-4 font-bold text-white shadow-large transition hover:-translate-y-0.5 hover:bg-tomato-hover"
              event={trackingEvents.viewMenu}
              href={`/${locale}/menu`}
              locale={locale}
              location="hero"
            >
              <Utensils aria-hidden className="mr-2 h-5 w-5" />
              {t.hero.menu}
            </TrackedLink>
            <TrackedLink
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-porcelain px-6 py-4 font-bold text-charcoal transition hover:-translate-y-0.5"
              event={trackingEvents.clickGetDirections}
              href={businessInfo.googleMapsUrl}
              locale={locale}
              location="hero"
            >
              <MapPin aria-hidden className="mr-2 h-5 w-5" />
              {t.hero.directions}
            </TrackedLink>
            <TrackedLink
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/60 px-6 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              event={trackingEvents.bookingStart}
              href="#booking"
              locale={locale}
              location="hero"
            >
              <CalendarCheck aria-hidden className="mr-2 h-5 w-5" />
              {t.hero.booking}
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  );
}
