export const trackingEvents: Readonly<{
  clickGetDirections: "click_get_directions";
  clickCall: "click_call";
  clickWhatsapp: "click_whatsapp";
  clickZalo: "click_zalo";
  clickFacebookMessage: "click_facebook_message";
  viewMenu: "view_menu";
  bookingStart: "booking_start";
  bookingSubmit: "booking_submit";
  bookingSuccess: "booking_success";
  copyAddress: "copy_address";
  menuItemClick: "menu_item_click";
  languageSwitch: "language_switch";
  menuCategoryClick: "menu_category_click";
  galleryView: "gallery_view";
  reviewClick: "review_click";
  socialClick: "social_click";
  scroll75: "scroll_75";
  contactPanelOpen: "contact_panel_open";
}>;

export const requiredTrackingEventNames: readonly string[];

export const trackingCtaTypes: Readonly<{
  directions: "directions";
  call: "call";
  whatsapp: "whatsapp";
  zalo: "zalo";
  facebookMessage: "facebook_message";
  menu: "menu";
  booking: "booking";
  copyAddress: "copy_address";
  menuItem: "menu_item";
  language: "language";
  menuCategory: "menu_category";
  gallery: "gallery";
  review: "review";
  social: "social";
  scroll: "scroll";
  contactPanel: "contact_panel";
}>;

export const outboundPlatforms: Readonly<{
  googleMaps: "google_maps";
  facebook: "facebook";
  instagram: "instagram";
  tripadvisor: "tripadvisor";
  tiktok: "tiktok";
  whatsapp: "whatsapp";
  zalo: "zalo";
}>;

export const commonTrackingParameterNames: readonly string[];
export const eventParameterRequirements: Readonly<Record<string, readonly string[]>>;
export const ga4KeyEvents: readonly string[];
export const ga4FunnelSteps: readonly Readonly<{
  id: string;
  eventNames: readonly string[];
  source: "event" | "session_start";
}>[];
export const forbiddenTrackingParameterNames: readonly string[];

export function validateTrackingPayload(
  eventName: string,
  params?: Readonly<Record<string, unknown>>,
): string[];

export function validateTrackingContract(
  eventMap?: Readonly<Record<string, unknown>>,
  requiredEventNames?: readonly string[],
): string[];
