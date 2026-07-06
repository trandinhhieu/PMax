"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, MapPin, Menu as MenuIcon, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { businessInfo } from "@/config/business";
import { trackingEvents } from "@/config/tracking";
import { copy } from "@/data/content";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/common";
import { TrackedLink } from "./TrackedLink";

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const t = copy[locale];
  const nextLocale = locale === "en" ? "vi" : "en";
  const homePath = `/${locale}`;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeHref, setActiveHref] = useState(`${homePath}/menu`);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const homeSectionLinks = [
    { href: "#story", label: locale === "en" ? "Story" : "Câu chuyện" },
    { href: "#gallery", label: locale === "en" ? "Gallery" : "Thư viện" },
    { href: "#reviews", label: locale === "en" ? "Reviews" : "Đánh giá" },
    { href: "#contact", label: t.nav.contact },
  ];
  const navLinks = [{ href: `${homePath}/menu`, label: t.nav.menu }, ...homeSectionLinks.map((link) => ({ ...link, href: `${homePath}${link.href}` }))];

  useEffect(() => {
    setIsMounted(true);

    const onScroll = () => setIsScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const updateActiveHref = () => {
      setActiveHref(window.location.pathname.endsWith("/menu") ? window.location.pathname : `${window.location.pathname}${window.location.hash}`);
    };

    updateActiveHref();
    window.addEventListener("hashchange", updateActiveHref);

    return () => window.removeEventListener("hashchange", updateActiveHref);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const openMenu = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }

    setIsOpen(true);
    window.requestAnimationFrame(() => setIsDrawerVisible(true));
  };

  const closeMenu = () => {
    setIsDrawerVisible(false);
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
      menuButtonRef.current?.focus();
    }, 220);
  };

  const trackBookingStart = (location: string) => {
    trackEvent(trackingEvents.bookingStart, {
      location,
      page_language: locale,
    });
  };

  const mobileDrawer = (
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
          <button
            ref={closeButtonRef}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-borderWarm bg-porcelain text-charcoal transition hover:border-tomato hover:text-tomato"
            onClick={closeMenu}
            type="button"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 grid gap-2 text-base font-bold">
          {navLinks.map((link) => (
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
          <Link
            className="hidden"
            href={`/${nextLocale}`}
            onClick={() =>
              trackEvent(trackingEvents.languageSwitch, {
                location: "mobile_drawer",
                page_language: locale,
                target_language: nextLocale,
              })
            }
          >
            {locale === "en" ? "Tiếng Việt" : "English"}
          </Link>
        </nav>

        <div className="mt-auto grid gap-3 pb-2">
          <a
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-tomato px-5 py-3 font-bold text-white shadow-hover transition hover:bg-tomato-hover"
            href={`${homePath}#booking`}
            onClick={() => {
              setActiveHref(`${homePath}#booking`);
              trackBookingStart("mobile_drawer");
              closeMenu();
            }}
          >
            <CalendarCheck aria-hidden className="mr-2 h-5 w-5" />
            {t.hero.booking}
          </a>
          <TrackedLink
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-borderWarm bg-porcelain px-5 py-3 font-bold text-charcoal transition hover:border-tomato hover:text-tomato"
            event={trackingEvents.clickGetDirections}
            external
            href={businessInfo.googleMapsUrl}
            locale={locale}
            location="mobile_drawer"
          >
            <MapPin aria-hidden className="mr-2 h-5 w-5" />
            {t.nav.directions}
          </TrackedLink>
        </div>
      </div>
    </div>
  );

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

          <nav
            aria-label="Main navigation"
            className={`hidden items-center gap-6 text-sm font-semibold lg:flex ${isScrolled ? "text-charcoal" : "text-white"}`}
          >
            {navLinks.map((link) => (
              <a className="underline-offset-8 transition hover:text-fire hover:underline" href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <TrackedLink
              className={`hidden min-h-11 items-center rounded-lg border px-4 py-2 text-sm font-bold transition sm:inline-flex ${
                isScrolled ? "border-borderWarm bg-porcelain text-charcoal hover:border-tomato" : "border-white/50 text-white hover:bg-white/10"
              }`}
              event={trackingEvents.clickGetDirections}
              external
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
              onClick={() => trackBookingStart("header")}
            >
              <CalendarCheck aria-hidden className="mr-2 h-4 w-4" />
              {t.hero.booking}
            </a>
            <Link
              aria-label={locale === "en" ? "Switch language to Vietnamese" : "Chuyển ngôn ngữ sang tiếng Anh"}
              className={`inline-flex min-h-11 items-center rounded-lg border px-3 py-2 text-sm font-bold transition ${
                isScrolled ? "border-borderWarm text-charcoal hover:border-tomato" : "border-white/50 text-white hover:bg-white/10"
              }`}
              href={`/${nextLocale}`}
              onClick={() =>
                trackEvent(trackingEvents.languageSwitch, {
                  location: "header",
                  page_language: locale,
                  target_language: nextLocale,
                })
              }
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
      {isMounted && isOpen ? createPortal(mobileDrawer, document.body) : null}
    </>
  );
}
