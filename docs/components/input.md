# Input

`te-input` wraps a native `<input>`, so every value you pass through reaches
the real element. Non-HTML props such as `size` or `helperText` are kept off it.

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
  <te-input placeholder="Password" right-icon="eye" right-icon-clickable />
</Demo>

```vue
<te-input placeholder="Search" left-icon="search" />
<te-input placeholder="Password" right-icon="eye" right-icon-clickable />
```

## Floating label

The label uses `placeholder` as its text.

<Demo block>
  <te-input floating placeholder="Full name" />
</Demo>

```vue
<te-input floating placeholder="Full name" />
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
| `leftIcon` / `rightIcon` | `string` | `''` | Icon name. `rightIcon` is ignored when `type="number"`. |
| `leftIconFamily` / `rightIconFamily` | `string` | `undefined` | Custom icon family. |
| `leftIconClass` / `rightIconClass` | `string` | `'text-2xl'` | Extra classes on the icon. |
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
