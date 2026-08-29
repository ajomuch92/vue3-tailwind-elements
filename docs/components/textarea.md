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

## Character counter

`counter` shows how much has been typed under the field. With a `maxlength` it
reads `x/y` and the browser enforces the limit; without one it is a plain count.

It sits at the right edge of the component's box, which is as wide as its
parent — so give the field a width (`class="w-full"`, `cols`) for the two to
line up.

<Demo block>
  <te-textarea class="w-full" placeholder="Leave a comment" :rows="4" :maxlength="180" counter />
  <te-textarea class="w-full" placeholder="No limit" :rows="4" counter />
</Demo>

```vue
<te-textarea class="w-full" placeholder="Leave a comment" :rows="4" :maxlength="180" counter />
<te-textarea class="w-full" placeholder="No limit" :rows="4" counter />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string` | `''` | Supports `v-model`. |
| `placeholder` | `string` | `''` | Placeholder text. |
| `rows` | `number` | `3` | Visible rows. |
| `cols` | `number` | `undefined` | Visible columns. |
| `maxlength` | `string \| number` | `undefined` | Caps the value, and turns the counter into `x/y`. |
| `counter` | `boolean` | `false` | Shows the character count under the field. |
| `disabled` | `boolean` | `false` | Disables the field. |
| `readonly` | `boolean` | `false` | Read-only field. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string` | Value changed. |
| `blur` `focus` | `FocusEvent` | Forwarded from the textarea. |
| `change` | `Event` | Forwarded from the textarea. |
| `keydown` `keypress` `keyup` | `KeyboardEvent` | Forwarded from the textarea. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `counter` | `{ length, maxlength }` | Replaces the counter text, for a wording of your own. |

```vue
<te-textarea :maxlength="180" counter>
  <template #counter="{ length, maxlength }">
    Quedan {{ maxlength - length }} caracteres
  </template>
</te-textarea>
```
