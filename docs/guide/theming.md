# Theming

Every themed component reads the same set of custom properties, so you restyle
a variant once and it applies everywhere it is used.

## The variant slots

| Property | Role |
|---|---|
| `--te-400` | borders |
| `--te-500` | base colour |
| `--te-600` | text |
| `--te-700` | hover |
| `--te-800` | active |
| `--te-on` | readable foreground on top of `--te-500` |

The built-in variants are `normal`, `primary`, `secondary`, `success`, `info`,
`warning`, `danger`, `pink`, `purple`, `light` and `dark`.

<Demo note="The same variant names across every component.">
  <te-button type="primary">primary</te-button>
  <te-button type="success">success</te-button>
  <te-button type="info">info</te-button>
  <te-button type="danger">danger</te-button>
  <te-badge type="primary" text="primary" />
  <te-badge type="success" text="success" />
</Demo>

## Overriding a variant

Redefine the slots for the components you care about:

```css
.btn.primary,
.badge.primary,
.chip.primary {
  --te-400: var(--color-teal-400);
  --te-500: var(--color-teal-500);
  --te-600: var(--color-teal-600);
  --te-700: var(--color-teal-700);
  --te-800: var(--color-teal-800);
}
```

## Adding a new variant

Nothing is hardcoded to the built-in names — a class you define yourself works
the same way:

```css
.btn.brand,
.alert.brand {
  --te-400: #a5b4fc;
  --te-500: #4f46e5;
  --te-600: #4338ca;
  --te-700: #3730a3;
  --te-800: #312e81;
  --te-on: white;
}
```

```vue
<te-button type="brand">Brand</te-button>
```

::: warning
`type` is typed as a union of the built-in variants, so a custom name needs a
cast. Keeping to the built-in names avoids that.
:::

## Tailwind theme variables

The stylesheet is written against Tailwind v4's own variables
(`--color-blue-500`, `--text-sm`, `--radius-lg`, `--shadow-lg`, …), so changing
your `@theme` changes the components too:

```css
@import "tailwindcss";
@import "vue3-tailwind-elements/css";

@theme {
  --color-blue-500: oklch(0.62 0.19 250);
  --radius-lg: 1rem;
}
```

## Dark mode

The components follow the operating system on their own, and a `dark` or
`light` class — or `data-theme` — overrules it in both directions:

```html
<html class="dark">      <!-- always dark, whatever the OS says -->
<html class="light">     <!-- always light -->
<html>                   <!-- follows the OS -->
```

```js
// A toggle is one class.
document.documentElement.classList.toggle('dark');
```

The class works anywhere, not only on `<html>`: a `light` island inside a dark
page is one attribute on the wrapper, because every colour is inherited through
custom properties.

### The surface tokens

Every surface, text and border colour in the stylesheet is one of these. The
light column is exactly what the components used before dark mode existed, so
nothing moved when it arrived.

| Token | Light | Dark | Where it shows |
|---|---|---|---|
| `--te-surface` | white | gray-900 | Fields, list groups, the page-level surfaces. |
| `--te-surface-raised` | white | gray-800 | What floats: menus, modals, toasts, cards. |
| `--te-surface-sunken` | gray-50 | gray-800 | Table headers, striped rows, the calendar's gutters. |
| `--te-surface-hover` | gray-100 | gray-700 | Hovered rows and items. |
| `--te-surface-active` | gray-200 | gray-600 | Pressed and disabled fills. |
| `--te-surface-strong` | gray-300 | gray-600 | Switch tracks and dividers drawn as a fill. |
| `--te-text` | gray-900 | gray-50 | Primary text. |
| `--te-text-soft` | gray-800 | gray-100 | Headings inside components. |
| `--te-text-body` | gray-700 | gray-200 | Field text. |
| `--te-text-mild` | gray-600 | gray-300 | Secondary text. |
| `--te-text-muted` | gray-500 | gray-400 | Hints, captions, counters. |
| `--te-text-faint` | gray-400 | gray-500 | Icons and disabled text. |
| `--te-border-soft` | gray-100 | gray-800 | Inner rules. |
| `--te-border` | gray-200 | gray-700 | Component borders. |
| `--te-border-strong` | gray-300 | gray-600 | Field borders. |

They live in Tailwind's `theme` layer, which every other layer outranks, so
your own values need no `!important`:

```css
@import "tailwindcss";
@import "vue3-tailwind-elements/css";

:root {
  --te-surface: #fffdf7;   /* a warmer paper in light */
}

.dark {
  --te-surface: #101014;   /* and a colder one in dark */
}
```

### Using them in your own markup

The same colours are available as classes, which is what the components
themselves use — `te-surface`, `te-raised`, `te-sunken`, `te-subtle`,
`te-active`, `te-hover`, `te-hover-strong`, `te-text`, `te-text-soft`,
`te-text-body`, `te-text-mild`, `te-text-muted`, `te-text-faint`,
`te-border-soft`, `te-border` and `te-border-strong`:

```html
<div class="te-raised te-border rounded-lg border p-4">
  <p class="te-text">Follows the theme</p>
  <p class="te-text-muted">And so does this</p>
</div>
```

They are component classes, so a Tailwind utility you write next to one still
wins.

### The variants stay put

The variant palette is a colour scale, not a surface: a `primary` button is the
same blue in both themes. Redefine the slots under `.dark` if you want it to
shift:

```css
.dark .btn.primary {
  --te-500: var(--color-blue-400);
}
```

## The loading backdrop

`te-loading` paints its scrim out of `--te-surface`, so it is light over a
light page and dark over a dark one. Override the class for anything else:

```css
.te-backdrop {
  background-color: color-mix(in oklab, black 50%, transparent);
}
```
