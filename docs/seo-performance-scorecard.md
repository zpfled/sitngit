# SEO Performance Scorecard

## Purpose

This file holds time-sensitive SEO, Google Business Profile (GBP), traffic, lead,
and conversion measurements. Strategic SEO rules live in the
[SEO operating brief](seo-operating-brief.md). Use the brief for strategy and this
scorecard for dated evidence; never assume a metric remains current indefinitely.

Use exact ISO dates (`YYYY-MM-DD`) for recorded dates, observation dates and reporting
boundaries. A recording date is not a measurement date. If source dates are missing,
mark them unknown rather than inventing precision or using “last three months.”

## Current Baseline

Initial record: **2026-09-15**. “Current Baseline” means the latest supplied baseline,
not live performance. Values below were supplied by the owner in the 2026-09-15
scorecard request; no fresh exports or live verification accompanied this record.

**Date limitation:** the owner described GBP/leads as “Apr–Sep 2026,” Search Console
as a “trailing 3-month export supplied Sep 2026,” and reviews as “as of Sep 2026.”
Exact measurement days were not supplied. These labels are retained as provenance
below, not treated as exact windows. In particular, do not assume the period ends
on `2026-09-30` or turn the recording date into an export cutoff.

| Metric | Value | Measurement period / as-of date | Source | Notes |
| --- | --- | --- | --- | --- |
| Google Business Profile interactions | 248 | Start/end unknown; reported months `2026-04` through `2026-09` | Owner-supplied GBP baseline, recorded 2026-09-15 | Historical aggregate; confirm export boundaries before comparison. |
| GBP calls | 45 | Start/end unknown; reported months `2026-04` through `2026-09` | Owner-supplied GBP baseline, recorded 2026-09-15 | Keep distinct from website click-to-call events and qualified leads. |
| GBP website clicks | 203 | Start/end unknown; reported months `2026-04` through `2026-09` | Owner-supplied GBP baseline, recorded 2026-09-15 | Clicks are not unique leads. |
| Website inbound quote-form requests | Approximately 42 | Start/end unknown; reported months `2026-04` through `2026-09` | Owner-supplied web-lead tally, recorded 2026-09-15 | Attribution, deduplication and exclusions not supplied. |
| Closed web leads | Approximately 30–35 | Start/end unknown; reported months `2026-04` through `2026-09` | Owner-supplied closed-lead tally, recorded 2026-09-15 | Confirm these belong to the same cohort of approximately 42 requests. |
| Estimated web-lead close rate | Approximately 71%–83% | Start/end unknown; reported months `2026-04` through `2026-09` | Owner estimate, recorded 2026-09-15 | Approximately 30–35 divided by 42; cohort and closing cutoff unverified. |
| Search Console clicks | 64 | Exact start/end and export date unknown; 3-month export reported in `2026-09` | Owner-supplied Search Console export summary, recorded 2026-09-15 | Property, filters and exact window need confirmation. |
| Search Console impressions | 5,482 | Exact start/end and export date unknown; 3-month export reported in `2026-09` | Owner-supplied Search Console export summary, recorded 2026-09-15 | Context only; includes unqualified geographic exposure. |
| Google reviews | 27 at 5.0 stars | Exact observation date unknown; reported as of `2026-09` | Owner baseline, recorded 2026-09-15; consistent with repository review snapshot | Stored data is not proof of a live count or its observation date. |
| Online bookings | Not launched | Status reported 2026-09-15 | Owner status report, 2026-09-15 | Not applicable; do not enter zero bookings or a 0% conversion rate. |

## Primary KPIs

Prioritize qualified customers and booked revenue over exposure. Record source,
exact period and segmentation with each measurement; unknown is not zero.

| Group | Primary measures | How to use them |
| --- | --- | --- |
| Visibility | Qualified organic clicks from Vernon, Richland and Crawford Counties | Define how geography and intent are established. Label county-query or county-page traffic as a proxy; do not assume it proves a visitor's county. |
| Lead generation | GBP calls; GBP website clicks; quote-form submissions; one-time event leads; recurring-rental leads | Separate channel interactions from deduplicated inquiries. Classify rental intent and delivery county; retain unknowns. |
| Conversion | Web lead close rate; completed online bookings and booking conversion rate once launched | Close rate = won leads / qualified web leads in the same acquisition cohort, with a closing cutoff. Document exclusions; the initial approximate rate uses all reported requests and may not be comparable. |
| Revenue quality | Average booked order value; booked revenue split by event/recurring demand | Average = booked order value total / confirmed orders, using a consistent tax, fee, cancellation and refund policy. Keep recurring monthly charges separate from full-contract value. |
| Local-market strength | Google review count/rating; qualified leads and bookings by Tier 1 county | Separate Vernon, Richland and Crawford from secondary Reedsburg/Sauk coverage and out-of-territory demand. |

