# Offcanvas

`te-offcanvas` slides a panel in from the side. Like the modal, it is teleported
to `<body>`.

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

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | Panel body. |
