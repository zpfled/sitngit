# Instant pricing rollout

Prepared **2026-10-16**. The marketing-site changes are ready for review in this
working tree; they have not been committed, pushed, or deployed to production.
All rental pricing buttons link directly to `https://quotes.sitandgit.com/` in the
same tab. No booking or invoice was created during verification.

## Changes

- **Shared navigation and CTAs:** desktop/mobile header, homepage hero, footer,
  About page, service pages, service-area hub, and all county/town pages now use
  “Get Instant Pricing.” The destination lives in `navigation.cta_primary`.
- **Form replacements:** a reusable pricing panel explains address/units/dates →
  price → booking details. It replaces the homepage form and shared forms on the
  services hub, service-area hub, FAQ page, `/get-a-quote/`, and `/contact/`.
  Retired form components, CAPTCHA, validation/prefill script, Netlify submission
  attributes, and form-only analytics were removed. Historical records were not edited.
- **Copy and assistance:** homepage announcement, event/recurring explanations,
  booking FAQs, metadata, and location CTA text reflect the new flow. Pricing appears
  before contact details; displayed prices exclude applicable tax; some requests
  need confirmation; no payment is required to reserve. Service-only page actions
  call/text the team, and contact options remain visible.
- **SEO:** all existing routes and canonical URLs remain. `/get-a-quote/` is an
  indexable explanation page. Its educational links are separate from direct pricing
  buttons. Existing local content, business/service schema, town indexing policy,
  and the 18-entry sitemap are retained.
- **Measurement and accessibility:** pricing clicks include page and placement,
  with optional event/long-term intent. They never emit a booking-completion event.
  Contrast was improved in the call strip, default links, and review captions.
  Pricing buttons have visible focus and at least 44px height.
- **Documentation:** README, booking architecture, and the operating brief now
  describe the direct handoff. Historical scorecard measurements remain unchanged.

## Desktop and mobile previews

Screenshots are from the final local production build, with analytics disabled.
Desktop width is 1440px; mobile width is 390px.

| View | Desktop | Mobile |
| --- | --- | --- |
| Homepage hero | [Desktop hero](screenshots/instant-pricing/home-1440.jpg) | [Mobile hero](screenshots/instant-pricing/home-390.jpg) |
| Homepage pricing section | [Desktop pricing section](screenshots/instant-pricing/pricing-section-1440.jpg) | [Mobile pricing section](screenshots/instant-pricing/pricing-section-390.jpg) |
| Pricing explanation page | [Desktop pricing page](screenshots/instant-pricing/get-a-quote-1440.jpg) | [Mobile pricing page](screenshots/instant-pricing/get-a-quote-390.jpg) |
| Contact page | [Desktop contact page](screenshots/instant-pricing/contact-1440.jpg) | [Mobile contact page](screenshots/instant-pricing/contact-390.jpg) |

## Validation

| Check | Result |
| --- | --- |
| `node --test tests/site.test.mjs` | 5 tests passed, including event payload privacy, old-event retirement, and nonblocking navigation. |
| `npm run build` | Passed; 35 static pages generated. |
| `node scripts/verify-site-build.mjs` | Passed across all 35 pages: pricing destinations, no retired forms, internal links/anchors, canonical/social URLs, sitemap and town indexing policy. |
| `node scripts/verify-canonical.mjs` | Passed for the 8 pages covered by the existing script; the expanded build verifier also checks all 35 pages. |
| `node scripts/verify-jsonld.mjs` | Passed. |
| Analytics build gating | Valid temporary ID, absent ID, and invalid ID all produced the expected enabled/disabled output. Final build has analytics disabled. |
| Built analytics behavior | Event-page pricing click produced `pricing_cta_click` with originating page, `service-top` placement, event intent, and query-free URL; native navigation continued. External analytics requests were blocked during the test. |
| Layout and touch targets | Homepage, pricing, contact, event, servicing, and Vernon County pages checked at 1440, 390, and 320px: no horizontal overflow; visible pricing CTAs at least 44px tall. |
| Automated accessibility | Axe WCAG 2 A/AA and 2.1 AA scans on those six pages at desktop and mobile widths: no violations detected. This does not substitute for a complete accessibility audit. |
| Keyboard and no-JavaScript handoff | Pricing link receives a visible 3px focus outline; Enter navigates in the same tab with JavaScript disabled. |
| Public destination | HTTPS redirects to `/book/sit-and-git`, HTTP 200, no login. Public initial form contains address/units/dates and event/recurring choices, with no contact-details fields. Booking-only noindex and iframe protections remain intact. |
| `git diff --check` | Passed. |

No lint command is configured in this repository. The build reports an existing
outdated Browserslist data warning; dependency updates are separate from this rollout.
The first normal build successfully fetched reviews, but that unrelated data refresh
was excluded from the final diff. Subsequent builds retained the committed review
snapshot. Displayed review totals in these previews are not asserted to be current.

No production pricing calculation or later booking step was submitted. Payment,
tax, and confirmation promises follow the owner's supplied application contract.

## Remaining rollout steps

1. Deploy the reviewed changes through the existing Netlify setup. Recheck the public
   pricing destination, a desktop/mobile CTA, and `/get-a-quote/` on production.
   No domain or DNS blocker was found on 2026-10-16.
2. Verify the production `PUBLIC_GA_MEASUREMENT_ID` and inspect the new events in
   GA4 DebugView. Register `cta_placement` and `rental_intent` custom dimensions if
   desired. Production GA4 account settings were not inspected or changed.
3. Confirm Honeywagon's completed-booking instrumentation and anonymous attribution
   before reporting booking conversion or revenue. Keep pricing clicks distinct from
   starts, pending requests, and confirmed bookings. See [booking architecture](booking-architecture.md).
4. Preserve historical Netlify form records and GA4 reports. Record the actual launch
   date and subsequent measured outcomes in the scorecard; do not overwrite its baseline.

Additional ranked recommendations are in [SEO and conversion opportunities](seo-conversion-opportunities.md).
