# Marketing audit and implementation plan — September 15, 2026

## Audit before changes

Inspected all requested routes, shared components, content, metadata, schema, asset sizes,
Netlify forms, analytics, redirects, robots, sitemap generation and existing verification.
The live event page also matched the repository's brief event copy. No live Search Console,
Netlify account settings or Honeywagon internals were available for this audit.

Keep:
- Static Astro/Netlify architecture, design, sticky telephone/quote header, native forms,
  spam controls, conditional GA4 and existing lead tracking.
- County copy, photos and real references: Viroqua events, Richland schools/Yuba/Viola,
  Crawford's art festival, clubs and seasonal properties. These establish local relevance.
- Unique metadata, canonical trailing slashes, sitemap generation, robots access and
  thank-you noindex. Existing town indexing remains limited to Viroqua and Richland Center.
- Central trailer sentence: “Contact us for current availability.” No stale July launch
  statement was found in source; do not invent inventory availability.
- Review fetching and timestamp-based ages. Stored snapshot: 5.0, 27 reviews; freshness
  depends on production API credentials and weekly Netlify build-hook setup. Do not
  manually invent a new count. About's separate fixed five-star badge is redundant.

Justified changes:
- Event page lacks practical planning detail and makes visitors scroll to its quote CTA.
- Construction page lacks audience-specific detail and includes a discount-oriented FAQ.
- Hub flattens towns into one list instead of explaining county coverage; it repeats trailer
  availability and has empty content sections. Reedsburg is not explained as secondary.
- Services hub emphasizes equipment without direct event/construction page navigation.
- Mobile header hides navigation entirely. Inputs lack phone/autofill hints, use small text,
  and extended-form duration choices omit 1–4 weeks and rentals over a year.
- Event/construction photos exceed 1 MB. Other county/background photos are oversized.
  Map CSS loads globally even on pages without maps. Existing fixed image boxes already
  reserve space; retain them while adding optimized sources and intrinsic dimensions.
- LocalBusiness hardcodes an unsupported $90–$150 price range. Event/construction Service
  entries are missing; the unused breadcrumb component has no structured data.
- Quote URLs/labels are scattered. A shared rental-action component can keep the current
  quote flow while providing a clean future booking entry point.

## Ranked plan (recorded before code edits)

| Priority | Work | Business impact | Effort | Confidence |
| --- | --- | --- | --- | --- |
| 1 | Event planning, title/description, early quote/call CTA | High | Medium | High |
| 2 | Construction audiences, recurring service, remove discount FAQ | High | Low | High |
| 3 | Mobile navigation, input ergonomics, complete duration choices | High | Medium | High |
| 4 | County-first hub and rental-intent links | Medium | Low | High |
| 5 | Responsive/compressed images and page-scoped map CSS | Medium | Medium | High |
| 6 | Accurate Service/LocalBusiness data and visible breadcrumbs | Medium | Low | High |
| 7 | Shared rental actions and future booking architecture notes | Medium | Low | High |

No new city pages, pricing calculator, API, booking workflow or speculative rich-result
markup. Visible FAQ answers remain. Google retired FAQ rich results in May 2026:
https://developers.google.com/search/updates#may-2026
Structured data must reflect content: https://developers.google.com/search/docs/appearance/structured-data/sd-policies

## Business effects and measurement

| Work | Expected horizon | Primary metric |
| --- | --- | --- |
| Event content and intent CTAs | Weeks to months after indexing | Qualified event calls/quotes in the three primary counties |
| Construction credibility | Immediate for referred/outbound visitors; months for search | Recurring-account inquiries and closed accounts |
| Mobile controls and input improvements | Immediate after deployment | Mobile quote completion and click-to-call |
| County-first hub and rental links | Immediate navigation; weeks to months for search | Primary-county and rental-page visits leading to inquiries |
| Image delivery | Immediate after deployment | Transferred image bytes; mobile loading experience |
| Accurate schema and breadcrumbs | After recrawl | Valid rendered markup and navigation; no ranking guarantee |
| Booking entry points and architecture | At booking launch | Booking starts, completed bookings and attributable revenue |

The operating brief appeared during this work and was read before subsequent edits.
Its strategy matches this plan. Its supplied performance figures remain historical
context, not refreshed measurements or promises of increased conversions.

## Validation and results

