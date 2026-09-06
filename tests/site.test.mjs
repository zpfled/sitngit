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
const quote = { getAttribute: () => 'quote' };
const field = (props = {}) => ({ matches: () => true, form: quote, type: 'text', name: 'name', ...props });
const link = href => ({ closest: () => ({ getAttribute: () => href, textContent: ' Get a quote ' }) });

test('telephone, email and internal quote links including queries are tracked once', () => {
  const b = browser();
  b.run();
  for (const href of ['tel:+16085550123', 'mailto:info@example.test?body=private', '/get-a-quote/?type=luxury', '/get-a-quote', 'https://elsewhere.test/get-a-quote/', '/about/']) b.emit('click', link(href));
  assert.deepEqual(b.events.map(e => e[1]), ['click_to_call', 'click_to_email', 'quote_cta_click', 'quote_cta_click']);
  assert.equal(b.events[1][2].link_url, 'mailto:info@example.test');
  assert.equal(b.events[2][2].link_text, 'Get a quote');
  assert.equal(b.events[2][2].page_path, '/');
});

test('form start ignores non-fields, honeypot, hidden and unrelated fields; fires once', () => {
  const b = browser();
  for (const f of [field({ type: 'hidden' }), field({ name: 'bot-field' }), field({ form: null }), field({ disabled: true }), { matches: () => false }]) b.emit('focusin', f);
  assert.equal(b.events.length, 0);
  for (const type of ['focusin', 'input', 'change', 'input']) b.emit(type, field());
  assert.deepEqual(b.events.map(e => e[1]), ['form_start']);
});

test('lead requires submission then thank-you, clears flag and excludes refresh/direct visits', () => {
  const storage = new Map();
  const b = browser('/get-a-quote/', storage);
  b.emit('click', { closest: () => null });
  assert.equal(storage.size, 0);
  b.emit('submit', quote, { defaultPrevented: true });
  assert.equal(storage.size, 0);
  b.emit('submit', quote);
  assert.equal(b.events.length, 0);
  assert.equal(storage.size, 1);
  assert.deepEqual(browser('/thank-you/', storage).events.map(e => e[1]), ['generate_lead']);
  assert.equal(storage.size, 0);
  assert.equal(browser('/thank-you/', storage).events.length, 0);
});

test('expired, future and malformed flags never count', () => {
  for (const timestamp of [Date.now() - 11 * 60000, Date.now() + 60000, 'invalid']) {
    const storage = new Map([['sitandgit:quote-submitted', String(timestamp)]]);
    assert.equal(browser('/thank-you/', storage).events.length, 0);
    assert.equal(storage.size, 0);
  }
});

test('unavailable analytics and storage never prevent native submission', () => {
  const b = browser('/', new Map(), () => { throw Error('blocked'); });
  b.window.sessionStorage = { setItem() { throw Error('blocked'); } };
  assert.doesNotThrow(() => b.emit('focusin', field()));
  assert.doesNotThrow(() => b.emit('submit', quote));
  b.window.gtag = undefined;
  assert.doesNotThrow(() => b.emit('click', link('tel:+16085550123')));
});
