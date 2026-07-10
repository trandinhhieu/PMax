"use client";

import { ArrowUp, Clock3, Copy, Facebook, Instagram, MapPin, MessageCircle, Music2, Phone, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui";
import { businessInfo } from "@/config/business";
import { trackingEvents } from "@/config/tracking";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/types/common";

export function FloatingActionGroup({ locale }: { locale: Locale }) {
  const [showTop, setShowTop] = useState(false);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelId = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const en = locale === "en";

  useEffect(() => {
    const update = () => setShowTop(window.scrollY > 520);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!groupRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => () => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
  }, []);

  const toggleContact = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) trackEvent(trackingEvents.contactPanelOpen, { location: "floating_action", page_language: locale });
  };

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(businessInfo.address[locale]);
    setCopied(true);
    trackEvent(trackingEvents.copyAddress, { location: "floating_action", page_language: locale });
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const trackContact = (event: (typeof trackingEvents)[keyof typeof trackingEvents], channel: string) => {
    trackEvent(event, { channel, location: "floating_action", page_language: locale });
  };

  const actionClass = "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-charcoal transition hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tomato";
  const socialClass = "inline-flex h-11 w-11 items-center justify-center rounded-full border border-borderWarm text-charcoal transition hover:border-tomato hover:text-tomato focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tomato";

  return (
    <div ref={groupRef} className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 md:bottom-6 z-40 flex flex-col items-end gap-3 sm:right-6">
      {open ? (
        <section aria-label={en ? "Hermanos contact information" : "Thông tin liên hệ Hermanos"} className="w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-borderWarm bg-porcelain p-4 shadow-large" id={panelId}>
          <div className="flex items-start justify-between gap-4">
            <div><p className="font-display text-xl font-bold text-charcoal">{en ? "Contact Hermanos" : "Liên hệ Hermanos"}</p><p className="mt-1 text-sm text-muted">{businessInfo.openingHours[locale]}</p></div>
            <Button aria-label={en ? "Close contact information" : "Đóng thông tin liên hệ"} className="h-10 w-10 shrink-0 rounded-full" onClick={() => setOpen(false)} size="sm" variant="ghost"><X aria-hidden className="h-5 w-5" /></Button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a className={actionClass} href={`tel:${businessInfo.phone}`} onClick={() => trackContact(trackingEvents.clickCall, "phone")}><Phone aria-hidden className="h-5 w-5 text-tomato" />{en ? "Call" : "Gọi ngay"}</a>
            <a className={actionClass} href={businessInfo.googleMapsUrl} onClick={() => trackContact(trackingEvents.clickGetDirections, "maps")} rel="noreferrer" target="_blank"><MapPin aria-hidden className="h-5 w-5 text-tomato" />{en ? "Directions" : "Chỉ đường"}</a>
            <a className={actionClass} href={businessInfo.socials.whatsapp} onClick={() => trackContact(trackingEvents.clickWhatsapp, "whatsapp")} rel="noreferrer" target="_blank"><MessageCircle aria-hidden className="h-5 w-5 text-tomato" />WhatsApp</a>
            <a className={actionClass} href={businessInfo.socials.zalo} onClick={() => trackContact(trackingEvents.clickZalo, "zalo")} rel="noreferrer" target="_blank"><MessageCircle aria-hidden className="h-5 w-5 text-tomato" />Zalo</a>
          </div>
          <div className="mt-3 rounded-xl bg-cream/80 p-3 text-sm text-muted">
            <p className="flex gap-2"><MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-tomato" /><span>{businessInfo.address[locale]}</span></p>
            <p className="mt-2 flex gap-2"><Phone aria-hidden className="h-4 w-4 shrink-0 text-tomato" /><span>{businessInfo.displayPhone}</span></p>
            <p className="mt-2 flex gap-2"><Clock3 aria-hidden className="h-4 w-4 shrink-0 text-tomato" /><span>{businessInfo.openingHours[locale]}</span></p>
            <button className="mt-3 inline-flex min-h-10 items-center gap-2 font-bold text-charcoal hover:text-tomato" onClick={copyAddress} type="button"><Copy aria-hidden className="h-4 w-4" />{copied ? (en ? "Address copied" : "Đã sao chép địa chỉ") : (en ? "Copy address" : "Sao chép địa chỉ")}</button>
          </div>
          <div aria-label={en ? "Social media" : "Mạng xã hội"} className="mt-4 flex flex-wrap gap-2">
            <a aria-label="Facebook" className={socialClass} href={businessInfo.socials.facebook} onClick={() => trackContact(trackingEvents.socialClick, "facebook")} rel="noreferrer" target="_blank"><Facebook aria-hidden className="h-5 w-5" /></a>
            <a aria-label="Instagram" className={socialClass} href={businessInfo.socials.instagram} onClick={() => trackContact(trackingEvents.socialClick, "instagram")} rel="noreferrer" target="_blank"><Instagram aria-hidden className="h-5 w-5" /></a>
            <a aria-label="TikTok" className={socialClass} href={businessInfo.socials.tiktok} onClick={() => trackContact(trackingEvents.socialClick, "tiktok")} rel="noreferrer" target="_blank"><Music2 aria-hidden className="h-5 w-5" /></a>
            <a aria-label="Tripadvisor" className={socialClass} href={businessInfo.socials.tripadvisor} onClick={() => trackContact(trackingEvents.socialClick, "tripadvisor")} rel="noreferrer" target="_blank"><MessageCircle aria-hidden className="h-5 w-5" /></a>
          </div>
        </section>
      ) : null}
      <Button ref={triggerRef} aria-controls={panelId} aria-expanded={open} aria-label={open ? (en ? "Close contact information" : "Đóng thông tin liên hệ") : (en ? "Contact Hermanos" : "Liên hệ Hermanos")} className="h-12 w-12 rounded-full border-white/70 bg-tomato text-white shadow-large hover:bg-tomato-hover md:h-14 md:w-14" onClick={toggleContact} size="md" variant="ghost">{open ? <X aria-hidden className="h-5 w-5" /> : <MessageCircle aria-hidden className="h-5 w-5" strokeWidth={2.5} />}</Button>
      <Button aria-label={en ? "Back to top" : "Lên đầu trang"} className={`h-12 w-12 rounded-full border-white/70 bg-charcoal text-white shadow-large transition duration-200 hover:bg-tomato md:h-14 md:w-14 ${showTop ? "opacity-100" : "pointer-events-none h-0 translate-y-3 border-0 opacity-0 md:h-0"}`} onClick={scrollToTop} size="md" variant="ghost"><ArrowUp aria-hidden className="h-5 w-5" strokeWidth={2.5} /></Button>
    </div>
  );
}
