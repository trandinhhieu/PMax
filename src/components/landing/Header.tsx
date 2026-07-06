"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, MapPin, Menu as MenuIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { businessInfo } from "@/config/business";
import { trackingEvents } from "@/config/tracking";
import { copy } from "@/data/content";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/types/common";
import { TrackedLink } from "./TrackedLink";

export function Header({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const nextLocale = locale === "en" ? "vi" : "en";
  const homePath = `/${locale}`;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const homeSectionLinks = [
    { href: "#menu", label: t.nav.menu },
    { href: "#story", label: locale === "en" ? "Story" : "Câu chuyện" },
    { href: "#gallery", label: locale === "en" ? "Gallery" : "Thư viện" },
    { href: "#reviews", label: locale === "en" ? "Reviews" : "Đánh giá" },
    { href: "#contact", label: t.nav.contact },
  ];
  const navLinks = homeSectionLinks.map((link) => ({ ...link, href: `${homePath}${link.href}` }));

  useEffect(() => {
    setIsMounted(true);

    const onScroll = () => setIsScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const closeMenu = () => {
    setIsOpen(false);
    window.setTimeout(() => menuButtonRef.current?.focus(), 0);
  };

  const trackBookingStart = (location: string) => {
    trackEvent(trackingEvents.bookingStart, {
      location,
      page_language: locale,
    });
  };

  const mobileDrawer = (
    <div
      className="fixed inset-0 z-[60] bg-charcoal/80 backdrop-blur-sm lg:hidden"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeMenu();
      }}
    >
      <div
        ref={drawerRef}
        aria-labelledby="mobile-navigation-title"
        aria-modal="true"
        className="ml-auto flex h-full w-[min(88vw,360px)] flex-col border-l border-white/10 bg-charcoal p-5 text-porcelain shadow-large"
        role="dialog"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="font-display text-2xl font-bold text-porcelain" id="mobile-navigation-title">
            Hermanos
          </span>
          <button
            ref={closeButtonRef}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-porcelain transition hover:bg-white/15"
            onClick={closeMenu}
            type="button"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 grid gap-2 text-base font-bold">
          {navLinks.map((link) => (
            <a
              className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-4 text-porcelain transition hover:border-fire/50 hover:bg-white/10"
              href={link.href}
              key={link.href}
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
          <Link
            className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-4 text-porcelain transition hover:border-fire/50 hover:bg-white/10"
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
              trackBookingStart("mobile_drawer");
              closeMenu();
            }}
          >
            <CalendarCheck aria-hidden className="mr-2 h-5 w-5" />
            {t.hero.booking}
          </a>
          <TrackedLink
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 bg-white/[0.08] px-5 py-3 font-bold text-porcelain transition hover:bg-white/[0.12]"
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
              className={`hidden min-h-11 rounded-lg border px-3 py-2 text-sm font-bold transition sm:inline-flex ${
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
              onClick={() => setIsOpen(true)}
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