Secondary/context measures: impressions, CTR, average position, branded versus
non-branded query mix, and page-level organic clicks. **Raw impressions and average
position are not primary success metrics.** Keep device, query, page and channel
filters consistent when comparing them.

## Future Online Booking Metrics

Placeholder status recorded **2026-09-15: not launched / not measured** for every
row below. Add exact measurement boundaries and source references when populated.
Use the event definitions in [booking architecture](booking-architecture.md#analytics-at-launch)
and the existing [analytics documentation](../README.md#optional-ga4-measurement).

| Metric | Initial value | Definition / future source |
| --- | --- | --- |
| Booking flow starts | Not measured | Deduplicated flows beginning; `booking_start`. |
| Price/availability calculations completed | Not measured | Successful `price_calculated` results; distinguish repeated calculations from unique flows. |
| Booking completions | Not measured | Deduplicated Honeywagon-confirmed orders; `booking_completed`. |
| Booking abandonment rate | Not measured | Started flows without completion / started flows, after the recorded conversion window has elapsed. |
| Booking conversion rate | Not measured | Started flows with a confirmed booking / started flows, using the same start cohort and conversion window. Undefined when starts = 0. |
| Organic-attributed bookings | Not measured | Confirmed bookings under a documented organic attribution rule and lookback window. |
| GBP-attributed bookings | Not measured | Confirmed bookings under a documented GBP attribution rule; avoid counting them again as organic. |
| Average booked order value | Not measured | Confirmed order value total / confirmed orders, split by rental intent using the revenue policy above. |
| Core-county vs out-of-territory bookings | Not measured | Delivery-location classification in Honeywagon; retain secondary Reedsburg/Sauk and unknown categories separately. |

Record the conversion window and attribution rule before reporting rates. Existing
`generate_lead` tracks a quote thank-you redirect, not a confirmed booking. Reconcile
quote counts against accepted form records, excluding spam and duplicates. Store
aggregates and safe source references here, not customer details or credentials.

## Historical Snapshots

Append entries; never replace earlier observations or interpretations. Before updating
the baseline table, preserve its complete previous values, periods, sources and notes
in a dated subsection here (or a linked dated export/record). Summary rows alone are
not sufficient to reconstruct an older baseline.

| Snapshot date | Key changes | Major metric movements | Interpretation | Strategic action taken |
| --- | --- | --- | --- | --- |
| 2026-09-15 | Initial owner-supplied baseline recorded; see Current Baseline. | None established; no comparable prior snapshot. | Historical figures with unknown measurement boundaries; no trend or causal conclusion. | Created scorecard; retained county-first/event-priority strategy. The [2026-09-15 site audit](marketing-audit.md) records implementation work, not measured performance gains. |

## Update Rules

- Do not overwrite old snapshots. Add a new dated snapshot whenever fresh data is supplied.
- Record exact inclusive start/end dates, observation/export date, recording date, source
  link or reference, reporting timezone, filters and relevant attribution definitions.
  Flag partial periods and incomplete conversion cohorts. Missing dates stay unknown.
- Compare like-for-like periods and definitions. Do not calculate a trend against the
  initial baseline until its date boundaries and scope are confirmed. Annotate corrections
  in a new snapshot rather than silently revising historical figures.
- Flag seasonality before interpreting changes, especially event season versus ongoing
  construction demand. Record confirmed deployment/campaign dates separately from edits.
- Do not infer causation from correlation or change strategy because a metric moved once.
  Recommend strategy changes only when evidence is meaningful and persistent.
- Treat Vernon, Richland and Crawford Counties as Tier 1. Separate qualified local traffic
  from irrelevant statewide/national impressions; disclose geographic proxies and unknowns.
- Distinguish one-time event demand from recurring construction/long-term demand in leads,
  bookings and revenue. Do not sum different funnel stages as though they were customers.
- Refresh only supplied or verified metrics; retain older values with their original dates
  when other metrics are updated. Do not rename an old measurement “current.”

Next data needed: exact baseline/export dates and filters; county/channel/device splits;
event versus recurring lead counts; accepted and deduplicated quote totals; lead cohorts
and closing dates; booked order values; a dated live review observation. Booking metrics
remain unmeasured until launch and instrumentation verification.
