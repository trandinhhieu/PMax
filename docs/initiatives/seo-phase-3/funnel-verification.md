# Funnel Setup and Verification

## Approved Funnel

The repository contract defines this ordered funnel:

1. `landing`: session begins on an Organic Search landing page or a GBP-tagged URL.
2. `menu_or_booking_start`: `view_menu` or `booking_start`.
3. `booking_submit`: `booking_submit`.
4. `booking_success`: `booking_success`.

## GA4 Funnel Exploration

Recommended settings:

- Use a closed funnel so users must enter at the landing step.
- Use indirectly followed steps to allow normal page and interaction events between funnel steps.
- Keep all steps within the same session.
- Use users, not raw event count, as the primary funnel metric.
- Break down by landing page first, then `page_language` or CTA `location`.
- Add a comparison for Session default channel group = `Organic Search`.
- Add a separate comparison for Session campaign = `gbp` when GBP UTM tagging is active.

Raw event-count reports remain useful for QA, but they are not the primary funnel completion metric because a user may make multiple valid attempts.

## No-Double-Count Rule

- `booking_submit` represents an attempt and may occur more than once.
- `booking_success` represents a confirmed successful response.
- The client calls `trackEventOnce` with the successful response `emailId`.
- The key is stored only in a module-level browser set and is not included in the analytics payload.
- Repeated handling of the same successful response in the current browser runtime produces one `booking_success` event.

## Verification Procedure

1. Deploy to a production-like environment with the intended GTM container.
2. Open GTM Preview and GA4 DebugView.
3. Start from one English landing page and one Vietnamese landing page.
4. Exercise header, mobile, menu, booking, call, directions, WhatsApp, and social CTAs.
5. Confirm every event contains `page_path`, `page_language`, `location`, and `cta_type`.
6. Confirm menu interactions use `menu_category`, not `category`.
7. Confirm Google Maps, Facebook, Instagram, Tripadvisor, and TikTok use the approved `outbound_platform` values.
8. Submit one successful test booking and record its test reference outside GA4.
9. Confirm exactly one `booking_success` event and no name, email, phone, contact, note, OTP, `emailId`, or `email_id` field.
10. Confirm the approved key events appear in Realtime.
11. Recheck standard reports after 24-48 hours.

## Evidence Record

| Item | Value |
|---|---|
| Environment | TBD |
| Verification date | TBD |
| GTM owner | TBD |
| GA4 owner | TBD |
| Test booking reference stored outside analytics | TBD |
| DebugView evidence location | TBD |
| Realtime evidence location | TBD |
| Result | BLOCKED - external access and deployment required |
