// Compiles the v4 stylesheet with the real Tailwind compiler and asserts the
// rules the components depend on survive. Guards the bugs this file fixes:
// dead `theme()` lookups, the `#hex + "1a"` alpha splice (invalid on oklch),
// the `-0px` notification offsets, and the descendant-nested .prev/.next.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { compile } from 'tailwindcss';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const loadStylesheet = async (id, base) => {
  if (id === 'tailwindcss') {
    return { path: 'tailwindcss', base, content: readFileSync(join(root, 'node_modules/tailwindcss/index.css'), 'utf8') };
  }
  const path = join(base, id.replace(/^\.\//, ''));
  return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
};

const css = await (async () => {
  const entry = '@import "tailwindcss";\n@import "./src/plugin/index.css";\n';
  const compiler = await compile(entry, { base: root, loadStylesheet });
  return compiler.build([]);
})();

const has = (needle) => css.includes(needle);

/** Body of the first `selector { ... }` rule, brace-balanced. */
function block(selector) {
  const start = css.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `rule ${selector} not found`);
  let depth = 0;
  for (let i = css.indexOf('{', start); i < css.length; i++) {
    if (css[i] === '{') depth++;
    else if (css[i] === '}' && --depth === 0) return css.slice(start, i + 1);
  }
  throw new Error(`unbalanced braces after ${selector}`);
}

test('no unresolved theme() lookups or undefined values leaked', () => {
  assert.ok(!/undefined/.test(css), 'stylesheet contains "undefined"');
  assert.ok(!/theme\(/.test(css), 'stylesheet contains an unresolved theme() call');
});

test('every variant defines the shared palette slots', () => {
  for (const v of ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'pink', 'purple', 'light', 'dark']) {
    assert.ok(has(`&.${v}`), `missing variant .${v}`);
  }
  // info reaches buttons/spinners/chips now, matching the TS `Variant` union.
  assert.ok(has('--color-cyan-500'), 'info variant not wired to a colour');
});

