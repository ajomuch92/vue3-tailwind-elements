# Loading

`te-loading` is a full-viewport overlay. Visibility is the close API, so bind it
with `v-model`.

## Usage

Not rendered inline here — it covers the whole viewport.

<Demo block>
  <te-loading v-model="loading" text="Loading…" />
</Demo>

```vue
<te-loading v-model="loading" text="Loading…" />
```

```vue
<script setup>
import { ref } from 'vue';

const loading = ref(false);

async function save() {
  loading.value = true;
  try {
    await api.save();
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <te-button @click="save">Save</te-button>
  <te-loading v-model="loading" text="Saving…" />
</template>
```

The overlay is `position: fixed` with a light scrim. See
[Theming](/guide/theming#the-loading-backdrop) to darken it.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `boolean` | `true` | Whether the overlay is shown. Supports `v-model`. |
| `text` | `string` | `''` | Label under the spinner, also used as the accessible name. |
| `type` | `'normal'` \| `'growing'` | `'normal'` | Spinner type. |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Spinner size. |
| `color` | `'normal'` \| `'primary'` \| `'secondary'` \| `'success'` \| `'info'` \| `'warning'` \| `'danger'` \| `'pink'` \| `'purple'` \| `'light'` \| `'dark'` | `'primary'` | Spinner colour. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `boolean` | Emitted when visibility changes. |
