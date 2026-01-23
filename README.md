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
All site copy lives in `src/content/site.json`.
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
- Optional Turnstile captcha: set `pages.quote.form.turnstile_site_key` in `src/content/site.json`
  (requires a Cloudflare Turnstile site key)

## Google reviews (build-time fetch)
Static reviews are stored in `src/content/google-reviews.json` and refreshed during `npm run build`.
Set these environment variables for the fetch script:
- `GOOGLE_PLACES_API_KEY`
- `GOOGLE_PLACE_ID`

## SEO
- Per-page titles and descriptions are set in layouts
- OpenGraph tags included
- Sitemap is generated via `@astrojs/sitemap`
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
