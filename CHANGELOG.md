# Changelog

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
