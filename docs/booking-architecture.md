# Future same-domain booking

## Entry points prepared now

The site remains static Astro on Netlify. No booking route or API is implemented.
`navigation.cta_primary` in `src/data/site.json` owns the main label and URL.
`RentalActions.astro` uses that configuration for service-page and area-hub quote/call
buttons. Its optional `intent` retains `?type=event` or `?type=long-term`, which the
existing quote form already recognizes. Header, homepage hero and county CTA blocks use the same primary configuration.
`RentalPaths.astro` keeps event and construction guidance discoverable from the homepage,
services hub and service-area hub, independently of any future booking JavaScript.

At launch, set the primary destination to `/book/` and label to “Check Price & Availability”
only when a usable flow exists. Keep
explicit quote forms, footer quote links and QuoteSection's call/text actions as
human-assisted alternatives. Quote links should retain quote wording and `/get-a-quote/` URLs.
QuoteSection accepts event, construction/long-term and servicing inquiries in one form;
avoid adding competing links to another quote form beside it.
Review nearby CTA headings and body copy when switching their destination.
Do not blindly relabel form submission buttons as booking actions.

## Proposed request boundary

Browser at sitandgit.com/book/
→ same-origin Netlify server function (or equivalent protected server layer)
→ narrowly scoped Honeywagon public pricing, availability and booking endpoints
→ Honeywagon as system of record.

Honeywagon alone calculates prices and authoritative availability. Normal in-territory
orders should be bookable without human approval. Quote/contact paths handle exceptions
and customers who prefer a person. Do not implement independent pricing in Astro.

- Keep any Honeywagon credentials in server-only environment variables, never `PUBLIC_`
  variables, generated HTML, browser bundles or client storage. Privileged/admin and private
  analytics API access remain separate from public booking endpoints.
- Validate and allowlist input on the server. Restrict routes and operations, rate-limit
  requests, and return only customer-appropriate results. Avoid logging private details.
- Revalidate price and availability at booking commit, protect retries from duplicate
  bookings, and define expiration for prices/holds. A calculated price is not a reservation.
- Coordinate payment, fulfillment, error handling and confirmation semantics with the Rails
  implementation before exposing the booking CTA.

## Indexing and privacy

Keep marketing service content rendered at build time and indexable. Decide whether a
public `/book/` introduction warrants indexing when it exists. Intermediate, payment,
confirmation and customer-specific routes should be absent from the sitemap and return
`noindex` (HTML meta or `X-Robots-Tag` for server responses). Keep crawlers able to see the
noindex directive; robots.txt blocking alone does not remove URLs from search.
Noindex is not access control: private booking data must require an appropriate session
or other authorization, have suitable cache controls, and stay out of URLs and static builds.
Existing `/thank-you/` remains a quote acknowledgment, not a booking confirmation.

## Analytics at launch

Retain today's `click_to_call`, `click_to_email`, `quote_cta_click`, `form_start`, and
`generate_lead`. Add booking-specific instrumentation only once the flow exists:

| Event | Trigger |
| --- | --- |
| `booking_start` | Customer begins entering booking details |
| `price_calculated` | Valid price and availability returned for the requested rental |
| `booking_completed` | Honeywagon confirms the booking, with deduplication |

Measure abandonment as starts without completion within a defined window; page unload
alone is unreliable. Use consistent anonymous funnel/session identifiers, no names,
addresses, phone numbers, email, form values or private URL parameters in GA4. Agree on
attribution and completion deduplication with Honeywagon before counting revenue.

## Launch validation

Verify normal territory orders, unavailable dates, out-of-territory requests, expired
prices, failed payments, retries and mobile completion before switching CTAs. Check
server authorization, generated client assets for secrets, noindex/cache headers and
sitemap exclusions. Validate analytics without real customer data.

Search guidance: https://developers.google.com/search/docs/crawling-indexing/block-indexing
