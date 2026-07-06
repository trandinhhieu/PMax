import type { Locale } from "@/types/common";
import type { TrackingEventName } from "@/config/tracking";

type EventParams = {
  location?: string;
  page_language?: Locale;
  [key: string]: string | number | boolean | undefined;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(event: TrackingEventName, params: EventParams = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...params,
  });
}
