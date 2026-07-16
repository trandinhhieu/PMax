"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import type { Locale } from "@/types/common";
import { inferOutboundPlatform, trackEvent } from "@/lib/analytics";
import type { TrackingCtaType, TrackingEventName } from "@/config/tracking";

type TrackedLinkProps = {
  href: string;
  children: ReactNode;
  ctaType: TrackingCtaType;
  event: TrackingEventName;
  location: string;
  locale: Locale;
  className?: string;
  external?: boolean;
};

export function TrackedLink({
  href,
  children,
  ctaType,
  event,
  location,
  locale,
  className,
  external = false,
}: TrackedLinkProps) {
  const isTodoLink = href.trim().length === 0;
  const safeHref = isTodoLink ? "#" : href;
  const isHttpLink = /^https?:\/\//i.test(href);
  const isPhoneLink = href.startsWith("tel:");
  const shouldUseAnchor = external || isHttpLink || isPhoneLink;
  const outboundPlatform = inferOutboundPlatform(href);

  const handleClick = (clickEvent: MouseEvent<HTMLAnchorElement>) => {
    if (isTodoLink) {
      clickEvent.preventDefault();
    }

    trackEvent(event, {
      cta_type: ctaType,
      location,
      ...(outboundPlatform ? { outbound_platform: outboundPlatform } : {}),
      page_language: locale,
      confirmed: !isTodoLink,
    });
  };

  if (shouldUseAnchor) {
    return (
      <a className={className} href={safeHref} onClick={handleClick} rel="noreferrer" target={isHttpLink ? "_blank" : undefined}>
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
