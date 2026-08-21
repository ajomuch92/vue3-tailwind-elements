# Modal

<script setup>
import { ref } from 'vue';

const open = ref(false);
</script>

`te-modal` is a native `<dialog>` opened with `showModal()`, so it renders in
the browser's top layer: never clipped by a parent's `overflow` and never in a
`z-index` fight. The browser also supplies the behaviour a hand-rolled overlay
has to reimplement — <kbd>Esc</kbd> closes it, focus is trapped inside while it
is open and returned to whatever opened it on close, and the rest of the page
is inert.

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
| `closeOnBackdrop` | `boolean` | `true` | Clicking the backdrop closes it. <kbd>Esc</kbd> always closes it regardless — that one is not negotiable for accessibility. |
| `hideHeader` / `hideFooter` | `boolean` | `false` | Drops that section. |
| `component` | `Component` \| `string` | `undefined` | Renders a component in the body instead of the slot. |
| `componentProps` / `componentEvents` | `object` | `{}` | Bound to that component. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:visible` | `boolean` | Visibility changed. |
| `close` | — | The modal closed, by any route: the button, the backdrop, <kbd>Esc</kbd>, or the model. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | Body. |
| `header` | — | Replaces the title. |
| `footer` | — | Footer. |
