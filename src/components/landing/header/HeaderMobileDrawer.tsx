"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, MapPin, X } from "lucide-react";
import type { RefObject } from "react";
import { businessInfo } from "@/config/business";
import { trackingCtaTypes, trackingEvents } from "@/config/tracking";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { Button, Stack } from "@/components/ui";
import { TrackedLink } from "../TrackedLink";

type HeaderMobileDrawerProps = {
  activeHref: string;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  closeMenu: () => void;
  drawerRef: RefObject<HTMLDivElement | null>;
  homePath: string;
  isDrawerVisible: boolean;
  links: Array<{ href: string; label: string }>;
  locale: Locale;
  nextLocale: Locale;
  nextLocalePath: string;
  onBookingClick: (location: string) => void;
  onLanguageSwitch: (location: string) => void;
  setActiveHref: (href: string) => void;
  t: {
    hero: { booking: string };
    nav: { directions: string };
  };
};

export function HeaderMobileDrawer({
  activeHref,
  closeButtonRef,
  closeMenu,
  drawerRef,
  homePath,
  isDrawerVisible,
  links,
  locale,
  nextLocale,
  nextLocalePath,
  onBookingClick,
  onLanguageSwitch,
  setActiveHref,
  t,
}: HeaderMobileDrawerProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] bg-charcoal/45 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
        isDrawerVisible ? "opacity-100" : "opacity-0",
      )}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeMenu();
      }}
    >
      <div
        ref={drawerRef}
        aria-labelledby="mobile-navigation-title"
        aria-modal="true"
        className={cn(
          "ml-auto flex h-full w-[min(88vw,360px)] flex-col border-l border-borderWarm bg-cream p-5 text-charcoal shadow-large transition-transform duration-300 ease-out",
          isDrawerVisible ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="relative h-11 w-11 overflow-hidden rounded-lg bg-porcelain shadow-small">
            <Image alt="Hermanos logo" className="object-cover" fill sizes="44px" src={businessInfo.assets.logo} />
          </span>
          <span className="sr-only" id="mobile-navigation-title">
            Hermanos navigation
          </span>
          <Button ref={closeButtonRef} aria-label="Close menu" className="h-11 w-11 border-borderWarm bg-porcelain text-charcoal hover:border-tomato hover:text-tomato" onClick={closeMenu} size="md" variant="secondary">
            <X aria-hidden className="h-5 w-5" />
          </Button>
        </div>

        <Stack className="mt-8" gap="sm">
          <nav className="grid gap-2 text-base font-bold">
            {links.map((link) => (
              <a
                aria-current={activeHref === link.href ? "page" : undefined}
                className={cn(
                  "rounded-lg border px-4 py-4 transition",
                  activeHref === link.href
                    ? "border-tomato bg-tomato text-white shadow-hover"
                    : "border-borderWarm bg-porcelain text-charcoal hover:border-tomato hover:text-tomato hover:shadow-small",
                )}
                href={link.href}
                key={link.href}
                onClick={() => {
                  setActiveHref(link.href);
                  closeMenu();
                }}
              >
                {link.label}
              </a>
            ))}
            <Link className="hidden" href={nextLocalePath} onClick={() => onLanguageSwitch("mobile_drawer")} scroll={false}>
              {nextLocale === "vi" ? "Tiếng Việt" : "English"}
            </Link>
          </nav>
        </Stack>

        <Stack className="mt-auto pb-2" gap="sm">
          <a
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-tomato px-5 py-3 font-bold text-white shadow-hover transition hover:bg-tomato-hover"
            href={`${homePath}#booking`}
            onClick={() => {
              setActiveHref(`${homePath}#booking`);
              onBookingClick("mobile_drawer");
              closeMenu();
            }}
          >
            <CalendarCheck aria-hidden className="mr-2 h-5 w-5" />
            {t.hero.booking}
          </a>
          <TrackedLink
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-borderWarm bg-porcelain px-5 py-3 font-bold text-charcoal transition hover:border-tomato hover:text-tomato"
            ctaType={trackingCtaTypes.directions}
            event={trackingEvents.clickGetDirections}
            href={businessInfo.googleMapsUrl}
            locale={locale}
            location="mobile_drawer"
          >
            <MapPin aria-hidden className="mr-2 h-5 w-5" />
            {t.nav.directions}
          </TrackedLink>
        </Stack>
      </div>
    </div>
  );
}
