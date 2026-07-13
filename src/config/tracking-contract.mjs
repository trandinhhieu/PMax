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

const eventNamePattern = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;

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
  }

  for (const eventName of eventNames) {
    if (!requiredEventNames.includes(eventName)) {
      errors.push(`Unregistered tracking event: ${eventName}.`);
    }
  }

  for (const [eventName, count] of eventNameCounts) {
    if (count > 1) {
      errors.push(`Duplicate tracking event name: ${eventName}.`);
    }
  }

  return errors;
}
