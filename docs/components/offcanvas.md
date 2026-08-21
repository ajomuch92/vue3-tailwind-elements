# Offcanvas

<script setup>
import { ref } from 'vue';

const open = ref(false);
</script>

`te-offcanvas` slides a panel in from the side. Like [`te-modal`](./modal), it is
a native `<dialog>` opened with `showModal()`, so it comes with <kbd>Esc</kbd>,
a focus trap, focus restored on close, and an inert page behind it. Clicking the
backdrop closes it too.

## Usage

Not shown inline — it is fixed to the viewport edge.

<Demo>
  <te-button @click="open = true">Open panel</te-button>

  <te-offcanvas v-model="open" title="Filters">
    Panel content.
  </te-offcanvas>
</Demo>

```vue
<te-button @click="open = true">Open panel</te-button>

<te-offcanvas v-model="open" title="Filters">
  Panel content.
</te-offcanvas>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | Supports `v-model`. |
| `title` | `string` | `''` | Header text, and the accessible name. |
| `position` | `'left'` \| `'right'` | `'left'` | Edge it slides from. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `boolean` | Visibility changed. |
| `close` | — | The panel closed, by any route: the button, the backdrop, <kbd>Esc</kbd>, or the model. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | Panel body. |
