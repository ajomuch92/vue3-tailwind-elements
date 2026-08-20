# Pagination

<script setup>
import { ref } from 'vue';

const page = ref(1);
</script>

`te-pagination` renders a sliding window of page numbers around the current
page.

## Basic

<Demo block>
  <te-pagination v-model:active-page="page" :pages="10" />
</Demo>

```vue
<te-pagination v-model:active-page="page" :pages="10" />
```

## Icons, rounded and sizes

<Demo block>
  <te-pagination v-model:active-page="page" :pages="10" show-icons rounded />
  <te-pagination v-model:active-page="page" :pages="10" size="small" />
  <te-pagination v-model:active-page="page" :pages="10" size="large" position="right" />
</Demo>

```vue
<te-pagination v-model:active-page="page" :pages="10" show-icons rounded />
<te-pagination v-model:active-page="page" :pages="10" size="small" />
<te-pagination v-model:active-page="page" :pages="10" size="large" position="right" />
```

::: info Vue 3 migration
This used to be `:active-page.sync`. The `.sync` modifier was removed in Vue 3;
`v-model:active-page` is its replacement.
:::

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `activePage` | `number` | `1` | Current page. Supports `v-model:active-page`. |
| `pages` | `number` | `3` | Total number of pages. |
| `pagesToShow` | `number` | `3` | How many numbers the window holds. |
| `showIcons` | `boolean` | `false` | Uses « » instead of the text labels. |
| `rounded` | `boolean` | `false` | Circular page buttons. |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Button size. |
| `position` | `'left'` \| `'center'` \| `'right'` | `'center'` | Horizontal alignment. |
| `labelPrev` / `labelNext` | `string` | `'Prev.'` / `'Next'` | Text of the arrows. |
| `ariaLabel` | `string` | `'Pagination'` | Accessible name of the `<nav>`. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:activePage` | `number` | The page changed. |
