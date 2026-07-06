"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/common";

type BackToTopButtonProps = {
  locale: Locale;
};

export function BackToTopButton({ locale }: BackToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 520);
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      aria-label={locale === "en" ? "Back to top" : "Lên đầu trang"}
      className={cn(
        "fixed bottom-24 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-charcoal text-white shadow-large transition duration-200 hover:bg-tomato focus-visible:outline-white sm:right-6 md:bottom-6 md:h-14 md:w-14",
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
      onClick={scrollToTop}
      type="button"
    >
      <ArrowUp aria-hidden className="h-5 w-5" strokeWidth={2.5} />
    </button>
  );
}
