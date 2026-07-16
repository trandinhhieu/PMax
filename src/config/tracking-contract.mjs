export const trackingEvents = Object.freeze({
  clickGetDirections: "click_get_directions",
  clickCall: "click_call",
  clickWhatsapp: "click_whatsapp",
  clickZalo: "click_zalo",
  clickFacebookMessage: "click_facebook_message",
  viewMenu: "view_menu",
  bookingStart: "booking_start",
  bookingSubmit: "booking_submit",
  bookingSuccess: "booking_success",
  copyAddress: "copy_address",
  menuItemClick: "menu_item_click",
  languageSwitch: "language_switch",
  menuCategoryClick: "menu_category_click",
  galleryView: "gallery_view",
  reviewClick: "review_click",
  socialClick: "social_click",
  scroll75: "scroll_75",
  contactPanelOpen: "contact_panel_open",
});

export const requiredTrackingEventNames = Object.freeze([
  "click_get_directions",
  "click_call",
  "click_whatsapp",
  "click_zalo",
  "click_facebook_message",
  "view_menu",
  "booking_start",
  "booking_submit",
  "booking_success",
  "copy_address",
  "menu_item_click",
  "language_switch",
  "menu_category_click",
  "gallery_view",
  "review_click",
  "social_click",
  "scroll_75",
  "contact_panel_open",
]);

export const trackingCtaTypes = Object.freeze({
  directions: "directions",
  call: "call",
  whatsapp: "whatsapp",
  zalo: "zalo",
  facebookMessage: "facebook_message",
  menu: "menu",
  booking: "booking",
  copyAddress: "copy_address",
  menuItem: "menu_item",
  language: "language",
  menuCategory: "menu_category",
  gallery: "gallery",
  review: "review",
  social: "social",
  scroll: "scroll",
  contactPanel: "contact_panel",
});

export const outboundPlatforms = Object.freeze({
  googleMaps: "google_maps",
  facebook: "facebook",
  instagram: "instagram",
  tripadvisor: "tripadvisor",
  tiktok: "tiktok",
  whatsapp: "whatsapp",
  zalo: "zalo",
});

export const commonTrackingParameterNames = Object.freeze([
  "page_path",
  "page_language",
  "location",
  "cta_type",
]);

export const eventParameterRequirements = Object.freeze({
  click_get_directions: Object.freeze(["outbound_platform"]),
  click_call: Object.freeze([]),
  click_whatsapp: Object.freeze(["outbound_platform"]),
  click_zalo: Object.freeze(["outbound_platform"]),
  click_facebook_message: Object.freeze(["outbound_platform"]),
  view_menu: Object.freeze([]),
  booking_start: Object.freeze([]),
  booking_submit: Object.freeze([]),
  booking_success: Object.freeze([]),
  copy_address: Object.freeze([]),
  menu_item_click: Object.freeze(["menu_category", "menu_item_id"]),
  language_switch: Object.freeze(["target_language"]),
  menu_category_click: Object.freeze(["menu_category"]),
  gallery_view: Object.freeze([]),
  review_click: Object.freeze(["outbound_platform"]),
  social_click: Object.freeze(["outbound_platform"]),
  scroll_75: Object.freeze([]),
  contact_panel_open: Object.freeze([]),
});

export const ga4KeyEvents = Object.freeze([
  trackingEvents.bookingSuccess,
  trackingEvents.clickCall,
  trackingEvents.clickGetDirections,
  trackingEvents.clickWhatsapp,
]);

export const ga4FunnelSteps = Object.freeze([
  Object.freeze({ id: "landing", eventNames: Object.freeze([]), source: "session_start" }),
  Object.freeze({
    id: "menu_or_booking_start",
    eventNames: Object.freeze([trackingEvents.viewMenu, trackingEvents.bookingStart]),
    source: "event",
  }),
  Object.freeze({ id: "booking_submit", eventNames: Object.freeze([trackingEvents.bookingSubmit]), source: "event" }),
  Object.freeze({ id: "booking_success", eventNames: Object.freeze([trackingEvents.bookingSuccess]), source: "event" }),
]);

