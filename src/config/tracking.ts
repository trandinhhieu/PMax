export const trackingEvents = {
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
} as const;

export type TrackingEventName = (typeof trackingEvents)[keyof typeof trackingEvents];
