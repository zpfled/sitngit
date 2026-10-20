# Sit & Git Portables marketing site (Astro + Tailwind)

## Requirements
- Node.js 18+ (Astro 4)
- npm, pnpm, or yarn

## Quick start
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Content updates
All site copy lives in `src/data/site.json`.
- Business info, nav labels, services, service area data
- Page headings, CTAs, FAQ text
- Instant-pricing steps, confirmation notes, and booking FAQs
- Google reviews layout title
- Quote section background image via `pages.quote.background_image`

## Components
- Layout shell: `src/layouts/BaseLayout.astro`
- Shared UI: `src/components/*`
- Routes: `src/pages/*`

## Instant pricing and online booking
- Shared destination: `navigation.cta_primary` in `src/data/site.json` → `https://quotes.sitandgit.com/`
- `PricingLink.astro` renders same-tab links with CTA placement tags; `RentalActions.astro` adds call/text help and handles service-only actions.
- `InstantPricing.astro` replaces rental quote forms; `/get-a-quote/` remains an indexable explanation page.
- Honeywagon owns the booking form, pricing, availability, and terms. The marketing site collects no booking information.
- Removed Netlify form/CAPTCHA wiring is no longer needed for new requests. Preserve existing Netlify submission records; do not delete the historical `quote` form in the Netlify dashboard.
- `/thank-you/` remains available for legacy links and emits no conversion event.

## Public order activity map

`ServiceAreaMap.astro` embeds Honeywagon's complete public map on the homepage and
`/service-area/`. `order_activity_map` in `src/data/site.json` stores the exact public
URL, including its public embed token, and the delivery-boundary clarification. No order records,
map calculator, Google Maps API key, or independent map integration are stored here.
The old Leaflet script, dependency, and service-boundary GeoJSON have been removed.

The iframe reserves 560px at every width, loads lazily, and retains its descriptive
title and `strict-origin-when-cross-origin` referrer policy. Honeywagon controls the
orange activity shading, green outline, Wisconsin boundary, legend, update date,
and Google attribution. HTML outside the iframe explains that shading represents
order activity rather than a guaranteed delivery boundary, and provides pricing and
“Open map” links.

On 2026-10-16 the map returned HTTP 200 and allowed framing only by
`https://sitandgit.com` and `https://www.sitandgit.com` (plus its own origin).
Localhost and unapproved Netlify previews are therefore blocked inside the iframe;
“Open map” still works as a standalone view. Before using a Netlify deploy preview,
add its exact HTTPS origin to the map's approved website origins in Honeywagon.
Do not change the embed URL or weaken the map's security policy to work around this.
The marketing repository and live homepage had no Content Security Policy to update.
If one is introduced later, allow `https://honeywagon-web.onrender.com` in `frame-src`
while preserving other protections.

The public map was checked at 1200, 390, and 288px widths with a 560px viewport:
heading, map, legend, update date, and Google attribution all fit. Recheck the real
embed on the approved production origin after deployment; no Honeywagon settings
or production deployment were changed by this integration.

## Google reviews (build-time fetch)
Static reviews are stored in `src/data/google-reviews.json` and refreshed during `npm run build`.
Set these environment variables for the fetch script:
- `GOOGLE_PLACES_API_KEY`
- `GOOGLE_PLACE_ID`

## SEO
- Per-page titles and descriptions are set in layouts
- OpenGraph tags included
- Sitemap is generated and validated by `scripts/generate-sitemap.mjs` during the build
- Update `site` in `astro.config.mjs` and the sitemap URL in `public/robots.txt`

## Images
- OG image placeholder: `public/images/og-default.svg` (replace with a 1200x630 image)
- Hero panel text notes where to swap in a custom photo (ideal 1200x900, <300KB)
- Quote section background: `public/images/quote-bg.jpg` (recommended ~2400px wide, compressed)

## Deploy
### Netlify
- Build command: `npm run build`
- Output directory: `dist`
- Add env vars in Netlify site settings
- Verify the public booking destination and contact links after deploying; retain historical Netlify form submissions.

## Service catalog

