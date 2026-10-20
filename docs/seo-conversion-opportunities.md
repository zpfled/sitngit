# Sit & Git SEO and conversion opportunities

Prepared for Zach on **2026-10-16**, alongside the instant-pricing rollout. The next
useful investments are measuring confirmed bookings and giving event buyers more
concrete local proof. Preserve the existing county pages, rental guides, and clear
service-area boundaries; a larger set of location pages is not justified by this review.

These are follow-up opportunities, separate from the implemented booking handoff.
Priority reflects expected business value for Vernon, Richland, and Crawford Counties,
with event rentals first and recurring construction accounts second. Ratings are
judgments based on the repository and the supplied business strategy, not measured
ranking gains. The September scorecard remains dated baseline evidence; this review
does not establish current Search Console rankings or a conversion trend.

## Recommended priorities

| Priority and action | Business impact | Effort | Confidence | Expected horizon | Primary metric |
| --- | --- | --- | --- | --- | --- |
| 1. Verify the complete Honeywagon booking funnel and attribution | High | Medium | High for measurement value | Immediate setup; weeks for a useful cohort | Confirmed bookings and booked revenue by source and rental type |
| 2. Add verified local event examples and practical unit-selection guidance to the existing event page | High | Medium | Medium | Weeks for buyer usefulness; months for organic evaluation | Qualified event inquiries and confirmed event bookings |
| 3. Replace the social preview placeholder with real branded equipment imagery | Medium | Low | High for removing the placeholder; medium for conversion benefit | Immediate | Qualified visits and inquiries from shared links |

## Measure confirmed bookings across the handoff

The marketing site now records `pricing_cta_click` with page and placement. Its code
cannot establish whether Honeywagon later confirms a booking. The public application
has a separate price/details sequence, and some requests can remain pending.

Verify that Honeywagon records starts, successful calculations, and deduplicated
confirmed orders, including orders confirmed later by the owner. Preserve anonymous
attribution from the marketing visit through the subdomain handoff. If both applications
use GA4, verify their actual tags and cookie configuration before deciding whether any
cross-domain configuration is necessary; using a subdomain alone does not prove a
tracking break. Google's [cross-domain measurement guidance](https://support.google.com/analytics/answer/10071811)
explains shared measurement and verification requirements.

Report event and recurring demand separately and distinguish the three core counties
from secondary/out-of-territory requests using operational data. Never send customer
names, delivery addresses, emails, or phone numbers to GA4. Use a defined start cohort,
confirmation window, and deduplication rule. Record the actual deployment date and
measurement boundaries in the [scorecard](seo-performance-scorecard.md); a pricing
click is not a booking or revenue. This work makes conversion improvements measurable
but does not itself improve Google rankings.

## Make the event page more useful before customers choose quantities

The event page already covers weddings, festivals, sports, access, timing, accessibility,
and handwashing. Its quantity guidance explains the factors but still sends customers
to the team for a recommendation. The new booking flow asks customers to select units,
so this is a useful point to reduce uncertainty.

Add two or three owner-verified examples to the existing page: event type, approximate
peak attendance, duration, restroom/handwash arrangement, and why that arrangement
worked. Use photographs from actual jobs with permission for any identifiable people
or named customers. Present these as examples rather than universal sizing promises.
Keep pricing and availability calculations in Honeywagon, and retain a visible call/text
path for unusual circumstances.

The county pages already name local events and describe delivery access. Connect an
example to those existing pages only where the relationship is real; do not invent
customers or create thin pages for every venue. This proposal follows Google's emphasis
on [original information and firsthand expertise](https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
It is a conversion/content hypothesis, not a promise of a ranking increase.

## Replace the social preview placeholder

`src/layouts/BaseLayout.astro` points every page to `public/images/og-default.svg`.
That file visibly says “Replace this placeholder with a custom OG image.” Customers
sharing a rental page should see finished Sit & Git branding and real equipment.

Create a 1200×630 JPG or PNG from an existing approved photograph, with the company
name and a short rental message. Test the rendered preview for event, construction,
and homepage links in the sharing channels customers use. This is a presentation and
conversion improvement; it is not a claimed direct Google ranking factor. The rollout
updates text previews but leaves this separate image replacement for follow-up.

## Two trust details to verify

The About page advertises servicing “personal portable restrooms and campers,” while
the service catalog describes servicing privately owned portable toilets. Confirm
whether camper servicing is actually offered before changing or expanding that claim.
The public privacy page also begins with template-review instructions. Review its
published wording against actual marketing and booking practices so visitors see a
finished explanation. These observations concern accuracy and trust; they are not a
legal compliance assessment.

## What to preserve

The existing event and construction guides already contain substantive planning
content. County pages have local examples and internal service links. The rollout
preserves all 35 routes, the 18 canonical sitemap entries, the existing town indexing
policy, and valid business/service structured data. Continue the review-request process
and verify that scheduled review refreshes run successfully before treating stored review
counts as current. No evidence from this implementation warrants a site rebuild,
broad statewide keyword expansion, or invented price/rating markup.
