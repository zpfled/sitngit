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
- Quote form labels, placeholders, and Turnstile site key
- Google reviews layout title
- Quote section background image via `pages.quote.background_image`

## Components
- Layout shell: `src/layouts/BaseLayout.astro`
- Shared UI: `src/components/*`
- Routes: `src/pages/*`

## Lead form (quote requests)
- Form route: `/get-a-quote`
- Netlify Forms handles email notifications
- Spam protection: Netlify honeypot
- Optional Turnstile captcha: set `pages.quote.form.turnstile_site_key` in `src/data/site.json`
  (requires a Cloudflare Turnstile site key)

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
- Enable Netlify Forms notifications for the `quote` form

## Trailer availability
`src/data/site.json` owns the shared `trailer_availability` sentence. Availability-bearing
copy uses `{{trailer_availability}}`, resolved by `src/data/site.ts` for the relevant pages
and cards. Keep availability neutral unless confirmed by the business.

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
2. In GA4 **Admin → Data streams → your web stream → Enhanced measurement settings**,
   disable **Form interactions** if enabled, so automatic `form_start` events do not
   duplicate the site's explicit once-per-page event.
3. Open **Reports → Realtime**, visit the site, click telephone/email/quote links,
   and interact with a quote field. For DebugView, connect the site through Google
   Tag Assistant and open **Admin → DebugView**.
4. Submit a real test quote only when ready to create a Netlify form submission.
   On the successful `/thank-you/` redirect, check `generate_lead`. Refresh the page
   and visit it directly: neither should add another lead. Mark `generate_lead` as
   a key event in GA4 if desired.

Events: `click_to_call`, `click_to_email`, `quote_cta_click`, `form_start`, and
`generate_lead`. No form field values are sent. A submission flag lasts ten minutes
in session storage and is consumed on the thank-you page; blocked storage or analytics
never blocks submission. This measures the redirect following a submission, not a
server-side verification of Netlify acceptance.
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
