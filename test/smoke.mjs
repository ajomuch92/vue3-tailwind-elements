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
  'te-dropdown': { label: 'Actions', items: ['Edit', { label: 'Delete', disabled: true }] },
  'te-file': { accept: 'image/*' },
  'te-icon': { name: 'star', family: 'fa' },
  'te-input': { modelValue: 'abc', helperText: 'help', rightIcon: 'star', invalid: true },
  'te-list-group': { items: ['one', { label: 'two', disabled: true }], activeItem: 1 },
  'te-loading': { text: 'loading', modelValue: true },
  'te-spinner': { type: 'growing', color: 'danger' },
  'te-multiselect': { options: [{ value: 1, text: 'One' }, { value: 2, text: 'Two' }], modelValue: [1] },
  'te-notification': { text: '3', position: 'top-right' },
  'te-pagination': { pages: 5, activePage: 2 },
  'te-progress': { value: 42, showValue: true, size: 'large' },
  'te-radio': { label: 'Pick me', nativeValue: 'a', modelValue: 'a' },
  'te-range': { modelValue: 3, min: 0, max: 10 },
  'te-rating': { modelValue: 3, quantity: 5 },
  'te-scroll-to-top': {},
  'te-select': { options: [{ id: 1, label: 'One' }], modelValue: 1, placeholder: 'Pick' },
  'te-stepper': { steps: [{ label: 'One' }, { label: 'Two' }], modelValue: 0 },
  'te-switch': { label: 'On', modelValue: true },
  'te-table': {
    headers: [{ field: 'name', label: 'Name' }, 'age'],
    items: [{ name: 'Ada', age: 36 }, { name: 'Alan', age: 41 }],
    striped: true,
  },
  'te-tabs': { titles: ['One', { label: 'Two', disabled: true }], modelValue: 0 },
  'te-textarea': { modelValue: 'hello', rows: 4 },
  'te-time-picker': { modelValue: new Date(2024, 0, 1, 13, 30).valueOf() },
  'te-toast': { title: 'Saved', subtitle: 'just now', message: 'All good', color: 'success' },
  'te-toast-light': { title: 'Saved', subtitle: 'just now', type: 'success' },
  'te-tooltip': { position: 'top' },
};

/* Modal and offcanvas are native <dialog>s now: no <Teleport>, so their markup
   comes back in the rendered string like everything else. They render closed
   on the server — showModal() is a client-only call — and the UA's
   `dialog:not([open])` rule keeps them hidden until they hydrate. */
const OVERLAYS = {
  'te-modal': { visible: true, title: 'A modal' },
  'te-offcanvas': { modelValue: true, title: 'A panel' },
};

for (const [tag, props] of Object.entries(cases)) {
  test(`${tag} renders`, async () => {
    const html = await render(tag, props);
    assert.ok(html.length > 0, `${tag} rendered nothing`);
    assert.ok(!html.startsWith(`<${tag}`), `${tag} was not resolved to a component`);
    assert.ok(!html.includes('[object Object]'), `${tag} leaked an object into markup`);
  });
}

for (const [tag, props] of Object.entries(OVERLAYS)) {
  test(`${tag} server-renders a closed <dialog>`, async () => {
    const context = {};
    const app = createSSRApp({ render: () => h(resolveComponent(tag), props) });
    app.use(install);
    const html = await renderToString(app, context);
    assert.match(html, /^<dialog/, `${tag} is no longer a native dialog`);
    assert.doesNotMatch(html, /\sopen[\s=>]/, `${tag} claimed to be open before hydration`);
    assert.ok(!html.includes('[object Object]'), `${tag} leaked an object into markup`);
    assert.match(html, new RegExp(props.title));
    assert.deepEqual(context.teleports ?? {}, {}, `${tag} still teleports`);
  });
}

test('te-table renders a row per item and resolves cell values', async () => {
  const html = await render('te-table', {
    headers: [{ field: 'name', label: 'Name' }],
    items: [{ name: 'Ada' }, { name: 'Alan' }],
  });
  assert.match(html, /Ada/);
  assert.match(html, /Alan/);
  assert.ok(!html.includes('undefined'), 'a cell resolved to undefined');
});

test('te-select normalises options and keeps falsy values', async () => {
  const html = await render('te-select', {
    options: [{ id: 0, label: 'Zero' }, { id: 1, label: 'One' }],
    modelValue: 0,
  });
  assert.match(html, /value="0"/, 'the 0 value was dropped');
  assert.match(html, /Zero/);
});

test('te-progress clamps out-of-range values', async () => {
  assert.match(await render('te-progress', { value: 150 }), /width:\s*100%/);
  assert.match(await render('te-progress', { value: -20 }), /width:\s*0%/);
});

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