export const forbiddenTrackingParameterNames = Object.freeze([
  "name",
  "email",
  "phone",
  "contact",
  "note",
  "otp",
  "otp_code",
  "otpCode",
  "email_id",
  "emailId",
  "booking_id",
  "bookingId",
]);

const eventNamePattern = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;

function hasValue(params, parameterName) {
  const value = params[parameterName];
  return value !== undefined && value !== null && value !== "";
}

export function validateTrackingPayload(eventName, params = {}) {
  const errors = [];
  const eventNames = Object.values(trackingEvents);

  if (!eventNames.includes(eventName)) {
    return [`Unknown tracking event: ${eventName}.`];
  }

  const requiredParameters = [
    ...commonTrackingParameterNames,
    ...(eventParameterRequirements[eventName] ?? []),
  ];

  for (const parameterName of requiredParameters) {
    if (!hasValue(params, parameterName)) {
      errors.push(`Event ${eventName} is missing required parameter: ${parameterName}.`);
    }
  }

  if (hasValue(params, "page_path") && !String(params.page_path).startsWith("/")) {
    errors.push(`Event ${eventName} must use an absolute page_path.`);
  }

  if (hasValue(params, "page_language") && !["en", "vi"].includes(params.page_language)) {
    errors.push(`Event ${eventName} has an invalid page_language.`);
  }

  if (hasValue(params, "cta_type") && !Object.values(trackingCtaTypes).includes(params.cta_type)) {
    errors.push(`Event ${eventName} has an invalid cta_type.`);
  }

  if (hasValue(params, "outbound_platform") && !Object.values(outboundPlatforms).includes(params.outbound_platform)) {
    errors.push(`Event ${eventName} has an invalid outbound_platform.`);
  }

  for (const parameterName of forbiddenTrackingParameterNames) {
    if (hasValue(params, parameterName)) {
      errors.push(`Event ${eventName} must not include sensitive parameter: ${parameterName}.`);
    }
  }

  return errors;
}

export function validateTrackingContract(
  eventMap = trackingEvents,
  requiredEventNames = requiredTrackingEventNames,
) {
  const errors = [];
  const entries = Object.entries(eventMap);
  const eventNames = entries.map(([, eventName]) => eventName);
  const eventNameCounts = new Map();

  for (const [key, eventName] of entries) {
    if (typeof eventName !== "string" || !eventNamePattern.test(eventName)) {
      errors.push(`Event ${key} must use lower snake_case.`);
      continue;
    }

    eventNameCounts.set(eventName, (eventNameCounts.get(eventName) ?? 0) + 1);
  }

  for (const eventName of requiredEventNames) {
    if (!eventNames.includes(eventName)) {
      errors.push(`Missing required tracking event: ${eventName}.`);
    }

    if (!Object.hasOwn(eventParameterRequirements, eventName)) {
      errors.push(`Missing parameter requirements for tracking event: ${eventName}.`);
    }
  }

  for (const eventName of eventNames) {
    if (!requiredEventNames.includes(eventName)) {
      errors.push(`Unregistered tracking event: ${eventName}.`);
    }
  }

  for (const configuredEventName of Object.keys(eventParameterRequirements)) {
    if (!requiredEventNames.includes(configuredEventName)) {
      errors.push(`Parameter requirements reference unknown event: ${configuredEventName}.`);
    }
  }

  for (const [eventName, count] of eventNameCounts) {
    if (count > 1) {
      errors.push(`Duplicate tracking event name: ${eventName}.`);
    }
  }

  for (const eventName of ga4KeyEvents) {
    if (!requiredEventNames.includes(eventName)) {
      errors.push(`GA4 key event is not registered: ${eventName}.`);
    }
  }

  for (const step of ga4FunnelSteps) {
    for (const eventName of step.eventNames) {
      if (!requiredEventNames.includes(eventName)) {
        errors.push(`GA4 funnel step ${step.id} references unknown event: ${eventName}.`);
      }
    }
  }

  return errors;
}
