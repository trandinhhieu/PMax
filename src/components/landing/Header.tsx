"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, MapPin, Menu as MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { businessInfo } from "@/config/business";
import { trackingCtaTypes, trackingEvents } from "@/config/tracking";
import { copy } from "@/data/content";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/types/common";
import { Button, Container } from "@/components/ui";
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
  const usesOverlayTheme = pathname === homePath || pathname === `${homePath}/`;
  const usesSolidTheme = isScrolled || !usesOverlayTheme;
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
      cta_type: trackingCtaTypes.booking,
      location,
      page_language: locale,
    });
  };

  const handleLanguageSwitch = (location: string) => {
    trackEvent(trackingEvents.languageSwitch, {
      cta_type: trackingCtaTypes.language,
      location,
      page_language: locale,
      target_language: nextLocale,
    });
  };

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 h-16 transition duration-200 md:h-20 ${usesSolidTheme ? "bg-cream/95 shadow-medium backdrop-blur" : "bg-transparent"}`}>
        <Container className="flex h-full items-center justify-between gap-4">
          <Link className={`flex items-center gap-3 font-display text-lg font-bold md:text-xl ${usesSolidTheme ? "text-charcoal" : "text-white"}`} href={`/${locale}`}>
            <span className="relative h-12 w-12 overflow-hidden rounded-lg bg-white/90 shadow-small md:h-12 md:w-12">
              <Image alt="Hermanos logo" className="object-cover" fill quality={70} sizes="48px" src={businessInfo.assets.logo} />
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-4">
            <HeaderDesktopNav isScrolled={usesSolidTheme} links={navLinks} />
            <TrackedLink
              className={`hidden min-h-11 items-center rounded-lg border px-3 py-2 text-sm font-bold transition lg:inline-flex ${usesSolidTheme ? "border-borderWarm text-charcoal hover:border-tomato" : "border-white/50 text-white hover:bg-white/10"}`}
              ctaType={trackingCtaTypes.directions}
              event={trackingEvents.clickGetDirections}
              href={businessInfo.googleMapsUrl}
              locale={locale}
              location="header"
            >
              <MapPin aria-hidden className="mr-2 h-4 w-4" />
              {t.nav.directions}
            </TrackedLink>
            <a
              className={`hidden min-h-11 items-center rounded-lg px-4 py-2 text-sm font-bold transition lg:inline-flex ${usesSolidTheme ? "bg-tomato text-white hover:bg-tomato-hover" : "bg-white/15 text-white hover:bg-white/25"}`}
              href={`${homePath}#booking`}
              onClick={() => handleBookingClick("header")}
            >
              <CalendarCheck aria-hidden className="mr-2 h-4 w-4" />
              {t.hero.booking}
            </a>
            <Link
              aria-label={locale === "en" ? "Switch language to Vietnamese" : "Chuyển ngôn ngữ sang tiếng Anh"}
              className={`inline-flex min-h-11 items-center rounded-lg border px-2.5 py-2 text-xs font-bold transition ${usesSolidTheme ? "border-borderWarm text-charcoal hover:border-tomato" : "border-white/50 text-white hover:bg-white/10"}`}
              href={nextLocalePath}
              onClick={() => handleLanguageSwitch("header")}
              scroll={false}
            >
              {nextLocale.toUpperCase()}
            </Link>
            <Button
              ref={menuButtonRef}
              aria-expanded={isOpen}
              className={`min-h-10 gap-2 px-4 font-bold lg:hidden ${usesSolidTheme ? "bg-tomato text-white hover:bg-tomato-hover" : "border-white/70 bg-white text-charcoal hover:bg-cream"}`}
              onClick={openMenu}
              size="md"
              variant="primary"
            >
              <MenuIcon aria-hidden className="h-5 w-5" />
            </Button>
          </div>
        </Container>
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
