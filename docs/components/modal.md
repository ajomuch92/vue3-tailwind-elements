# Modal

<script setup>
import { ref } from 'vue';

const open = ref(false);
</script>

`te-modal` is a dialog rendered through `<Teleport>` into `<body>`, so it is
never clipped by a parent's `overflow`.

## Usage

Not shown inline — it covers the page.

<Demo>
  <te-button @click="open = true">Open</te-button>

  <te-modal v-model:visible="open" title="Delete this item?">
    This cannot be undone.
    <template #footer>
      <te-button type="light" @click="open = false">Cancel</te-button>
      <te-button type="danger" @click="open = false">Delete</te-button>
    </template>
  </te-modal>
</Demo>

```vue
<te-button @click="open = true">Open</te-button>

<te-modal v-model:visible="open" title="Delete this item?">
  This cannot be undone.
  <template #footer>
    <te-button type="light" @click="open = false">Cancel</te-button>
    <te-button type="danger" @click="open = false">Delete</te-button>
  </template>
</te-modal>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `visible` | `boolean` | `false` | Supports `v-model:visible`. |
| `title` | `string` | `''` | Header text, and the accessible name. |
| `size` | `''` \| `'sm'` \| `'lg'` \| `'xl'` | `''` | Dialog width. |
| `centered` | `boolean` | `false` | Vertically centred. |
| `scrollable` | `boolean` | `false` | Scrolls the body instead of the page. |
| `showCloseButton` | `boolean` | `true` | Close button in the header. |
| `closeOnBackdrop` | `boolean` | `true` | Clicking the backdrop closes it. |
| `hideHeader` / `hideFooter` | `boolean` | `false` | Drops that section. |
| `component` | `Component` \| `string` | `undefined` | Renders a component in the body instead of the slot. |
| `componentProps` / `componentEvents` | `object` | `{}` | Bound to that component. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:visible` | `boolean` | Visibility changed. |
| `close` | — | The modal was closed from inside. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | Body. |
| `header` | — | Replaces the title. |
| `footer` | — | Footer. |
