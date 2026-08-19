# Upgrading from 0.0.x

Version 1.0.0 requires Tailwind v4 and replaces the JavaScript plugin with a
stylesheet. The full list lives in the
[CHANGELOG](https://github.com/ajomuch92/vue3-tailwind-elements/blob/main/CHANGELOG.md).

## Tailwind config

The JS plugin was built entirely out of `theme('colors.blue.500')`-style lookups
against the v3 config object, which no longer exists in v4.

```diff
  /* tailwind.config.js — usually deletable now */
- content: ['./node_modules/vue3-tailwind-elements/**/*.{js,ts,vue}'],
- plugins: [require('vue3-tailwind-elements/dist/plugin')],
```

## Stylesheet

```diff
- @tailwind base;
- @tailwind components;
- @tailwind utilities;
+ @import "tailwindcss";
+ @import "vue3-tailwind-elements/css";
```

## CSS import path

Vite names the library CSS after `build.lib.fileName`, so `dist/style.css`
never actually existed. The old path still resolves as an alias.

```diff
- import 'vue3-tailwind-elements/dist/style.css';
+ import 'vue3-tailwind-elements/style.css';
```

## Peer dependencies

`vue` and `tailwindcss` are peer dependencies now. Vue used to be a hard
dependency, which risked loading a second copy of Vue into your app.

## Removed: the bundled Bootstrap stylesheet

The plugin shipped a 4,295-line dump of Bootstrap 5 — `--bs-*` custom
properties, `.modal`, `.offcanvas`, `.navbar`, `.carousel`, `.dropdown`, the
validation states. None of it was used by any component. If you were relying on
those classes, add Bootstrap to your own project.

Everything the components need is kept, along with the form classes the plugin
defined on purpose: `.form-select`, `.form-range`, `.form-check-input` and
`textarea.form-control`.

## Component changes

- **`te-badge`** renders a `.badge` class driven by the shared palette instead
  of a long list of inline utilities. Target `.badge` if you were overriding
  them. It also gained `secondary`, `light` and `dark`.
- **`te-loading`** is controlled by `v-model`. `v-if` keeps working.
- **`type="info"`** now works on buttons, spinners and chips, which previously
  accepted it in their validator but had no styles for it.
