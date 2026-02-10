# Structured Data Audit

## Sitewide JSON-LD
- LocalBusiness (canonical) in global head
- WebSite in global head

## Service JSON-LD
Service schema is included only on the following service detail pages:
- `/services/portable-restrooms`
- `/services/ada-restrooms`
- `/services/handwashing-stations`
- `/services/toilet-servicing`

## Duplicates
- LocalBusiness: one sitewide definition with @id `https://sitandgit.com/#localbusiness`
- WebSite: one sitewide definition with @id `https://sitandgit.com/#website`
- Service: only per service page, provider references LocalBusiness @id

## Validation (Best Effort)
Run:
- `npm run build`
- `node scripts/verify-canonical.mjs`
- `node scripts/verify-jsonld.mjs`

Notes:
- Canonical and og:url are validated against dist paths.
- JSON-LD validation checks for exactly one LocalBusiness and WebSite per page, and Service only on /services/* pages.
