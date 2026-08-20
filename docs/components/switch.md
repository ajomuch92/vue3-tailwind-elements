# Switch

`te-switch` is a checkbox styled as a toggle.

## Basic

<Demo block>
  <te-switch label="Notifications" />
  <te-switch label="Disabled" disabled />
</Demo>

```vue
<te-switch label="Notifications" />
<te-switch label="Disabled" disabled />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | Supports `v-model`. |
| `label` | `string` | `''` | Text beside the switch. |
| `disabled` | `boolean` | `false` | Disables the switch. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `boolean` | Toggled. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | `{ selected }` | Replaces the label. |
