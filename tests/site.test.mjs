import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { reviewAge } from '../src/lib/review-age.mjs';

const now = Date.parse('2026-09-05T12:00:00Z');
test('review ages use timestamps, pluralize, and fall back safely', () => {
  for (const [days, expected] of [[0, 'today'], [1, '1 day ago'], [3, '3 days ago'], [14, '2 weeks ago'], [120, '4 months ago'], [365, '1 year ago'], [730, '2 years ago']]) {
    assert.equal(reviewAge(new Date(now - days * 86400000).toISOString(), 'old', now), expected);
  }
  for (const value of [undefined, null, '', 'invalid', '2027-01-01']) assert.equal(reviewAge(value, 'fallback', now), 'fallback');
});

const source = readFileSync(new URL('../src/lib/analytics.js', import.meta.url), 'utf8');
function browser(path = '/', storage = new Map(), gtag = undefined) {
  const listeners = {};
  const events = [];
  const window = {
    location: { pathname: path, href: `https://sitandgit.com${path}`, origin: 'https://sitandgit.com' },
    sessionStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) },
    gtag: gtag ?? ((...args) => events.push(args))
  };
  const context = vm.createContext({ window, document: { addEventListener: (type, listener) => (listeners[type] ??= []).push(listener) }, URL, Date });
  const run = () => vm.runInContext(source, context);
  run();
  return { events, window, run, emit: (type, target, extra = {}) => (listeners[type] ?? []).forEach(fn => fn({ target, ...extra })) };
}
const link = (href, attributes = {}) => ({ closest: () => ({
  getAttribute: name => name === 'href' ? href : (attributes[name] ?? null)
}) });

test('call, text and email clicks strip query data and initialize once', () => {
  const b = browser();
  b.run();
  for (const href of ['tel:+16085550123', 'sms:+16085550123?body=private', 'mailto:info@example.test?subject=private', '/about/']) b.emit('click', link(href));
  assert.deepEqual(b.events.map(e => e[1]), ['click_to_call', 'click_to_text', 'click_to_email']);
  assert.equal(b.events[1][2].link_url, 'sms:+16085550123');
  assert.equal(b.events[2][2].link_url, 'mailto:info@example.test');
});

test('pricing click records origin, placement and known intent without query or fragment data', () => {
  const page = browser('/services/event-rentals/');
  page.emit('click', link('https://quotes.sitandgit.com/?email=private#private', { 'data-pricing-cta': 'service-top', 'data-rental-intent': 'event' }));
  const event = page.events[0];
  assert.equal(event[1], 'pricing_cta_click');
  assert.equal(event[2].page_path, '/services/event-rentals/');
  assert.equal(event[2].cta_placement, 'service-top');
  assert.equal(event[2].rental_intent, 'event');
  assert.equal(event[2].link_url, 'https://quotes.sitandgit.com/');
  assert(!JSON.stringify(event).includes('private'));
});

test('explanatory links, unknown intent and retired quote forms cannot create bookings or leads', () => {
  const b = browser();
  for (const href of ['/get-a-quote/', '/about/', 'https://elsewhere.test/']) b.emit('click', link(href));
  b.emit('submit', { getAttribute: () => 'quote' });
  b.emit('focusin', { matches: () => true });
  assert.equal(b.events.length, 0);
  b.emit('click', link('https://quotes.sitandgit.com/', { 'data-pricing-cta': 'footer', 'data-rental-intent': 'private' }));
  assert.equal(b.events.length, 1);
  assert(!('rental_intent' in b.events[0][2]));
  const oldFlag = new Map([['sitandgit:quote-submitted', String(Date.now())]]);
  assert.equal(browser('/thank-you/', oldFlag).events.length, 0);
});

test('missing or throwing analytics never intercepts navigation', () => {
  const b = browser('/', new Map(), () => { throw Error('blocked'); });
  const cta = link('https://quotes.sitandgit.com/', { 'data-pricing-cta': 'home-hero' });
  const extra = { preventDefault() { throw Error('Navigation intercepted'); } };
  assert.doesNotThrow(() => b.emit('click', cta, extra));
  b.window.gtag = undefined;
  assert.doesNotThrow(() => b.emit('click', cta, extra));
  for (const href of ['https://[invalid', 'javascript:void(0)', '']) assert.doesNotThrow(() => b.emit('click', link(href, { 'data-pricing-cta': 'footer' })));
  assert.doesNotThrow(() => b.emit('click', { closest: () => null }));
});
