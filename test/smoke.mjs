// Smoke test: SSR-render every component through the built bundle.
// Uses only node:test + vue/server-renderer — no test framework, no jsdom.
// Guards the crashes this file was written for: teInput's self-referential
// `validProps`, teListGroup's undefined `activeItem` watch, teChip's missing
// `emit`, and the Vue 2 directive hooks in v-click-outside.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createSSRApp, h, resolveComponent } from 'vue';
import { renderToString } from 'vue/server-renderer';
import install from '../dist/vue3-tailwind-elements.js';

const render = (tag, props = {}, slots = undefined) => {
  const app = createSSRApp({ render: () => h(resolveComponent(tag), props, slots) });
  app.use(install, { customIcons: { fa: { prefix: 'fa-', icons: { star: 'star' } } } });
  return renderToString(app);
};

const cases = {
  'te-accordion': { items: ['a', 'b'], defaultOpen: [0] },
  'te-alert': { text: 'hi', type: 'danger' },
  'te-badge': { text: 'new', type: 'pink', size: 'large' },
  'te-breadcrumb': { options: [{ label: 'Home', href: '/' }, { label: 'Now' }] },
  'te-button': { type: 'primary', loading: true },
  'te-button-group': { quantity: 3, disabled: [false, true, false] },
  'te-card': { title: 'Card', width: 400, hasHeader: true, hasFooter: true },
  'te-checkbox': { modelValue: true, label: 'ok' },
  'te-chip': { closable: true, imgUrl: 'x.png', size: 'small' },
  'te-date-picker': { modelValue: new Date(2024, 0, 15) },
  'te-file': { accept: 'image/*' },
  'te-icon': { name: 'star', family: 'fa' },
  'te-input': { modelValue: 'abc', helperText: 'help', rightIcon: 'star', invalid: true },
  'te-list-group': { items: ['one', { label: 'two', disabled: true }], activeItem: 1 },
  'te-loading': { text: 'loading', modelValue: true },
  'te-spinner': { type: 'growing', color: 'danger' },
};

for (const [tag, props] of Object.entries(cases)) {
  test(`${tag} renders`, async () => {
    const html = await render(tag, props);
    assert.ok(html.length > 0, `${tag} rendered nothing`);
    assert.ok(!html.startsWith(`<${tag}`), `${tag} was not resolved to a component`);
    assert.ok(!html.includes('[object Object]'), `${tag} leaked an object into markup`);
  });
}

test('te-input binds only real DOM attributes', async () => {
  const html = await render('te-input', { modelValue: 'x', helperText: 'help', size: 'large' });
  assert.ok(!html.includes('helperText='), 'helperText leaked onto the <input>');
  assert.ok(!html.includes('helpertext='), 'helperText leaked onto the <input>');
  assert.match(html, /value="x"/);
});

test('te-list-group marks the active item', async () => {
  const html = await render('te-list-group', { items: ['one', 'two'], activeItem: 1 });
  assert.match(html, /bg-blue-600/);
});

test('te-accordion opens its default item', async () => {
  const open = await render('te-accordion', { items: ['a'], defaultOpen: [0] });
  const shut = await render('te-accordion', { items: ['a'] });
  assert.match(open, /is-open/);
  assert.doesNotMatch(shut, /is-open/);
});

test('te-loading is driven by v-model', async () => {
  assert.match(await render('te-loading', { modelValue: true }), /te-backdrop/);
  assert.equal(await render('te-loading', { modelValue: false }), '<!---->');
});

test('te-input needs no secure context for its id', async () => {
  const html = await render('te-input', { modelValue: 'x', floating: true, placeholder: 'Name' });
  const id = html.match(/id="([^"]+)"/)?.[1];
  assert.ok(id, 'input rendered without an id');
  assert.match(html, new RegExp(`for="${id}"`), 'label is not bound to the input id');
});

test('te-icon resolves a custom family', async () => {
  assert.match(await render('te-icon', { name: 'star', family: 'fa' }), /fa-star/);
});

test('te-date-picker shows the bound date', async () => {
  const html = await render('te-date-picker', { modelValue: new Date(2024, 0, 15) });
  assert.match(html, new RegExp(new Date(2024, 0, 15).toLocaleDateString().replace(/\//g, '\\/')));
});
