# Quote attribution (October 20, 2026)

The owner approved measuring the public quoting funnel and retaining unfinished inquiry details in Honeywagon. No current traffic or conversion results are asserted here.

`src/lib/quote-attribution.js` runs independently of optional GA4. It retains sanitized first-touch source/medium/campaign labels for 30 minutes in tab storage and decorates only `https://quotes.sitandgit.com` pricing CTAs, including ordinary and new-tab navigation. Referrer fallback uses only a hostname, never search text or a full URL. The current website path is carried as `quote_entry`. No contact fields or arbitrary URL parameters are forwarded by this script. Existing GA4 events are unchanged.

The Honeywagon root redirect must preserve these parameters; deploy both repositories. Analytics failures/storage restrictions do not prevent native navigation. The website alone does not install PostHog or produce its pageview events; Honeywagon sends explicit quote-funnel events through its background worker.

Privacy-policy changes and the quoting footer link are deferred by the owner (October 21, 2026). Capture defaults off in Honeywagon until configured with the company UUID. No new inline disclosure or popup is introduced.

Checks: `node --test tests/*.test.mjs` and `npx --no-install astro build`. PostHog project setup and actual production event inspection remain deployment acceptance steps. The full setup guide is `../honeywagon/plans/QUOTE_ANALYTICS_ROLLOUT.md`.
