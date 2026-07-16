import {
  outboundPlatforms,
  type OutboundPlatform,
  type TrackingEventName,
  type TrackingEventParams,
  type TrackingPayload,
} from "@/config/tracking";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const trackedEventKeys = new Set<string>();

function getPagePath() {
  const pathname = window.location?.pathname;
  return typeof pathname === "string" && pathname.startsWith("/") ? pathname : "/";
}

export function inferOutboundPlatform(href: string): OutboundPlatform | undefined {
  let hostname: string;

  try {
    hostname = new URL(href).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return undefined;
  }

  if (
    hostname === "maps.app.goo.gl" ||
    hostname === "maps.google.com" ||
    ((hostname === "google.com" || hostname.endsWith(".google.com")) && new URL(href).pathname.startsWith("/maps"))
  ) {
    return outboundPlatforms.googleMaps;
  }

  if (hostname === "facebook.com" || hostname.endsWith(".facebook.com") || hostname === "fb.me" || hostname === "m.me") {
    return outboundPlatforms.facebook;
  }

  if (hostname === "instagram.com" || hostname.endsWith(".instagram.com")) {
    return outboundPlatforms.instagram;
  }

  if (hostname === "tripadvisor.com" || hostname.endsWith(".tripadvisor.com")) {
    return outboundPlatforms.tripadvisor;
  }

  if (hostname === "tiktok.com" || hostname.endsWith(".tiktok.com")) {
    return outboundPlatforms.tiktok;
  }

  if (hostname === "wa.me" || hostname === "whatsapp.com" || hostname.endsWith(".whatsapp.com")) {
    return outboundPlatforms.whatsapp;
  }

  if (hostname === "zalo.me" || hostname.endsWith(".zalo.me") || hostname.endsWith(".zaloapp.com")) {
    return outboundPlatforms.zalo;
  }

  return undefined;
}

export function trackEvent(event: TrackingEventName, params: TrackingEventParams) {
  if (typeof window === "undefined") return;

  const payload: TrackingPayload = {
    ...params,
    event,
    page_path: getPagePath(),
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function trackEventOnce(
  event: TrackingEventName,
  dedupeKey: string,
  params: TrackingEventParams,
) {
  if (typeof window === "undefined") return false;

  const eventKey = `${event}:${dedupeKey}`;
  if (trackedEventKeys.has(eventKey)) return false;

  trackedEventKeys.add(eventKey);
  trackEvent(event, params);
  return true;
}
