"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, MapPin, Menu as MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { businessInfo } from "@/config/business";
import { trackingEvents } from "@/config/tracking";
import { copy } from "@/data/content";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/types/common";
import { HeaderDesktopNav } from "./header/HeaderDesktopNav";
import { HeaderMobileDrawer } from "./header/HeaderMobileDrawer";
import { useHeaderLocation } from "./header/useHeaderLocation";
import { useHeaderScrollState } from "./header/useHeaderScrollState";
import { useMobileNavDrawer } from "./header/useMobileNavDrawer";
import { TrackedLink } from "./TrackedLink";

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const t = copy[locale];
  const nextLocale = locale === "en" ? "vi" : "en";
  const homePath = `/${locale}`;
  const isScrolled = useHeaderScrollState();
  const { activeHref, nextLocalePath, setActiveHref } = useHeaderLocation({ homePath, nextLocale, pathname });
  const { closeButtonRef, closeMenu, drawerRef, isDrawerVisible, isMounted, isOpen, menuButtonRef, openMenu } = useMobileNavDrawer();

  const homeSectionLinks = [
    { href: "#story", label: locale === "en" ? "Story" : "Câu chuyện" },
    { href: "#gallery", label: locale === "en" ? "Gallery" : "Thư viện" },
    { href: "#reviews", label: locale === "en" ? "Reviews" : "Đánh giá" },
    { href: "#contact", label: t.nav.contact },
  ];
  const navLinks = [{ href: `${homePath}/menu`, label: t.nav.menu }, ...homeSectionLinks.map((link) => ({ ...link, href: `${homePath}${link.href}` }))];

  const handleBookingClick = (location: string) => {
    trackEvent(trackingEvents.bookingStart, {
      location,
      page_language: locale,
    });
  };

  const handleLanguageSwitch = (location: string) => {
    trackEvent(trackingEvents.languageSwitch, {
      location,
      page_language: locale,
      target_language: nextLocale,
    });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-16 transition duration-200 md:h-[72px] ${
          isScrolled ? "border-b border-borderWarm bg-cream/95 shadow-small backdrop-blur" : "bg-charcoal/55 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 xl:px-16">
          <Link
            className={`flex min-h-11 items-center gap-3 font-display text-xl font-bold ${isScrolled ? "text-charcoal" : "text-white"}`}
            href={`/${locale}`}
          >
            <span className="relative h-10 w-10 overflow-hidden rounded-lg bg-porcelain">
              <Image alt="Hermanos logo" className="object-cover" fill sizes="40px" src={businessInfo.assets.logo} />
            </span>
            <span>Hermanos</span>
          </Link>

          <HeaderDesktopNav isScrolled={isScrolled} links={navLinks} />

          <div className="flex items-center gap-2">
            <TrackedLink
              className={`hidden min-h-11 items-center rounded-lg border px-4 py-2 text-sm font-bold transition sm:inline-flex ${
                isScrolled ? "border-borderWarm bg-porcelain text-charcoal hover:border-tomato" : "border-white/50 text-white hover:bg-white/10"
              }`}
              event={trackingEvents.clickGetDirections}
              href={businessInfo.googleMapsUrl}
              locale={locale}
              location="header"
            >
              <MapPin aria-hidden className="mr-2 h-4 w-4" />
              {t.nav.directions}
            </TrackedLink>
            <a
              className="hidden min-h-11 items-center rounded-lg bg-tomato px-4 py-2 text-sm font-bold text-white transition hover:bg-tomato-hover lg:inline-flex"
              href={`${homePath}#booking`}
              onClick={() => handleBookingClick("header")}
            >
              <CalendarCheck aria-hidden className="mr-2 h-4 w-4" />
              {t.hero.booking}
            </a>
            <Link
              aria-label={locale === "en" ? "Switch language to Vietnamese" : "Chuyển ngôn ngữ sang tiếng Anh"}
              className={`inline-flex min-h-11 items-center rounded-lg border px-3 py-2 text-sm font-bold transition ${
                isScrolled ? "border-borderWarm text-charcoal hover:border-tomato" : "border-white/50 text-white hover:bg-white/10"
              }`}
              href={nextLocalePath}
              onClick={() => handleLanguageSwitch("header")}
            >
              {nextLocale.toUpperCase()}
            </Link>
            <button
              ref={menuButtonRef}
              aria-expanded={isOpen}
              aria-label="Open menu"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border transition lg:hidden ${
                isScrolled ? "border-borderWarm bg-white text-charcoal" : "border-white/50 bg-charcoal/20 text-white"
              }`}
              onClick={openMenu}
              type="button"
            >
              <MenuIcon aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      {isMounted && isOpen
        ? createPortal(
            <HeaderMobileDrawer
              activeHref={activeHref}
              closeButtonRef={closeButtonRef}
              closeMenu={closeMenu}
              drawerRef={drawerRef}
              homePath={homePath}
              isDrawerVisible={isDrawerVisible}
              links={navLinks}
              locale={locale}
              nextLocale={nextLocale}
              nextLocalePath={nextLocalePath}
              onBookingClick={handleBookingClick}
              onLanguageSwitch={handleLanguageSwitch}
              setActiveHref={setActiveHref}
              t={t}
            />,
            document.body,
          )
        : null}
    </>
  );
}
