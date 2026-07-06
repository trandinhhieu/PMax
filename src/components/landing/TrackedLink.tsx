"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import type { Locale } from "@/types/common";
import { trackEvent } from "@/lib/analytics";
import type { TrackingEventName } from "@/config/tracking";

type TrackedLinkProps = {
  href: string;
  children: ReactNode;
  event: TrackingEventName;
  location: string;
  locale: Locale;
  className?: string;
  external?: boolean;
};

export function TrackedLink({
  href,
  children,
  event,
  location,
  locale,
  className,
  external = false,
}: TrackedLinkProps) {
  const isTodoLink = href.trim().length === 0;
  const safeHref = isTodoLink ? "#" : href;

  const handleClick = (clickEvent: MouseEvent<HTMLAnchorElement>) => {
    if (isTodoLink) {
      clickEvent.preventDefault();
    }

    trackEvent(event, {
      location,
      page_language: locale,
      confirmed: !isTodoLink,
    });
  };

  if (external || href.startsWith("tel:")) {
    return (
      <a className={className} href={safeHref} onClick={handleClick} rel="noreferrer" target={href.startsWith("http") ? "_blank" : undefined}>
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={safeHref} onClick={handleClick}>
      {children}
    </Link>
  );
}
