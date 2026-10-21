// Carry only campaign labels into quoting; never forward contact data or full referrers.
(() => {
  const key = 'sitandgit:quote-source:v1';
  const clean = value => String(value || '').toLowerCase().replace(/[^a-z0-9._/-]/g, '').slice(0, 100);
  let attribution;
  try {
    const saved = JSON.parse(sessionStorage.getItem(key));
    if (saved && Date.now() - saved.time < 30 * 60 * 1000) attribution = saved;
  } catch { /* Storage is optional. */ }
  if (!attribution) {
    const url = new URL(window.location.href);
    let source = 'direct';
    try { source = new URL(document.referrer).hostname; } catch { /* No referrer. */ }
    attribution = {
      source: clean(url.searchParams.get('utm_source') || source),
      medium: clean(url.searchParams.get('utm_medium') || (source === 'direct' ? 'direct' : /(^|\.)(google|bing|duckduckgo)\./.test(source) ? 'organic' : 'referral')),
      campaign: clean(url.searchParams.get('utm_campaign')),
      time: Date.now()
    };
    try { sessionStorage.setItem(key, JSON.stringify(attribution)); } catch { /* Navigation still works. */ }
  }
  function decorate() {
    document.querySelectorAll('a[data-pricing-cta]').forEach(link => {
      try {
        const url = new URL(link.href, window.location.href);
        if (url.origin !== 'https://quotes.sitandgit.com') return;
        for (const name of ['source', 'medium', 'campaign']) {
          if (attribution[name]) url.searchParams.set(`utm_${name}`, attribution[name]);
        }
        url.searchParams.set('quote_entry', clean(window.location.pathname));
        link.href = url.toString();
      } catch { /* Ignore malformed links. */ }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', decorate);
  else decorate();
})();
