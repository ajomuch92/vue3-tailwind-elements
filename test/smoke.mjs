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
  'te-calendar': {
    modelValue: new Date(2024, 0, 15),
    events: [{ start: new Date(2024, 0, 15, 9), end: new Date(2024, 0, 15, 10), title: 'Standup' }],
  },
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
  'te-textarea': { modelValue: 'hello', rows: 4, maxlength: 20, counter: true },
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


test('te-calendar renders the focused month and its events', async () => {
  const html = await render('te-calendar', {
    modelValue: new Date(2024, 0, 15),
    events: [{ start: new Date(2024, 0, 15, 9), title: 'Standup' }],
  });
  assert.match(html, /January 2024/);
  assert.match(html, /Standup/);
  /* January 2024 starts on a Monday and ends on a Wednesday, so a Sunday-first
     grid spans 5 weeks: 7 headings + 35 cells. */
  assert.equal(html.match(/calendar-cell/g).length, 35);
});

test('te-calendar week view clips events to the visible hours', async () => {
  const html = await render('te-calendar', {
    view: 'week',
    modelValue: new Date(2024, 0, 15),
    dayStart: 8,
    dayEnd: 12,
    events: [
      { start: new Date(2024, 0, 15, 9), end: new Date(2024, 0, 15, 10), title: 'Inside' },
      { start: new Date(2024, 0, 15, 20), end: new Date(2024, 0, 15, 21), title: 'Outside' },
    ],
  });
  assert.match(html, /Inside/);
  assert.doesNotMatch(html, /Outside/, 'an event past dayEnd was still drawn');
});

/* The overlap layout is the one piece of real arithmetic in te-calendar:
   events that share a time range split the column, and a gap resets the split
   so a later event is not squeezed by an earlier cluster. */
test('te-calendar splits overlapping events and resets after a gap', async () => {
  const at = (h, m = 0) => new Date(2024, 0, 15, h, m);
  const html = await render('te-calendar', {
    view: 'week',
    modelValue: at(9),
    dayStart: 8,
    dayEnd: 20,
    events: [
      { start: at(9), end: at(11), title: 'A' },
      { start: at(10), end: at(12), title: 'B' },
      { start: at(10, 30), end: at(11, 30), title: 'C' },
      { start: at(15), end: at(16), title: 'Alone' },
    ],
  });

  const widths = [...html.matchAll(/width:([\d.]+)%/g)].map((m) => Number(m[1]));
  assert.equal(widths.length, 4, 'expected one positioned block per event');

  const thirds = widths.filter((w) => Math.abs(w - 100 / 3) < 0.01);
  assert.equal(thirds.length, 3, 'A, B and C form one cluster of three columns');
  assert.ok(widths.includes(100), 'the event after the gap should span the full column');

  /* Three columns means three distinct offsets, not three stacked on 0. */
  const lefts = new Set([...html.matchAll(/left:([\d.]+)%/g)].map((m) => m[1]));
  assert.equal(lefts.size, 3, `expected 3 distinct offsets, got ${[...lefts]}`);
});

test('te-calendar keeps a lone event at full width', async () => {
  const html = await render('te-calendar', {
    view: 'week',
    modelValue: new Date(2024, 0, 15, 9),
    events: [{ start: new Date(2024, 0, 15, 9), end: new Date(2024, 0, 15, 10), title: 'Solo' }],
  });
  assert.match(html, /width:100%/);
});

const GRID = {
  headers: [{ label: 'Name', field: 'name' }, { label: 'Qty', field: 'qty' }],
  items: [
    { name: 'item 10', qty: 2 },
    { name: 'item 2', qty: 30 },
    { name: 'item 1', qty: 100 },
  ],
};

const rowsOf = (html) => [...html.matchAll(/>item \d+</g)].map((m) => m[0].slice(1, -1));

test('te-table sorts by a column and puts numbers in numeric order', async () => {
  assert.deepEqual(
    rowsOf(await render('te-table', { ...GRID, sort: { field: 'name', dir: 'asc' } })),
    ['item 1', 'item 2', 'item 10'],
    'a plain string sort would put "item 10" before "item 2"',
  );
  assert.deepEqual(
    rowsOf(await render('te-table', { ...GRID, sort: { field: 'name', dir: 'desc' } })),
    ['item 10', 'item 2', 'item 1'],
  );
  assert.deepEqual(
    rowsOf(await render('te-table', { ...GRID, sort: { field: 'qty', dir: 'asc' } })),
    ['item 10', 'item 2', 'item 1'],
    'numbers must compare numerically, not as strings',
  );
});