test('alert tint uses color-mix, not a hex+alpha splice', () => {
  assert.ok(has('color-mix(in oklab, var(--te-500) 10%, transparent)'), 'alert tint missing');
  assert.ok(!/#[0-9a-f]{6}1a/i.test(css), 'hex+"1a" alpha splice still present');
});

test('alert and button grow instead of clipping', () => {
  const alert = block('.alert');
  assert.match(alert, /min-height: 3rem/, '.alert lost its min-height');
  assert.doesNotMatch(alert, /^\s*height:/m, '.alert is back to a fixed height');

  const btn = block('.btn');
  assert.match(btn, /display: inline-flex/, '.btn is not centring its contents');
  assert.doesNotMatch(btn, /^\s*height:/m, '.btn is back to a fixed height');
});

test('notification corners have real offsets', () => {
  assert.ok(!/-0px/.test(css), 'notification offsets still resolve to -0px');
  assert.ok(has('translate(50%, -50%)'), 'top-right offset missing');
});

test('pagination states are on the anchor, not descendants', () => {
  assert.ok(has('&.prev:hover'), '.prev is still a descendant selector');
  assert.ok(has('&.active'), '.active missing');
});

test('component-critical rules survive', () => {
  for (const rule of [
    '.spinner-border', '.spinner-grow', '@keyframes te-spinner-grow',
    '.visually-hidden', '.form-floating', '.accordion-button', '.chip',
    '.form-check-input', '.file-control', '.badge', '.te-backdrop',
  ]) {
    assert.ok(has(rule), `missing ${rule}`);
  }
});

test('no utilities removed in Tailwind v4 remain in templates', () => {
  const templates = ['teBadge', 'teChip', 'teDatePicker', 'teInput', 'teAccordion']
    .map((n) => readFileSync(join(root, `src/components/${n}.vue`), 'utf8'))
    .join('\n');
  for (const dead of ['bg-opacity-', 'text-opacity-', 'border-opacity-', 'flex-shrink-', 'shadow-outline']) {
    assert.ok(!templates.includes(dead), `${dead} was removed in Tailwind v4`);
  }
});

test('the loading backdrop covers the viewport and is visible', () => {
  const b = block('.te-backdrop');
  assert.match(b, /position: fixed/, 'backdrop is not fixed to the viewport');
  assert.match(b, /background-color: color-mix/, 'backdrop has no scrim');
});

test('the Bootstrap dump is gone', () => {
  assert.ok(!has('--bs-'), 'Bootstrap custom properties still shipped');
  // .modal, .offcanvas and .dropdown-menu are ours now — te-modal,
  // te-offcanvas and te-dropdown use them. These have no component behind them
  // and only ever came from the dump.
  for (const dead of ['.navbar', '.carousel', '.was-validated', '.input-group']) {
    assert.ok(!has(dead), `${dead} still shipped`);
  }
});

test('every component class the library renders has a rule', () => {
  // Guards against a component shipping markup with no styles behind it, the
  // way .backdrop and .form-checkbox once did.
  for (const rule of ['.form-check', '.form-switch', '.btn-close', '.page-item', '.nav-tabs', '.nav-pills', '.modal-dialog', '.dropdown-item']) {
    assert.ok(has(rule), `missing ${rule}`);
  }
});

test('the overlays are native dialogs, not hand-rolled scrims', () => {
  // The old markup carried its own backdrop div and z-index; showModal() puts
  // both in the top layer instead, which is what brings Escape and the focus
  // trap with it. A z-index creeping back means someone re-stacked them.
  assert.ok(!has('.offcanvas-backdrop'), 'the offcanvas backdrop div is back');
  assert.match(block('dialog.modal'), /background-color: transparent/);
  assert.ok(has('dialog.modal::backdrop'), 'the modal has no ::backdrop scrim');
  assert.ok(has('dialog.offcanvas[open]'), 'the offcanvas never opens');
  for (const overlay of ['dialog.modal', 'dialog.offcanvas']) {
    assert.ok(!/z-index/.test(block(overlay)), `${overlay} still fights for a z-index`);
  }
});

test('animations back off under prefers-reduced-motion', () => {
  assert.ok(has('prefers-reduced-motion'), 'no reduced-motion opt-out shipped');
});

/* te-calendar colours its event chips from the shared --te-* palette, which
   only works while `.calendar-event` stays in the variant selector list. */
test('calendar event chips inherit the variant palette', () => {
  const block = css.slice(css.indexOf('.calendar-event {'));
  assert.ok(block, '.calendar-event never compiled');
  assert.match(block.slice(0, 3000), /&\.danger\s*\{[^}]*--te-500: var\(--color-red-500\)/);
});

/* Pinned cells opt out of the row background to stay opaque while scrolling,
   which also opts them out of the hover state unless this rule survives. */
test('pinned table cells follow the row hover', () => {
  assert.match(css, /tr\.te-hover:hover \.table-pinned/);
  assert.match(css, /\.table-pinned\s*\{[^}]*position: sticky/);
});

/* v4 puts utilities in a later layer than components, so a state class that
   shares its name with a utility loses however specific its selector is —
   `.badge.rounded` silently kept the utility's 0.25rem instead of its pill. */
test('no state class is shadowed by a Tailwind utility', async () => {
  const source = readFileSync(join(root, 'src/plugin/index.css'), 'utf8');
  const names = [...new Set([...source.matchAll(/&\.([a-z][a-z0-9-]*)/g)].map((m) => m[1]))];
  const compiler = await compile('@import "tailwindcss";', { base: root, loadStylesheet });
  const utilities = compiler.build(names);
  const shadowed = names.filter((name) => utilities.includes(`.${name} {`));
  assert.deepEqual(shadowed, [], `state classes a Tailwind utility outranks: ${shadowed}`);
});

/* ---------------------------------------------------------------------- theme */

/** The `--te-x: var(--color-y)` pairs inside the first rule matching `selector`. */
function tokens(selector) {
  const body = block(selector);
  return Object.fromEntries(
    [...body.matchAll(/(--te-[a-z-]+):\s*var\((--color-[a-z0-9-]+)\)/g)].map((m) => [m[1], m[2]])
  );
}

test('the light theme is the greys the components already had', () => {
  const light = tokens(':root, .light, [data-theme="light"]');
  assert.deepEqual(light, {
    '--te-surface': '--color-white',
    '--te-surface-raised': '--color-white',
    '--te-surface-sunken': '--color-gray-50',
    '--te-surface-hover': '--color-gray-100',
    '--te-surface-active': '--color-gray-200',
    '--te-surface-strong': '--color-gray-300',
    '--te-text': '--color-gray-900',
    '--te-text-soft': '--color-gray-800',
    '--te-text-body': '--color-gray-700',
    '--te-text-mild': '--color-gray-600',
    '--te-text-muted': '--color-gray-500',
    '--te-text-faint': '--color-gray-400',
    '--te-border-soft': '--color-gray-100',
    '--te-border': '--color-gray-200',
    '--te-border-strong': '--color-gray-300',
  }, 'a light token moved: every one of them is the colour the components used before the theme existed');
});

test('the class and the media query describe the same dark theme', () => {
  const byClass = tokens('.dark, [data-theme="dark"]');
  const bySystem = tokens(':root:not(.light):not([data-theme="light"])');
  assert.deepEqual(byClass, bySystem, 'the dark class and prefers-color-scheme have drifted apart');
  assert.equal(Object.keys(byClass).length, 15, 'a token is missing from the dark theme');
  assert.notEqual(byClass['--te-surface'], '--color-white', 'the dark surface is still white');
});

test('an explicit theme outranks the system preference', () => {
  assert.ok(has(':root:not(.light):not([data-theme="light"])'), 'a light class cannot override a dark system');
  // The class block comes last, so it wins over :root at equal specificity.
  assert.ok(css.indexOf('.dark, [data-theme="dark"]') > css.indexOf(':root, .light'), 'the dark class lands before :root');
  assert.ok(has('color-scheme: dark'), 'the browser is never told the page went dark');
});

test('no component paints a surface behind the tokens', () => {
  /* The variant palette is a colour scale, not a surface, so it keeps its
     greys; everything after it has to go through a token. */
  const afterPalette = css.slice(css.indexOf('.btn {'));
  const raw = [...afterPalette.matchAll(/(background-color|border-color|^\s*color):[^;]*var\(--color-gray-\d+\)/gm)];
  assert.deepEqual(raw.map((m) => m[0]), [], 'a rule still hard-codes a grey instead of a token');
});
