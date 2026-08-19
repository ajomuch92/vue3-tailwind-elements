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

## The loading backdrop

`te-loading` paints a light scrim so the default dark spinner stays readable.
For a dark one, override the class:

```css
.te-backdrop {
  background-color: color-mix(in oklab, black 50%, transparent);
}
```
