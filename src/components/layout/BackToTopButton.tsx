"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
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
    <Button
      aria-label={locale === "en" ? "Back to top" : "Lên đầu trang"}
      className={isVisible ? "fixed bottom-24 right-4 z-40 h-12 w-12 rounded-full border-white/70 bg-charcoal text-white shadow-large transition duration-200 hover:bg-tomato sm:right-6 md:bottom-6 md:h-14 md:w-14" : "pointer-events-none fixed bottom-24 right-4 z-40 h-12 w-12 rounded-full border-white/70 bg-charcoal text-white opacity-0 shadow-large transition duration-200 hover:bg-tomato sm:right-6 md:bottom-6 md:h-14 md:w-14 md:translate-y-3"}
      onClick={scrollToTop}
      size="md"
      variant="ghost"
    >
      <ArrowUp aria-hidden className="h-5 w-5" strokeWidth={2.5} />
    </Button>
  );
}
