import type { Locale } from "@/types/common";
import {
  ga4FunnelSteps,
  ga4KeyEvents,
  outboundPlatforms,
  trackingCtaTypes,
  trackingEvents,
} from "./tracking-contract.mjs";

export {
  ga4FunnelSteps,
  ga4KeyEvents,
  outboundPlatforms,
  trackingCtaTypes,
  trackingEvents,
};

export type TrackingEventName = (typeof trackingEvents)[keyof typeof trackingEvents];
export type TrackingCtaType = (typeof trackingCtaTypes)[keyof typeof trackingCtaTypes];
export type OutboundPlatform = (typeof outboundPlatforms)[keyof typeof outboundPlatforms];

export type TrackingEventParams = {
  location: string;
  page_language: Locale;
  cta_type: TrackingCtaType;
  confirmed?: boolean;
  handoff_channel?: "email";
  menu_category?: string;
  menu_item_id?: string;
  outbound_platform?: OutboundPlatform;
  target_language?: Locale;
};

export type TrackingPayload = TrackingEventParams & {
  event: TrackingEventName;
  page_path: string;
};
