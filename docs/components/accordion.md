# Accordion

`te-accordion` collapses each panel with a CSS grid transition, so panels
animate to their natural height with no JavaScript measuring.

## Basic

<Demo block>
  <te-accordion :items="['First', 'Second', 'Third']">
    <template #content-1>Content of the first panel.</template>
    <template #content-2>Content of the second panel.</template>
    <template #content-3>Content of the third panel.</template>
  </te-accordion>
</Demo>

```vue
<te-accordion :items="['First', 'Second', 'Third']">
  <template #content-1>Content of the first panel.</template>
  <template #content-2>Content of the second panel.</template>
  <template #content-3>Content of the third panel.</template>
</te-accordion>
```

## Single open

Opening a panel closes the others.

<Demo block>
  <te-accordion single-open :items="['First', 'Second']">
    <template #content-1>Only one panel stays open.</template>
    <template #content-2>Opening this one closes the other.</template>
  </te-accordion>
</Demo>

```vue
<te-accordion single-open :items="['First', 'Second']">
  <template #content-1>Only one panel stays open.</template>
  <template #content-2>Opening this one closes the other.</template>
</te-accordion>
```

## Flush and open by default

<Demo block>
  <te-accordion flush :items="['First', 'Second']" :default-open="[0]">
    <template #content-1>Open on mount.</template>
    <template #content-2>Closed on mount.</template>
  </te-accordion>
</Demo>

```vue
<te-accordion flush :items="['First', 'Second']" :default-open="[0]">
  <template #content-1>Open on mount.</template>
  <template #content-2>Closed on mount.</template>
</te-accordion>
```

## Custom headers

<Demo block>
  <te-accordion :items="['Ignored']">
    <template #header-1><strong>Custom</strong>&nbsp;header</template>
    <template #content-1>Body.</template>
  </te-accordion>
</Demo>

```vue
<te-accordion :items="['Ignored']">
  <template #header-1><strong>Custom</strong>&nbsp;header</template>
  <template #content-1>Body.</template>
</te-accordion>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `unknown[]` | `[]` | One entry per panel. The value is the default header label. |
| `flush` | `boolean` | `false` | Removes the outer borders and rounding. |
| `singleOpen` | `boolean` | `false` | Only one panel open at a time. Changing this closes everything. |
| `defaultOpen` | `number[]` | `[]` | Indexes open on mount. Copied, never mutated. |

## Events

| Event | Payload | Description |
|---|---|---|
| `open` | `number` | Index of the panel that opened. |
| `close` | `number` | Index of the panel that closed. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `header-N` | `{ title }` | Header of the Nth panel, starting at `header-1`. |
| `content-N` | — | Body of the Nth panel, starting at `content-1`. |