Offerings and related copy live in `src/data/site.json`. The owner confirmed on
2026-09-15 that luxury restroom trailers are not owned or offered; the demand experiment
has ended. Do not restore that offering or availability language without new confirmation.
The retired service URL redirects to event rentals through `public/_redirects`.
See [Netlify redirect rules](https://docs.netlify.com/manage/routing/redirects/overview/).

## Weekly review refresh setup
1. In Netlify, open this project's **Project configuration → Build & deploy → Continuous
   deployment → Build hooks → Add build hook**. Name it `Weekly site refresh`, select
   the production branch, and copy the generated URL. Treat this URL as a secret.
2. In GitHub `zpfled/sitngit`, open **Settings → Secrets and variables → Actions →
   New repository secret**. Name it `NETLIFY_BUILD_HOOK_URL` and paste the URL as its value.
   No Netlify personal access token is needed.
3. In Netlify **Project configuration → Environment variables**, keep
   `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` configured for production builds.
   Builds fetch Google reviews through the existing script; missing credentials retain
   the stored data. Displayed ages are recalculated from `publishTime` at build time.
4. After the workflow is on the default branch, open GitHub **Actions → Weekly site
   refresh → Run workflow**, choose the branch, then **Run workflow**. Check the workflow
   result and the resulting Netlify deploy. A successful POST means the build was
   requested; Netlify reports whether the build/deploy succeeded.

The workflow runs Mondays at 09:17 UTC and triggers a Netlify build/deploy. It fails
clearly if the secret is absent or the POST fails. Setup and execution are manual;
this implementation does not trigger a deployment.
See [Netlify build hooks](https://docs.netlify.com/build/configure-builds/build-hooks/).

## Optional GA4 measurement
1. In Netlify **Project configuration → Environment variables**, add
   `PUBLIC_GA_MEASUREMENT_ID` with your GA4 web stream's measurement ID (the `G-...`
   value), scoped to the intended build context. Rebuild when ready to enable it.
   Do not put the ID in source control. No tracking code or Google tag is emitted
   when this variable is absent or invalid.
2. In GA4, register event-scoped custom dimensions for `cta_placement` and `rental_intent` if you want them in reports. The origin is sent as `page_path`.
3. With Google Tag Assistant/DebugView, click pricing links from desktop/mobile navigation, the homepage, an event page, and the footer. Verify `pricing_cta_click` with the correct page and placement. Call/text/email links emit their own events. Do not submit a booking for this check.
4. A pricing click is not a completed booking and should not replace the confirmed-booking key event. Coordinate application-side confirmation and attribution with Honeywagon before reporting booking conversion rates.

Events: `pricing_cta_click`, `click_to_call`, `click_to_text`, and `click_to_email`.
Pricing payloads contain the page path, CTA placement, a query-free link URL, and
known rental intent only. Contact links discard subject/body parameters. Analytics
never intercepts navigation or relies on session storage. The retired quote-form
handlers no longer emit `quote_cta_click`, `form_start`, or `generate_lead`; preserve
those historical reports and annotate the actual deployment date.
See [Google's event setup guide](https://developers.google.com/analytics/devguides/collection/ga4/events).

## Targeted verification
```bash
npm ci
node --test tests/site.test.mjs
npm run build
node scripts/verify-site-build.mjs
node scripts/verify-canonical.mjs
node scripts/verify-jsonld.mjs
```
For the disabled check, leave `PUBLIC_GA_MEASUREMENT_ID` unset. To verify the enabled
output locally, supply a temporary valid-format test value through the environment,
build, then run `node scripts/verify-site-build.mjs --analytics`. Repeat with an
invalid value and run the verifier without `--analytics`. These are static checks;
they do not send events or submit forms to external services.

## Marketing content and booking

Use the [SEO operating brief](docs/seo-operating-brief.md) for strategy and the
[SEO performance scorecard](docs/seo-performance-scorecard.md) for dated measurements.
The [booking architecture](docs/booking-architecture.md) documents the direct Honeywagon
handoff and analytics boundaries. The [rollout report](docs/instant-pricing-rollout.md)
contains validation and screenshots; [SEO and conversion opportunities](docs/seo-conversion-opportunities.md)
records follow-up work identified during this rollout.

Event and construction planning sections live with their service entries in
`src/data/site.json`. `RentalPaths.astro` keeps rental guides discoverable independently
of the booking application. `SiteImage.astro` produces responsive WebP images.
