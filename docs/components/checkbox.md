# Checkbox

`te-checkbox` is a native checkbox themed with `accent-color`.

## Basic

<Demo block>
  <te-checkbox label="Accept the terms" />
</Demo>

```vue
<te-checkbox label="Accept the terms" />
```

## Disabled

<Demo block>
  <te-checkbox label="Disabled" disabled />
</Demo>

```vue
<te-checkbox label="Disabled" disabled />
```

## Custom label

The default slot receives the current value.

<Demo block>
  <te-checkbox>
    <template #default="{ selected }">
      <strong>{{ selected ? 'On' : 'Off' }}</strong>
    </template>
  </te-checkbox>
</Demo>

```vue
<te-checkbox>
  <template #default="{ selected }">
    <strong>{{ selected ? 'On' : 'Off' }}</strong>
  </template>
</te-checkbox>
```

### Groups

Bind an array and give each box a `nativeValue`:

```vue
<te-checkbox v-model="picked" native-value="a" label="A" />
<te-checkbox v-model="picked" native-value="b" label="B" />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `boolean` \| `(string \| number)[]` | `false` | Supports `v-model`. Use an array with `nativeValue` for groups. |
| `label` | `string` | `''` | Text next to the box. |
| `disabled` | `boolean` | `false` | Disables the checkbox. |
| `nativeValue` | `string` \| `number` | `undefined` | Value contributed to an array `modelValue`. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `boolean` \| `(string \| number)[]` | Value changed. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | `{ selected }` | Replaces the label. |
