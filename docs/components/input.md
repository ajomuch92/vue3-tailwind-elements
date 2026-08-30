# Input

<script setup>
import { ref } from 'vue';

const name = ref('');
const password = ref('hunter2');
</script>

`te-input` wraps a native `<input>`, so every value you pass through reaches
the real element. Non-HTML props such as `size` or `helperText` are kept off it.

Inside a [`te-field`](/components/field) it takes the id its label points at, its description and its invalid state from the wrapper.

## Sizes

<Demo block>
  <te-input size="small" placeholder="small" />
  <te-input size="medium" placeholder="medium" />
  <te-input size="large" placeholder="large" />
</Demo>

```vue
<te-input size="small" placeholder="small" />
<te-input size="medium" placeholder="medium" />
<te-input size="large" placeholder="large" />
```

## Helper text and invalid state

<Demo block>
  <te-input placeholder="Email" helper-text="We never share it." />
  <te-input placeholder="Email" invalid helper-text="That address is not valid." />
</Demo>

```vue
<te-input placeholder="Email" helper-text="We never share it." />
<te-input placeholder="Email" invalid helper-text="That address is not valid." />
```

## Icons

A clickable icon emits its own event instead of focusing the field.

<Demo block>
  <te-input placeholder="Search" left-icon="search" />
  <te-input placeholder="Star" right-icon="star" right-icon-clickable />
</Demo>

```vue
<te-input placeholder="Search" left-icon="search" />
<te-input placeholder="Star" right-icon="star" right-icon-clickable />
```

## Password

A `type="password"` field gets a reveal toggle on its own — no wiring needed.
Clicking it switches the field to `text` and flips the icon.

<Demo block note="Click the eye. Pass :revealable='false' to suppress it, or set your own right-icon to take over.">
  <te-input type="password" placeholder="Password" model-value="hunter2" />
  <te-input type="password" placeholder="No toggle" model-value="hunter2" :revealable="false" />
</Demo>

```vue
<te-input v-model="password" type="password" placeholder="Password" />
<te-input v-model="password" type="password" :revealable="false" />
```

The toggle is a real `<button>` with `aria-label` and `aria-pressed`, so it is
reachable by keyboard. Its labels are `Show password` / `Hide password`.

## Floating label

The label uses `placeholder` as its text.

<Demo block note="Empty above, filled below — the label shrinks and rises once the field has a value.">
  <te-input floating placeholder="Full name" />
  <te-input floating placeholder="Full name" model-value="Ada Lovelace" />
</Demo>

```vue
<te-input floating placeholder="Full name" />
<te-input floating placeholder="Full name" v-model="name" />
```

## Disabled and readonly

<Demo block>
  <te-input placeholder="Disabled" disabled />
  <te-input model-value="Read only" readonly />
</Demo>

```vue
<te-input placeholder="Disabled" disabled />
<te-input model-value="Read only" readonly />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string` \| `number` | `''` | Supports `v-model`. |
| `id` | `string` | generated | Falls back to a stable `useId()` value, linked to the floating label. |
| `type` | `'text'` \| `'number'` \| `'email'` \| `'search'` \| `'password'` \| `'tel'` \| `'url'` | `'text'` | Native input type. |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Padding and font size. |
| `placeholder` | `string` | `undefined` | Placeholder, and the floating label text. |
| `helperText` | `string` | `undefined` | Hint below the field. Turns red when `invalid`. |
| `invalid` | `boolean` | `false` | Red border and `aria-invalid`. |
| `floating` | `boolean` | `false` | Floating label style. |
| `disabled` | `boolean` | `false` | Disables the field. |
| `readonly` | `boolean` | `false` | Read-only field. |
| `name` `form` `min` `max` `minlength` `maxlength` `step` `pattern` | `string` \| `number` | `undefined` | Forwarded to the native input. |
| `revealable` | `boolean` | `true` for `type="password"` without a custom `rightIcon` | Shows a reveal toggle that switches the field between `password` and `text`. |
| `leftIcon` / `rightIcon` | `string` | `''` | Icon name. `rightIcon` is ignored when `type="number"`. A custom `rightIcon` on a password field replaces the reveal toggle. |
| `leftIconFamily` / `rightIconFamily` | `string` | `undefined` | Custom icon family. |
| `leftIconClass` / `rightIconClass` | `string` | derived from `size` | Replaces the default icon sizing classes. |
| `leftIconClickable` / `rightIconClickable` | `boolean` | `false` | Makes the icon emit a click event. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string` \| `number` | Value changed. |
| `blur` `focus` | `FocusEvent` | Forwarded from the input. |
| `change` | `Event` | Forwarded from the input. |
| `keydown` `keypress` `keyup` | `KeyboardEvent` | Forwarded from the input. |
| `click` | `MouseEvent` | Forwarded from the input. |
| `left-icon-click` / `right-icon-click` | `MouseEvent` | Only when the icon is clickable. |
