import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const script = readFileSync(new URL('../src/lib/quote-attribution.js', import.meta.url), 'utf8');
function run(href, referrer, storage = new Map(), blocked = false) {
  const links = [{ href: 'https://quotes.sitandgit.com/' }, { href: 'https://other.example/' }];
  vm.runInNewContext(script, {
    window: { location: new URL(href) }, URL, Date,
    sessionStorage: { getItem: k => { if (blocked) throw Error(); return storage.get(k) || null; }, setItem: (k, v) => storage.set(k, v) },
    document: { referrer, readyState: 'complete', querySelectorAll: () => links }
  });
  return links;
}
test('carries campaign source across site pages without contact query data', () => {
  const storage = new Map();
  run('https://sitandgit.com/?utm_source=facebook&utm_campaign=fall&email=private@example.com', '', storage);
  const links = run('https://sitandgit.com/services/', 'https://sitandgit.com/', storage);
  const target = new URL(links[0].href);
  assert.equal(target.searchParams.get('utm_source'), 'facebook');
  assert.equal(target.searchParams.get('utm_campaign'), 'fall');
  assert.equal(target.searchParams.get('quote_entry'), '/services/');
  assert(!links[0].href.includes('private'));
  assert.equal(links[1].href, 'https://other.example/');
});
test('uses only a referrer hostname and works without storage', () => {
  const links = run('https://sitandgit.com/', 'https://www.google.com/search?q=private', new Map(), true);
  const target = new URL(links[0].href);
  assert.equal(target.searchParams.get('utm_source'), 'www.google.com');
  assert.equal(target.searchParams.get('utm_medium'), 'organic');
  assert(!links[0].href.includes('private'));
});
