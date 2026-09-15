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
async function checkPages(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await checkPages(path);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(path, 'utf8');
      assert(!/luxury|trailer|\{\{[^}]+\}\}/i.test(html), `Removed offering or unresolved content: ${path}`);
      const tags = html.match(/https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=/g) ?? [];
      assert.equal(tags.length, expectedAnalytics ? 1 : 0, `GA tag count: ${path}`);
      assert.equal(html.includes('sitAndGitAnalyticsInitialized'), expectedAnalytics, `Tracking gate: ${path}`);
      for (const form of html.matchAll(/<form\b[^>]*name="quote"[\s\S]*?<\/form>/g)) {
        for (const required of ['method="post"', 'action="/thank-you/"', 'data-netlify="true"', 'data-netlify-recaptcha="true"', 'netlify-honeypot="bot-field"', 'name="form-name"', 'value="quote"', 'name="bot-field"', 'required']) {
          assert(form[0].includes(required), `Missing form contract ${required}: ${path}`);
        }
      }
    }
  }
}
await checkPages('dist');
console.log(`Build verification passed: ${urls.length} canonical sitemap URLs, town indexing, retired offering/redirects, forms, analytics ${expectedAnalytics ? 'enabled' : 'disabled'}.`);