- Existing six review/analytics tests pass.
- Production build produces 36 pages and the same 19 sitemap URLs. Local build excludes
  Google credentials to preserve the review snapshot: normal review fetch encountered a
  network/DNS restriction. Live review freshness and Netlify build-hook configuration were
  not verified. A build with credentials also remains vulnerable to a network exception
  in the existing fetch script; resilience improvement is separate follow-up work.
- Existing build, canonical and JSON-LD verifiers pass. An additional rendered-page audit
  checked all 36 canonical URLs, metadata uniqueness, internal links and local image paths.
- All county/town content objects compare equal to the original repository version.
- Headless Chrome checked 12 requested/key routes at 320, 390, 768, 1024 and 1280 pixels:
  no horizontal overflow or browser JavaScript errors. Verified mobile menu navigation,
  event/long-term preselection, telephone keyboard/autofill attributes, 16px form text,
  and valid phone-based requests with email omitted. No form was submitted.
- Product photos use responsive WebP, explicit dimensions and lazy loading. For example,
  construction's 800px variant is about 78 KB versus 1.15 MB originally; homepage hero's
  800px variant is about 40 KB versus 333 KB. These are asset sizes, not measured field
  Core Web Vitals or a claimed Lighthouse score. Hero images load eagerly with priority.
- Verified Leaflet stylesheet is absent from event/quote pages and present on map pages.
  The mobile area map initializes, loads styling and stays within the viewport.
- No new geographic routes, booking APIs or pricing logic. No deployment performed.
- Browser previews cannot validate Netlify's injected CAPTCHA or actual form delivery.
  Those require a deployment preview or production validation; existing form names,
  POST destinations and spam controls are preserved.

## Files changed by this implementation

- `src/data/site.json`: event/construction content, honest homepage value proposition,
  area-hub copy, consistent primary CTA label and more complete quote choices.
- `src/pages/services/[slug].astro`: planning sections, contextual quote/call CTAs,
  county links, breadcrumbs and responsive product imagery.
- `src/pages/service-area/index.astro`: county-first navigation, secondary Reedsburg
  coverage, rental paths, map context and removal of empty/repetitive blocks.
- `src/pages/service-area/[slug].astro`: breadcrumbs, optimized images, shared CTA label;
  county copy and existing town indexing policy preserved.
- `src/pages/index.astro`, `src/pages/services/index.astro`: event/construction paths;
  services hero optimized.
- `src/pages/about.astro`: optimized photos; removed redundant fixed five-star badge,
  retained live-data-driven review component and locally owned badge.
- `src/components/RentalActions.astro`, `RentalPaths.astro`: reusable conversion and
  rental navigation components; no booking functionality.
- `src/components/Header.astro`: native mobile menu and larger tap targets.
- `src/components/QuoteForm.astro`, `QuoteFormExtended.astro`: mobile keyboard/autofill,
  readable fields, checkbox targets/grouping and optional email with required phone.
- `src/components/SiteImage.astro`, `Hero.astro`, `CardGrid.astro`, `QuoteSection.astro`,
  `GoogleReviews.astro`: image optimization/dimensions and consistent hero CTA source.
- `src/components/Breadcrumbs.astro`: visible navigation and matching BreadcrumbList.
- `src/components/ServiceAreaMap.astro`, `src/layouts/BaseLayout.astro`: Leaflet
  CSS limited to pages containing maps; useful no-JavaScript area link.
- `src/lib/schema.ts`, `scripts/verify-jsonld.mjs`: missing event/construction Service
  types and removal of unsupported fixed pricing; validation updated accordingly.
- `src/styles/global.css`: visible keyboard focus.
- `docs/marketing-audit.md`, `docs/booking-architecture.md`, `README.md`: audit, plan,
  implementation notes and future launch boundary.

The separately appearing `.gitignore`, `AGENTS.md` and `docs/seo-operating-brief.md`
were not authored or modified by this implementation.

## Intentionally retained and deferred

Retained the core design, genuine local county references, existing canonical/sitemap/
robots strategy, Netlify quote workflow, review pipeline and current analytics. No thin
city pages or unconfirmed trailer claims were added. Numerical unit recommendations
require business-approved guidance; the page now explains which event details determine
quantities without inventing a universal formula or accessibility compliance guarantee.

Defer public booking CTAs, API endpoints, server secrets, availability calculations,
booking-state indexing rules and booking funnel events until the flow is implemented and
validated. See [booking architecture](booking-architecture.md). Measure qualified calls,
quotes, recurring accounts and completed bookings; broad impressions are not the goal.
