# Weekly SEO Dashboard

## Reporting Window

- Update once per week on the same weekday.
- Compare the last complete 7 days with the previous 7 days.
- Also compare against the trailing 4-week median to reduce short-term noise.
- Annotate deployments, tracking changes, holidays, closures, promotions, and major review activity.

## Scorecard

| Area | Metric | Source | Current | Previous | Change | Notes |
|---|---|---|---:|---:|---:|---|
| Search demand | Organic impressions | Search Console | TBD | TBD | TBD | |
| Search demand | Organic clicks | Search Console | TBD | TBD | TBD | |
| Search demand | Organic CTR | Search Console | TBD | TBD | TBD | |
| Query mix | Branded clicks/impressions | Search Console query filter | TBD | TBD | TBD | |
| Query mix | Non-branded clicks/impressions | Search Console query filter | TBD | TBD | TBD | |
| Conversion | Organic landing-page bookings | GA4 | TBD | TBD | TBD | |
| Conversion | Organic calls | GA4 | TBD | TBD | TBD | |
| Conversion | Organic directions | GA4 | TBD | TBD | TBD | |
| Conversion | Organic WhatsApp clicks | GA4 | TBD | TBD | TBD | |
| Local | GBP website/menu/booking sessions | GA4 campaign `gbp` | TBD | TBD | TBD | |
| Local | GBP calls/directions/website actions | GBP Performance | TBD | TBD | TBD | |
| Indexing | Indexed and excluded URLs | Search Console | TBD | TBD | TBD | |
| Experience | Good/needs improvement/poor CWV URLs | Search Console | TBD | TBD | TBD | |

## Required Detail Tables

### Landing Conversion Table

Dimensions:

- Landing page
- Session default channel group
- Session source/medium/campaign
- `page_language`

Metrics:

- Sessions
- `booking_success`
- `click_call`
- `click_get_directions`
- `click_whatsapp`
- Landing conversion rate

### CTA Placement Table

Dimensions:

- Event name
- `location`
- `cta_type`
- `page_language`
- `outbound_platform` when present

Metrics:

- Users
- Event count
- Key events

### Query Classification

Maintain an approved branded regex that includes confirmed Hermanos name variants only. Store the current regex, owner, and change date with the dashboard. Classify all remaining queries as non-branded; review ambiguous restaurant or location terms manually.

## Weekly Workflow

1. Confirm there were no tracking configuration changes without an annotation.
2. Refresh Search Console, GA4, GBP, indexing, and CWV data.
3. Check landing-page conversions before interpreting traffic growth.
4. Review branded and non-branded trends separately.
5. Investigate zero or sharply changed events by `page_language` and `location`.
6. Add actions with owner and due date.
7. Archive a read-only weekly snapshot.

## Ownership

| Responsibility | Owner |
|---|---|
| Dashboard refresh | TBD |
| Search Console query classification | TBD |
| GA4/GTM data quality | TBD |
| GBP performance export | TBD |
| SEO action follow-up | TBD |
