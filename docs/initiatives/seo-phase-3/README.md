# SEO Phase 3 - Conversion Measurement and Observability

## Status

- Repository implementation: **completed on 2026-07-20**.
- GA4/GTM production configuration: **pending external access**.
- GA4, Search Console, Google Business Profile, and Bing baseline values: **pending external access**.
- Production DebugView/Realtime verification: **pending external access and deployment**.

No external analytics property, tag, dashboard, or baseline is claimed as completed by this repository change.

## Repository Deliverables

- Typed tracking contract with required `page_path`, `page_language`, `location`, and `cta_type` parameters.
- Event-specific requirements for `menu_category`, `menu_item_id`, `target_language`, and `outbound_platform`.
- Standard outbound platform values for Google Maps, Facebook, Instagram, Tripadvisor, TikTok, WhatsApp, and Zalo.
- Automatic `page_path` attribution for every client event.
- In-browser `booking_success` deduplication using the successful response `emailId` only as a local key.
- GA4 key-event and funnel definitions stored in the tracking contract.
- A build-blocking SEO guardrail and automated coverage for success and failure behavior.
- Operational configuration, verification, dashboard, and baseline templates in this directory.

## Acceptance Status

| Acceptance criterion | Repository evidence | External status |
|---|---|---|
| Attribute booking/call/direction to landing page | Every event includes `page_path`, `page_language`, and CTA `location` | Validate in GA4 after deployment |
| Avoid funnel double counting | `booking_success` uses `trackEventOnce` with the response `emailId`; tests repeat the same successful key | Confirm in GTM Preview and GA4 DebugView |
| Report language and CTA location | Required typed parameters and payload validation | Register GA4 custom dimensions |
| Maintain baseline and weekly report | Templates and workflow are documented | Baseline values remain blocked by access |

## Runbooks

- `ga4-gtm-configuration.md`: data-layer contract, GTM variables, GA4 event tags, key events, and dimensions.
- `funnel-verification.md`: funnel definition, no-double-count settings, and production verification procedure.
- `weekly-dashboard.md`: weekly scorecard layout and operating cadence.
- `baseline-status.md`: access blockers, evidence checklist, and baseline capture form.
