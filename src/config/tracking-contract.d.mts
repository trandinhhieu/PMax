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

export function validateTrackingContract(
  eventMap?: Readonly<Record<string, unknown>>,
  requiredEventNames?: readonly string[],
): string[];
