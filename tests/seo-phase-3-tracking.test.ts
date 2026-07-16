import { expect, test } from "@playwright/test";
import {
  commonTrackingParameterNames,
  eventParameterRequirements,
  ga4FunnelSteps,
  ga4KeyEvents,
  trackingCtaTypes,
  trackingEvents,
  validateTrackingContract,
  validateTrackingPayload,
} from "../src/config/tracking-contract.mjs";
import {
  outboundPlatforms,
  type TrackingEventParams,
} from "../src/config/tracking";
import { inferOutboundPlatform, trackEvent, trackEventOnce } from "../src/lib/analytics";

const originalWindow = globalThis.window;

function setTestWindow(pathname = "/en") {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    writable: true,
    value: { location: { pathname } },
  });
}

test.afterEach(() => {
  if (originalWindow) {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      writable: true,
      value: originalWindow,
    });
  } else {
    delete (globalThis as { window?: Window }).window;
  }
});

test("defines the Phase 3 event parameters, key events, and ordered funnel", () => {
  expect(validateTrackingContract()).toEqual([]);
  expect(commonTrackingParameterNames).toEqual(["page_path", "page_language", "location", "cta_type"]);
  expect(Object.keys(eventParameterRequirements)).toEqual(Object.values(trackingEvents));
  expect(ga4KeyEvents).toEqual([
    "booking_success",
    "click_call",
    "click_get_directions",
    "click_whatsapp",
  ]);
  expect(ga4FunnelSteps.map((step) => step.id)).toEqual([
    "landing",
    "menu_or_booking_start",
    "booking_submit",
    "booking_success",
  ]);
});

test("validates menu dimensions and rejects browser booking identifiers", () => {
  expect(validateTrackingPayload(trackingEvents.menuCategoryClick, {
    cta_type: trackingCtaTypes.menuCategory,
    location: "menu_catalog",
    menu_category: "pizza",
    page_language: "en",
    page_path: "/en/menu",
  })).toEqual([]);

  expect(validateTrackingPayload(trackingEvents.bookingSuccess, {
    cta_type: trackingCtaTypes.booking,
    emailId: "email_123",
    location: "booking_section",
    page_language: "en",
    page_path: "/en",
  })).toContain("Event booking_success must not include sensitive parameter: emailId.");
});

test("adds page attribution and deduplicates booking success without leaking the key", () => {
  setTestWindow("/vi/menu");
  const params: TrackingEventParams = {
    cta_type: trackingCtaTypes.booking,
    handoff_channel: "email",
    location: "booking_section",
    page_language: "vi",
  };

  expect(trackEventOnce(trackingEvents.bookingSuccess, "email_phase_3", params)).toBe(true);
  expect(trackEventOnce(trackingEvents.bookingSuccess, "email_phase_3", params)).toBe(false);
  expect(window.dataLayer).toEqual([{
    cta_type: "booking",
    event: "booking_success",
    handoff_channel: "email",
    location: "booking_section",
    page_language: "vi",
    page_path: "/vi/menu",
  }]);
});

test("infers every standardized outbound platform", () => {
  expect(inferOutboundPlatform("https://maps.app.goo.gl/example")).toBe(outboundPlatforms.googleMaps);
  expect(inferOutboundPlatform("https://www.facebook.com/hermanosdanang/")).toBe(outboundPlatforms.facebook);
  expect(inferOutboundPlatform("https://www.instagram.com/hermanospizzadanang/")).toBe(outboundPlatforms.instagram);
  expect(inferOutboundPlatform("https://www.tripadvisor.com/Restaurant_Review-example")).toBe(outboundPlatforms.tripadvisor);
  expect(inferOutboundPlatform("https://www.tiktok.com/@pizzalocui.danang")).toBe(outboundPlatforms.tiktok);
  expect(inferOutboundPlatform("https://wa.me/84905906842")).toBe(outboundPlatforms.whatsapp);
  expect(inferOutboundPlatform("https://zalo.me/84905906842")).toBe(outboundPlatforms.zalo);
  expect(inferOutboundPlatform("https://www.google.com/search?q=hermanos")).toBeUndefined();
});

test("trackEvent adds the current page path", () => {
  setTestWindow("/en/menu");

  trackEvent(trackingEvents.viewMenu, {
    cta_type: trackingCtaTypes.menu,
    location: "menu_preview",
    page_language: "en",
  });

  expect(window.dataLayer?.[0]).toEqual(expect.objectContaining({
    event: "view_menu",
    page_path: "/en/menu",
  }));
});
