# Textarea

`te-textarea` is a multi-line field that forwards the same native events as
[`te-input`](/components/input).

## Basic

<Demo block>
  <te-textarea placeholder="Leave a comment" :rows="4" />
  <te-textarea model-value="Read only" readonly />
</Demo>

```vue
<te-textarea placeholder="Leave a comment" :rows="4" />
<te-textarea model-value="Read only" readonly />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string` | `''` | Supports `v-model`. |
| `placeholder` | `string` | `''` | Placeholder text. |
| `rows` | `number` | `3` | Visible rows. |
| `cols` | `number` | `undefined` | Visible columns. |
| `disabled` | `boolean` | `false` | Disables the field. |
| `readonly` | `boolean` | `false` | Read-only field. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string` | Value changed. |
| `blur` `focus` | `FocusEvent` | Forwarded from the textarea. |
| `change` | `Event` | Forwarded from the textarea. |
| `keydown` `keypress` `keyup` | `KeyboardEvent` | Forwarded from the textarea. |
