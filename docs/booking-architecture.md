# Instant pricing and online booking

Rollout prepared on 2026-10-16. Production deployment of these marketing-site changes
is separate. This handoff supersedes the earlier proposed `/book/` proxy/API integration.

## Marketing entry points

The marketing site remains static Astro on Netlify. `navigation.cta_primary` in
`src/data/site.json` owns the label and destination: **Get Instant Pricing** →
**https://quotes.sitandgit.com/**. `PricingLink.astro` renders ordinary same-tab anchors;
`CTABlock.astro` uses the same configuration for location pages. Navigation works
without JavaScript, cookies, storage, or analytics. Rental intent is an analytics
attribute only: no unverified booking query parameters are appended.

`InstantPricing.astro` replaces the old quote forms on the homepage, services hub,
service-area hub, FAQ page, `/get-a-quote/`, and `/contact/`. The reusable `QuoteSection`
retains its component name and offers `#quote` and `#quote-form` targets. The contact
page keeps phone, text, and email assistance; service-only page actions call/text the
team. Global header/footer pricing buttons still advertise rentals on that page.

`/get-a-quote/` stays indexable with its own canonical URL and helpful booking FAQs.
Links labeled “How online pricing works” may lead there; rental pricing buttons go
directly to the application. Existing page URLs, indexing policy, local descriptions,
and rental guide links are retained. The legacy `/thank-you/` route remains noindex;
it is not a booking confirmation and no longer emits a lead event.

## Application boundary

Browser on sitandgit.com → same-tab link to quotes.sitandgit.com → Honeywagon public
booking flow. The marketing site collects no booking inputs and contains no pricing
calculator, API credentials, iframe, proxy, or replacement form provider. Honeywagon
owns pricing, availability, rental terms, confirmation, and all booking records.

The owner-supplied contract for this rollout is:

- Pricing precedes name, email, and phone collection.
- Event and recurring rentals are supported; service-only requests need personal help.
- Displayed prices exclude applicable tax.
- Some requests need owner confirmation depending on request and availability.
- No payment is required to reserve a confirmed booking.

On 2026-10-16, HTTPS at the primary destination redirected to
`/book/sit-and-git` and returned HTTP 200 with a public rental form, no login,
`X-Robots-Tag: noindex, nofollow`, and `X-Frame-Options: SAMEORIGIN`.
A browser handoff with JavaScript disabled also succeeded. The initial form shows
address, units, dates, and event/recurring choices before contact details. No pricing
request or booking was submitted; later price/confirmation steps rely on the supplied
contract, not an end-to-end production transaction test. Recheck reachability at launch.

## Analytics at launch

The existing optional GA4 integration remains gated by `PUBLIC_GA_MEASUREMENT_ID`.
No new analytics provider is added. See [README setup](../README.md#optional-ga4-measurement).

| Event | Trigger and meaning |
| --- | --- |
| `pricing_cta_click` | Click on a marked pricing link. Includes originating `page_path`, `cta_placement`, query-free destination, and event/long-term intent when known. It is a handoff click, not a booking start or completion. |
| `click_to_call`, `click_to_text`, `click_to_email` | Click on a public business contact link, with query/body parameters excluded. |

Retired quote-form events (`quote_cta_click`, `form_start`, `generate_lead`) remain
historical measurements. Their handlers were removed with the forms. No Netlify form
records or historical GA4 data are deleted. Do not compare old quote clicks to new
pricing clicks without annotating the different destinations and launch date.

Honeywagon instrumentation is outside this repository. Before reporting the booking
funnel, verify these application events and agree on anonymous attribution and a
conversion window:

| Event | Required application meaning |
| --- | --- |
| `booking_start` | Customer starts entering booking details. |
| `price_calculated` | A successful pricing calculation; separate repeated calculations from unique flows. |
| `booking_completed` | A Honeywagon-confirmed order, deduplicated across retries and later owner confirmation. |

Do not count pending requests or price views as confirmed bookings. Never send names,
addresses, emails, phone numbers, form values, or private URL parameters to analytics.
Record measured outcomes in the [performance scorecard](seo-performance-scorecard.md)
with dates, source, attribution rules, and event/recurring and core-county segments.
