import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
const site = JSON.parse(await readFile('src/data/site.json', 'utf8'));

const expectedAnalytics = process.argv.includes('--analytics');
const xml = await readFile('public/sitemap.xml', 'utf8');
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert(urls.includes('https://sitandgit.com/'), 'Missing canonical homepage');
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs');
assert(!/luxury|trailer/i.test(xml), 'Removed offering remains in sitemap');
await assert.rejects(access('dist/services/luxury-restroom-trailers/index.html'), { code: 'ENOENT' });
const redirects = await readFile('dist/_redirects', 'utf8');
for (const from of ['/services/luxury-restroom-trailers', '/services/luxury-restroom-trailers/']) {
  const rule = redirects.split('\n').find(line => line.trim().split(/\s+/)[0] === from);
  assert.deepEqual(rule?.trim().split(/\s+/), [from, '/services/event-rentals/', '301'], `Missing retired service redirect: ${from}`);
  assert(redirects.indexOf(rule) < redirects.indexOf('/services/*'), 'Retired service redirect must precede wildcard');
}
for (const url of urls) {
  assert(url.startsWith('https://sitandgit.com/') && url.endsWith('/'), `Noncanonical URL: ${url}`);
  const pathname = new URL(url).pathname;
  const html = await readFile(`dist${pathname}index.html`, 'utf8');
  assert(html.includes(`<link rel="canonical" href="${url}"`), `Canonical mismatch: ${url}`);
  assert(!/<meta name="robots" content="noindex/.test(html), `Noindex URL in sitemap: ${url}`);
}
for (const county of site.service_area.counties) {
  for (const town of county.towns) {
    if (!site.service_area_pages[town.slug]) continue;
    const indexable = ['viroqua-wi', 'richland-center-wi'].includes(town.slug);
    assert.equal(urls.includes(`https://sitandgit.com/service-area/${town.slug}/`), indexable, `Town sitemap policy: ${town.slug}`);
    const html = await readFile(`dist/service-area/${town.slug}/index.html`, 'utf8');
    assert.equal(/<meta name="robots" content="noindex/.test(html), !indexable, `Town indexing policy: ${town.slug}`);
  }
}
const renderedPages = new Map();
async function checkPages(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await checkPages(path);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(path, 'utf8');
      renderedPages.set(path.slice(4).replace(/index\.html$/, ''), html);
      assert(!/luxury|trailer|\{\{[^}]+\}\}/i.test(html), `Removed offering or unresolved content: ${path}`);
      const tags = html.match(/https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=/g) ?? [];
      assert.equal(tags.length, expectedAnalytics ? 1 : 0, `GA tag count: ${path}`);
      assert.equal(html.includes('sitAndGitAnalyticsInitialized'), expectedAnalytics, `Tracking gate: ${path}`);
      assert(!/<form\b|data-netlify|recaptcha|turnstile/i.test(html), `Retired quote form wiring: ${path}`);
      assert(!/request a quote|get a quote|free quote|we will follow up with availability and a clear quote/i.test(html), `Stale quote process: ${path}`);
      const links = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
      const pricingLinks = links.filter(([, attrs]) => /data-pricing-cta="[^"]+"/.test(attrs));
      assert(pricingLinks.length >= 3, `Missing header/footer pricing links: ${path}`);
      for (const [, attrs, text] of links) {
        const href = attrs.match(/href="([^"]+)"/)?.[1];
        const isPricing = /data-pricing-cta="[^"]+"/.test(attrs);
        if (isPricing || /Get Instant Pricing/.test(text) || href?.startsWith(site.navigation.cta_primary.href)) {
          assert(isPricing, `Untracked pricing CTA: ${path}`);
          assert.equal(href, site.navigation.cta_primary.href, `Indirect pricing CTA: ${path}`);
          assert(!/target=|onclick=|download(?:=|\s|$)/.test(attrs), `Non-native pricing navigation: ${path}`);
        }
        if (href?.startsWith('/get-a-quote')) assert(/how .*pricing/i.test(text), `Quote intermediary CTA: ${path}`);
      }
      const canonical = `https://sitandgit.com${path.slice(4).replace(/index\.html$/, '')}`;
      assert(html.includes(`<link rel="canonical" href="${canonical}"`), `Canonical changed: ${path}`);
      assert(html.includes(`<meta property="og:url" content="${canonical}"`), `Social URL changed: ${path}`);
      if (path.includes('/services/toilet-servicing/')) {
        const main = html.match(/<main>([\s\S]*?)<\/main>/)?.[1];
        assert(!main.includes('data-pricing-cta'), 'Service-only CTA incorrectly offers rental pricing');
        assert(main.includes('Call about servicing') && main.includes('sms:'), 'Missing service assistance');
      }
    }
  }
}
await checkPages('dist');
for (const [pathname, html] of renderedPages) {
  for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const url = new URL(href.replaceAll('&amp;', '&'), `https://sitandgit.com${pathname}`);
    if (url.origin !== 'https://sitandgit.com') continue;
    const target = renderedPages.get(url.pathname.replace(/\/?$/, '/'));
    assert(target, `Missing internal page ${href} on ${pathname}`);
    if (url.hash && url.hash !== '#') {
      const id = decodeURIComponent(url.hash.slice(1));
      assert(target.includes(`id="${id}"`), `Broken anchor ${href} on ${pathname}`);
    }
  }
}
for (const path of ['/', '/get-a-quote/', '/contact/', '/services/', '/service-area/', '/faq/']) {
  assert(renderedPages.get(path).includes('id="quote"'), `Missing quote anchor: ${path}`);
}
console.log(`Build verification passed: ${renderedPages.size} pages and internal links/anchors, ${urls.length} canonical sitemap URLs, town indexing, retired offering/redirects, direct pricing CTAs, retired forms, analytics ${expectedAnalytics ? 'enabled' : 'disabled'}.`);
