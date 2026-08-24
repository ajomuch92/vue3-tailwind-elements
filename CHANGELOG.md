# Changelog

## 2.0.0

The components are the same to use — every prop, event and slot from 1.x still
works. The major is for one thing only: the overlay classes moved, so a
stylesheet that overrode them needs one edit. See **Breaking changes** below.

### Breaking changes

- `.offcanvas-backdrop` is gone. `te-offcanvas` is a native `<dialog>` now and
  its scrim is `dialog.offcanvas::backdrop`.
- `.modal` and `.offcanvas` only match `dialog.modal` and `dialog.offcanvas`,
  and neither carries a `z-index` any more — the browser's top layer settles
  stacking. A bare `.modal { … }` override no longer applies.

  ```diff
  - .modal { background-color: rgb(0 0 0 / 0.8); }
  + dialog.modal::backdrop { background-color: rgb(0 0 0 / 0.8); }

  - .offcanvas-backdrop { background-color: rgb(0 0 0 / 0.8); }
  + dialog.offcanvas::backdrop { background-color: rgb(0 0 0 / 0.8); }
  ```

  Nothing else about theming changed: the `--te-*` variant slots, `.te-backdrop`
  and Tailwind's `@theme` all behave as they did.

### Added

- `te-dropdown` — a menu taking plain strings or `{ label, disabled }` items,
  with `align`, `size`, `closeOnSelect`, a `trigger` slot, `v-model` for the
  open state and a `select` event. It renders on the server, so it works under
  Nuxt and VitePress without a `<ClientOnly>` wrapper.
- `te-calendar` — a month grid and a week grid with hour lanes, driven by
  `v-model` for the visible date and `v-model:view` for the two views. Events
  are `{ start, end?, title?, type?, allDay? }`; overlapping events split their
  column and the split resets after a gap. `editable` turns on drag-and-drop,
  which reports a `move-event` rather than mutating the array it was given.
  Month names, weekday names and the clock come from `Intl`, so a `locale` prop
  replaces the hand-translated `monthNames` / `days` lists `te-date-picker`
  still needs. No resizing, recurrence, timezone conversion, or day/year view.
- `te-table` grew the data-grid features it was missing: `sortable` columns
  with `v-model:sort`, row selection through `selectable` + `v-model:selected`,
  a `stickyHeader` and `stickyColumns` for frozen headings and pinned columns,
  and `resizable` / `reorderable` headings backed by `v-model:column-widths`
  and `v-model:column-order`. Every one of those models works uncontrolled, so
  none of them is required. Alongside them: `rowKey` to identify a row by a
  field instead of its index (so selection survives sorting and paging),
  `maxHeight` to scroll the body under a sticky heading, `minColumnWidth` as
  the floor a resize drag cannot cross, and `labelSelectAll` / `labelSelectRow`
  / `labelResize` so the accessible names on those controls can be translated.
