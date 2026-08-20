# Tabs

`te-tabs` switches between panels. Titles can be plain strings or objects.

## Basic

<Demo block>
  <te-tabs v-model="tab" :titles="['First', 'Second', 'Third']">
    <template #tab-1>Content of the first tab.</template>
    <template #tab-2>Content of the second tab.</template>
    <template #tab-3>Content of the third tab.</template>
  </te-tabs>
</Demo>

```vue
<te-tabs v-model="tab" :titles="['First', 'Second', 'Third']">
  <template #tab-1>Content of the first tab.</template>
  <template #tab-2>Content of the second tab.</template>
  <template #tab-3>Content of the third tab.</template>
</te-tabs>
```

## Pills, filled and disabled titles

<Demo block>
  <te-tabs v-model="tab" pills filled :titles="[{ label: 'One' }, { label: 'Two', disabled: true }]">
    <template #tab-1>First panel.</template>
    <template #tab-2>Second panel.</template>
  </te-tabs>
</Demo>

```vue
<te-tabs v-model="tab" pills filled :titles="[{ label: 'One' }, { label: 'Two', disabled: true }]">
  <template #tab-1>First panel.</template>
  <template #tab-2>Second panel.</template>
</te-tabs>
```

## With a notification badge

`notification` takes the props of [te-notification](/components/notification).

<Demo block>
  <te-tabs v-model="tab" :titles="[{ label: 'Inbox', notification: { text: '3', color: 'danger' } }, 'Archive']">
    <template #tab-1>Three new messages.</template>
    <template #tab-2>Nothing here.</template>
  </te-tabs>
</Demo>

```vue
<te-tabs v-model="tab" :titles="[{ label: 'Inbox', notification: { text: '3', color: 'danger' } }, 'Archive']">
  <template #tab-1>Three new messages.</template>
  <template #tab-2>Nothing here.</template>
</te-tabs>
```

### `TabTitle`

```ts
interface TabTitle {
  label?: string;
  disabled?: boolean;
  notification?: Record<string, unknown>;  // props for te-notification
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number` | `0` | Index of the open tab. Supports `v-model`. |
| `titles` | `(TabTitle | string)[]` | — (required) | Tab titles. |
| `pills` | `boolean` | `false` | Pill styling instead of an underline. |
| `filled` | `boolean` | `false` | Titles share the full width. |
| `vertical` | `boolean` | `false` | Titles on the left, panels on the right. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `number` | The open tab changed. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `tab-N` | — | Panel content, starting at `tab-1`. |
