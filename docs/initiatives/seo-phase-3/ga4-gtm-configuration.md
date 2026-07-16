# GA4 and GTM Configuration

## Source of Truth

Runtime event names and allowed parameter values are defined in:

- `src/config/tracking-contract.mjs`
- `src/config/tracking.ts`
- `src/lib/analytics.ts`

GTM must consume the data-layer payload without renaming the repository event names.

## Common Event Parameters

| Parameter | Requirement | Example |
|---|---|---|
| `page_path` | Required; added automatically from `window.location.pathname` | `/en/menu` |
| `page_language` | Required | `en`, `vi` |
| `location` | Required component/CTA placement | `header`, `menu_preview`, `booking_section` |
| `cta_type` | Required standardized interaction type | `booking`, `directions`, `menu_category` |

Event-specific parameters include:

- `menu_category` for `menu_category_click` and `menu_item_click`.
- `menu_item_id` for `menu_item_click`.
- `target_language` for `language_switch`.
- `outbound_platform` for directions, messaging, review, and social outbound events.
- `handoff_channel=email` for `booking_success`.

The successful response `emailId` is used only as an in-browser dedupe key. It must never be mapped to a GTM variable or sent to GA4.

## Standard Outbound Values

Use only these values:

- `google_maps`
- `facebook`
- `instagram`
- `tripadvisor`
- `tiktok`
- `whatsapp`
- `zalo`

`TrackedLink` infers these values from approved hostnames. Direct CTA implementations must use the matching constants from `src/config/tracking.ts`.

## GTM Setup

1. Create Data Layer Variables for:
   - `page_path`
   - `page_language`
   - `location`
   - `cta_type`
   - `menu_category`
   - `menu_item_id`
   - `outbound_platform`
   - `target_language`
   - `handoff_channel`
2. Create one Custom Event trigger for each stable event name, or one controlled regex trigger that covers only the registered event catalog.
3. Create GA4 Event tags that preserve the data-layer event name and forward only approved parameters.
4. Do not forward fields containing names, email addresses, phone numbers, contact values, notes, OTP values, `email_id`, or `booking_id`.
5. Publish only after the verification sequence in `funnel-verification.md` passes in GTM Preview and GA4 DebugView.

## GA4 Configuration

Mark these events as key events:

- Primary: `booking_success`
- Secondary: `click_call`, `click_get_directions`, `click_whatsapp`

Do not mark funnel and engagement events as key events by default.

Register event-scoped custom dimensions for:

- `page_language`
- `location`
- `cta_type`
- `menu_category`
- `outbound_platform`

Use GA4's landing-page and page-path dimensions together with the event `page_path` parameter during validation. Keep the parameter name stable so GTM Preview, BigQuery exports, and debugging remain comparable.

## External Owner Checklist

The following items require an authorized analytics owner and are not completed in code:

- Confirm GA4 property and web stream.
- Confirm GTM container and publish permissions.
- Register custom dimensions.
- Mark approved key events.
- Link Search Console to GA4.
- Record configuration date, owner, and change ticket.