- A [playground](https://vue3-tailwind-elements-playground.pages.dev/) with
  live prop controls for every component and the code that renders each one.

### Changed

- `te-table` renders only the current page. It used to keep every row mounted
  and hide the off-page ones with `v-show`, so 5,000 rows paginated by 20 still
  built 5,000 `<tr>`. A per-column slot's `index` still counts across the whole
  set rather than restarting each page.
- `te-modal` and `te-offcanvas` are native `<dialog>` elements now instead of a
  `<Teleport>`ed `div` with a hand-rolled scrim. Escape to close, the focus
  trap, focus returning to the trigger, `::backdrop` and an inert page behind
  come from the browser rather than from this library. The props are unchanged
  — `v-model:visible` on the modal, `v-model` on the offcanvas — and
  `te-offcanvas` gained the `close` event `te-modal` already had. Both fire it
  on every route out: the button, the backdrop, Escape, or the model.
- Animations everywhere in the library now stand down under
  `prefers-reduced-motion: reduce`. The overlays gained slide and fade
  transitions in this release, so shipping them without the opt-out would have
  traded one accessibility problem for another.

### Fixed

- `te-tooltip` only opened on `:hover`, so it did not exist for a keyboard or a
  screen reader. The wrapper is focusable, `:focus-within` opens it, and the
  tip is wired up with `role="tooltip"` and `aria-describedby`.
- `te-tooltip`'s arrow was painted `black` while the bubble was `bg-gray-800`,
  so the pointer never matched the thing it pointed from. Both now read a
  single `--te-tooltip-bg`, which also makes recolouring one declaration.
- `te-tooltip` placed itself with fixed guesses about its own size — `-top-9`
  above the trigger and `left: -110%` beside it — so a two-line tip overlapped
  its trigger and a wide one drifted sideways. It anchors to the trigger's edge
  now and holds the distance with a margin, exposed as a new `offset` prop
  (8px by default).

## 1.1.1

### Fixed

- The `homepage` URL in `package.json` pointed at a site that no longer served
  the documentation.

## 1.1.0

### Added

Twenty components, migrated from the Vue 2 codebase to Vue 3 with TypeScript:
`te-modal`, `te-multiselect`, `te-notification`, `te-offcanvas`,
`te-pagination`, `te-progress`, `te-radio`, `te-range`, `te-rating`,
`te-scroll-to-top`, `te-select`, `te-stepper`, `te-switch`, `te-table`,
`te-tabs`, `te-textarea`, `te-time-picker`, `te-toast`, `te-toast-light` and
`te-tooltip`, plus the imperative `showToast()` helper.

The stylesheet regained the classes they need, which the 1.0.0 Bootstrap purge
had removed: `.form-check`, `.form-switch`, `.btn-close`, `.page-item`,
`.nav-tabs`, `.nav-pills`, `.modal-*` and `.offcanvas-*`.

### Migration notes

Every one of these used the Vue 2 contract, so their public API changed:

- `value` + `@input` became `v-model` (`modelValue` + `update:modelValue`).
  `te-pagination` uses `v-model:active-page`, `te-modal` uses
  `v-model:visible`.
- `te-table`'s `:active-page.sync` became `v-model:active-page`; the `.sync`
  modifier no longer exists.
- `te-radio`'s `idInput` prop is now `id`, and radios take a `name` so they
  group and respond to arrow keys.
- `te-modal`'s `props` / `events` props are now `componentProps` /
  `componentEvents`.
- `showToast()` returns `{ close }` instead of a Vue 2 component instance.

### Fixed while migrating

- `te-textarea` imported `./mixins/eventMixin`, `te-stepper` imported
  `./mixins`, and both `te-stepper` and `te-tabs` imported
  `./transition/slideTransition.vue` — none of those files existed, so the
  components could not be built at all. The transition is now a real component;
  the mixins were replaced by explicit code.
- `te-table` shipped no `computed` block, yet its template read
  `filteredItems`, `pages`, `headerBackgroundClass`, `headerCellClass` and
  `paddingClass`. It threw on first render.
- `te-multiselect` imported the click-outside directive from a path that does
  not resolve, and called `Intl.ListFormat` unguarded.
- `te-progress` referenced an undefined `sizeClass`, so the track had no height.
- `te-time-picker` used Vue 2 filters (`| lpad`), removed in Vue 3, and
  converted 1pm to hour 25.
- `te-scroll-to-top` cleaned up in `beforeDestroy`, a hook Vue 3 never calls —
  the scroll listener leaked on every unmount.
- `te-rating` used `@click.native` (removed in Vue 3) and built `mx-${spacing}`
  at runtime, a class Tailwind never generates.
- `te-stepper` built `grid-cols-${steps.length}` the same way.
- `te-offcanvas` created its backdrop with `document.createElement` and
  appended it to `this.$parent.$el`; it now renders in the template through
  `<Teleport>`. `te-modal` is teleported too.
- `te-modal` and the toast handler called `$destroy()`, which Vue 3 removed.
- `te-select` used `option[valueField] || option`, replacing any `0` or `''`
  value with the whole option object.
- `te-pagination` tested for `position === 'lett'`, so left alignment never
  worked, and kept its page window in `data` patched by three watchers.
- `te-radio` used `crypto.randomUUID()` in a prop default — undefined outside a
  secure context and unstable across SSR hydration.
- `te-switch`'s label had no `for`, so clicking it did nothing.
- Vue 2 transition classes (`fade-enter`, `zoom-enter`) became
  `fade-enter-from` / `zoom-enter-from`.

## 1.0.1

### Added

- `te-input` reveals passwords. A `type="password"` field now renders a toggle
  that switches it to `text` and flips the icon, with no wiring on your side.
  Opt out with `:revealable="false"`, or set your own `rightIcon` to take the
  slot over.

### Changed

- A clickable input icon renders as a `<button type="button">` instead of a
  bare `<i>` with a click handler, so it is reachable by keyboard. The reveal
  toggle carries `aria-label` and `aria-pressed`.

### Fixed

- `te-accordion` left a strip of the panel content visible while collapsed.
  `overflow` clips at the padding box, and the collapsing grid item carried the
  body's `py-4` padding, which set a 32px floor on its height. The padding now
  lives on an inner element so a collapsed panel measures 0px.
- `te-input`'s floating label never lined up. The layout needs `1rem` of
  vertical padding from the component layer, but the `size` prop emitted
  `py-1.5` as a utility, and Tailwind utilities outrank the component layer
  regardless of specificity. The size paddings are now left off in floating
  mode.
- `te-input`'s icons sat half their own height below centre. The template
  paired `translate-y-1/2` with a scoped `transform: translateY(-50%)`
  override; in v4 those are two different properties (`translate` and
  `transform`), so they cancelled out. Now `-translate-y-1/2`, and the scoped
  override is gone.
- `te-input`'s icons were oversized: the flat `text-2xl` default made the glyph
  32px tall inside a 38px medium field, filling 84% of its height. The default
  now tracks the `size` prop (roughly half the field height at every size).
  `leftIconClass` / `rightIconClass` still replace it entirely.

## 1.0.0

First stable release. This version requires **Vue 3.5+** and **Tailwind CSS v4**,
and changes how the styles are installed.

### Breaking changes

**Tailwind v4 is now required, and the JavaScript plugin is gone.**
The plugin was built entirely out of `theme('colors.blue.500')`-style lookups
against the v3 config object, which no longer exists in v4. It is now a plain
stylesheet. Delete the `plugins` entry and the `content` array from your
`tailwind.config.js` (the file itself is usually no longer needed at all), and
import the stylesheet instead:

```css
/* before — tailwind.config.js */
plugins: [require('vue3-tailwind-elements/dist/plugin')],
content: ['./node_modules/vue3-tailwind-elements/**/*.{js,ts,vue}'],

/* after — your stylesheet */
@import "tailwindcss";
@import "vue3-tailwind-elements/css";
```

The stylesheet carries its own `@source`, so no `content` entry is needed.

**`vue` and `tailwindcss` are now peer dependencies** (`^3.5.0` and `^4.0.0`).
Vue used to be a hard dependency, which risked loading a second copy of Vue
into the consuming app.

**The bundled Bootstrap 5 stylesheet was removed.** The plugin shipped a
4,295-line dump of Bootstrap — `--bs-*` custom properties, `.modal`,
`.offcanvas`, `.navbar`, `.carousel`, `.dropdown`, the validation states — none
of which any component used. If you were relying on those classes, add
Bootstrap to your own project. Everything the components need is kept:
`.visually-hidden`, `.spinner-border`, `.spinner-grow`, `.form-floating` and
the accordion chevron, plus the form classes the plugin defined on purpose
(`.form-select`, `.form-range`, `.form-check-input`, `textarea.form-control`).

**`dist/style.css` never existed.** Vite names the library CSS after
`build.lib.fileName`, so the real file is `dist/vue3-tailwind-elements.css`.
Use the new `vue3-tailwind-elements/style.css` export; the old path still
resolves as an alias.

**`te-badge` markup changed.** It now renders a `.badge` class driven by the
shared variant palette instead of a long list of inline utility classes. If you
were overriding those utilities, target `.badge` instead. It also gained the
`secondary`, `light` and `dark` variants.

**`te-loading` is controlled by `v-model`.** It previously had no way to close.
`<te-loading v-if="loading" />` keeps working; `<te-loading v-model="loading" />`
is now the intended usage.

**`type="info"` now works everywhere.** Buttons, spinners and chips accepted it
in their prop validator but had no styles for it.

### Fixed

- The `v-click-outside` directive used the Vue 2 `bind`/`unbind` hooks, so it
  never ran under Vue 3. The date picker did not close on an outside click.
- `te-input` crashed on render: `validProps` referenced itself before
  initialisation. Its DOM attributes are now bound explicitly, so non-HTML
  props no longer leak onto the `<input>`.
- `te-input` never emitted `blur`, `change`, `focus`, `keydown`, `keypress`,
  `keyup` or `click`; the hook meant to provide them called an undefined
  `emit`.
- `te-input` used `crypto.randomUUID()` for its default id, which is undefined
  outside a secure context and unstable across SSR hydration. It now uses
  Vue's `useId()`.
- `te-list-group` threw a `ReferenceError` on mount (`watch` on an undefined
  `activeItem`).
- `te-chip` used an `emit` and a `sizeClass` that were never declared.
- `te-breadcrumb` put `:key` on the children of a `<template v-for>` instead of
  the template, and emitted duplicate keys.
- `te-accordion` measured collapse heights through a ref array that was never
  populated. It now animates with a CSS grid transition and no JavaScript.
- `te-file` read `e.dataTransfer` on a `change` event, where it does not exist.
- `te-loading` painted a `.backdrop` class that nothing defined, and positioned
  itself `absolute`, so it did not cover the viewport.
- `te-checkbox` used `.form-checkbox` from `@tailwindcss/forms`, which was
  never a dependency.
- `TeButton.vue` was imported as `teButton.vue`, which fails on case-sensitive
  filesystems.
- The date picker's month arithmetic was off by one when wrapping the year.
- Alert tints spliced `"1a"` onto a hex colour; v4 colours are `oklch`, so this
  produced an invalid value. Now `color-mix`.
- Alerts and buttons used fixed heights and clipped wrapped text; the button
  also failed to centre its loading spinner.
- Notification badge corner offsets resolved to `-0px`, putting all four
  corners in the same place.
- Pagination `.prev`/`.next`/`.inactive` were nested as descendant selectors
  and never matched the anchor carrying the class.
- The checkbox switch read `theme('marging[-10]')` — a typo resolving to
  `undefined`.
- `.file-control.large` was padded more tightly than `.medium`.
- `bg-opacity-*` and `focus:shadow-outline` were removed from Tailwind in v4
  and v2 respectively.
- The date picker's month and year selects removed their focus outline with no
  replacement.

### Added

- Full TypeScript support. Types ship with the package, `GlobalComponents` is
  augmented so `<te-button type="primary">` is checked in templates, and every
  component is also exported by name for direct import.
- `npm test` runs the type check, the library build, an SSR render of every
  component, and a real Tailwind v4 compile of the stylesheet.