test('te-table leaves the order alone when the server pages', async () => {
  const html = await render('te-table', {
    ...GRID,
    backendPagination: true,
    totalItems: 90,
    itemPerPage: 3,
    sort: { field: 'name', dir: 'asc' },
  });
  assert.deepEqual(rowsOf(html), ['item 10', 'item 2', 'item 1'], 'sorted one page of a server-paged set');
});

/* Was `v-show`: every row stayed mounted and only the page was visible. */
test('te-table only renders the current page', async () => {
  const items = Array.from({ length: 25 }, (_, i) => ({ name: `item ${i + 1}`, qty: i }));
  const html = await render('te-table', { headers: GRID.headers, items, itemPerPage: 5 });
  assert.equal(rowsOf(html).length, 5, 'off-page rows are still in the DOM');
});

test('te-table applies columnOrder and keeps unlisted columns', async () => {
  const html = await render('te-table', { ...GRID, columnOrder: ['qty'] });
  assert.ok(html.indexOf('Qty') < html.indexOf('Name'), 'columnOrder was ignored');
  assert.match(html, /Name/, 'a column missing from columnOrder was dropped');
});

test('te-table renders a checkbox column and marks selected rows', async () => {
  const html = await render('te-table', { ...GRID, selectable: true, rowKey: 'name', selected: ['item 2'] });
  assert.equal([...html.matchAll(/type="checkbox"/g)].length, 4, 'one header box plus one per row');
  assert.equal([...html.matchAll(/checked/g)].length, 1, 'exactly the selected row should be checked');
});

test('te-table pins columns with cumulative offsets', async () => {
  const html = await render('te-table', {
    ...GRID,
    selectable: true,
    showRowNum: true,
    stickyColumns: 1,
    headers: [{ label: 'Name', field: 'name', width: '200px' }, { label: 'Qty', field: 'qty' }],
  });
  /* checkbox at 0, row number after it, then the first data column after both. */
  assert.match(html, /left:0px/);
  assert.match(html, /left:48px/);
  assert.match(html, /left:96px/);
});

/* The bubble's colour used to live in a `bg-gray-800` utility while the arrow
   hard-coded `black`, and the offsets were fixed guesses (`-top-9`,
   `left: -110%`) about the bubble's own size. Both are read off the built
   stylesheet because that is where the bug was, not in the markup. */
test('te-tooltip arrow and bubble share one colour', async () => {
  const { readFileSync } = await import('node:fs');
  const css = readFileSync(new URL('../dist/vue3-tailwind-elements.css', import.meta.url), 'utf8');

  assert.doesNotMatch(css, /\.tooltip-content[^{]*\{[^}]*border-color:\s*(black|#000)/,
    'the arrow is painted with a literal colour again');

  for (const side of ['top', 'bottom', 'left', 'right']) {
    const rule = css.match(new RegExp(`\\.tooltip-content\\.${side}\\.arrow\\[[^\\]]+\\]:after\\{[^}]*\\}`))?.[0];
    assert.ok(rule, `no arrow rule for ${side}`);
    assert.match(rule, /var\(--te-tooltip-bg\)/, `the ${side} arrow does not read the bubble colour`);
  }

  assert.match(css, /\.tooltip-content\[[^\]]+\]\{[^}]*background-color:var\(--te-tooltip-bg\)/,
    'the bubble no longer reads the shared colour');
});

test('te-tooltip anchors to the trigger instead of guessing an offset', async () => {
  const { readFileSync } = await import('node:fs');
  const css = readFileSync(new URL('../dist/vue3-tailwind-elements.css', import.meta.url), 'utf8');
  const ruleFor = (side) => css.match(new RegExp(`\\.tooltip-content\\.${side}\\[[^\\]]+\\]\\{[^}]*\\}`))?.[0] ?? '';

  /* Edge anchoring: each side pins to the opposite edge and holds the gap with
     a margin, so a two-line tip cannot overlap the trigger. */
  assert.match(ruleFor('top'), /bottom:100%/);
  assert.match(ruleFor('bottom'), /top:100%/);
  assert.match(ruleFor('left'), /right:100%/);
  assert.match(ruleFor('right'), /left:100%/);

  for (const side of ['top', 'bottom', 'left', 'right']) {
    assert.match(ruleFor(side), /margin-\w+:var\(--te-tooltip-offset\)/, `${side} lost its offset`);
  }
  assert.doesNotMatch(css, /\.tooltip-content[^{]*\{[^}]*left:-110%/, 'the width-relative offset is back');
});

test('te-tooltip carries its offset in server-rendered markup', async () => {
  assert.match(await render('te-tooltip', { position: 'left' }, { content: () => 'hi' }),
    /--te-tooltip-offset:8px/);
  assert.match(await render('te-tooltip', { position: 'left', offset: 20 }, { content: () => 'hi' }),
    /--te-tooltip-offset:20px/);
});
