# Baseline Status

## Current Status

**BLOCKED - external property access has not been provided or verified in the repository.**

As of 2026-07-20, no production values are recorded for GA4, GTM, Search Console, Google Business Profile, Bing Webmaster Tools, index coverage, Core Web Vitals, rankings, or conversion totals. This file intentionally does not fabricate baseline data.

## Access Matrix

| System | Required access | Owner | Status | Evidence |
|---|---|---|---|---|
| GA4 | Viewer plus configuration owner for key events/dimensions | TBD | BLOCKED | TBD |
| GTM | Preview and publish access | TBD | BLOCKED | TBD |
| Search Console | Full user | TBD | BLOCKED | TBD |
| Google Business Profile | Performance access | TBD | BLOCKED | TBD |
| Bing Webmaster Tools | Read access | TBD | BLOCKED | TBD |

## Baseline Capture Form

Capture one fixed baseline window before or immediately after production activation, and record the exact date range.

| Metric | Baseline value | Date range | Source/export | Owner |
|---|---:|---|---|---|
| Organic impressions | TBD | TBD | Search Console | TBD |
| Organic clicks | TBD | TBD | Search Console | TBD |
| Organic CTR | TBD | TBD | Search Console | TBD |
| Branded impressions/clicks | TBD | TBD | Search Console | TBD |
| Non-branded impressions/clicks | TBD | TBD | Search Console | TBD |
| Organic landing sessions | TBD | TBD | GA4 | TBD |
| Organic `booking_success` | TBD | TBD | GA4 | TBD |
| Organic `click_call` | TBD | TBD | GA4 | TBD |
| Organic `click_get_directions` | TBD | TBD | GA4 | TBD |
| Organic `click_whatsapp` | TBD | TBD | GA4 | TBD |
| GBP-tagged sessions | TBD | TBD | GA4 | TBD |
| Indexed/excluded URLs | TBD | TBD | Search Console | TBD |
| CWV URL groups | TBD | TBD | Search Console | TBD |

## Repository Readiness Evidence

- Event catalog and GA4 funnel configuration are machine-validated.
- Landing-page, language, CTA location, menu category, and outbound platform parameters are standardized.
- `booking_success` deduplication is covered by unit and browser tests.
- The SEO guardrail runs in local and production build pipelines.
- The weekly dashboard template is ready for values once access is granted.

## Unblock Procedure

1. Assign named owners for each external system.
2. Verify production domain, GA4 stream, and GTM container.
3. Complete the GTM/GA4 configuration runbook.
4. Complete DebugView and Realtime verification.
5. Capture and lock the baseline date range and exports.
6. Change this status only when evidence locations and owners are recorded.
