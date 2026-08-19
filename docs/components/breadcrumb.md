# Breadcrumb

`te-breadcrumb` renders a trail of links. The last entry is always plain text.

## Basic

<Demo block>
  <te-breadcrumb :options="[
    { label: 'Home', href: '/' },
    { label: 'Guide', href: '/guide/' },
    { label: 'Breadcrumb' },
  ]" />
</Demo>

```vue
<te-breadcrumb :options="[
  { label: 'Home', href: '/' },
  { label: 'Guide', href: '/guide/' },
  { label: 'Breadcrumb' },
]" />
```

## Separator

<Demo block>
  <te-breadcrumb separator=">" :options="[
    { label: 'Home', href: '/' },
    { label: 'Breadcrumb' },
  ]" />
</Demo>

```vue
<te-breadcrumb separator=">" :options="[
  { label: 'Home', href: '/' },
  { label: 'Breadcrumb' },
]" />
```

### `BreadcrumbOption`

```ts
interface BreadcrumbOption {
  label: string;
  href?: string;                            // used when linkTag is 'a'
  to?: string | Record<string, unknown>;    // used for router-link / nuxt-link
}
```

With `router-link` or `nuxt-link`, entries are bound with `to` instead of `href`.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `BreadcrumbOption[]` | `[]` | Trail entries. See below. |
| `separator` | `'/'` \| `'\\'` \| `'>'` | `'/'` | Separator between entries. |
| `linkTag` | `'a'` \| `'router-link'` \| `'nuxt-link'` | `'a'` | Tag used for the links. |
