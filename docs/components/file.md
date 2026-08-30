# File picker

`te-file` reads the selected files and emits them as base64 data URLs, so
`v-model` gives you the content rather than a `File` handle.

Inside a [`te-field`](/components/field) it takes the id its label points at, its description and its invalid state from the wrapper.

## Basic

<Demo block>
  <te-file />
</Demo>

```vue
<te-file />
```

## Restricted and multiple

With `multiple`, a single file still emits a string; two or more emit an array.

<Demo block>
  <te-file accept="image/*" multiple />
  <te-file size="small" disabled />
</Demo>

```vue
<te-file accept="image/*" multiple />
<te-file size="small" disabled />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string` \| `string[]` | `''` | Base64 data URL, or an array of them. Supports `v-model`. |
| `accept` | `string` | `''` | Native `accept` attribute. |
| `multiple` | `boolean` | `false` | Allows selecting more than one file. |
| `disabled` | `boolean` | `false` | Disables the input. |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Padding and font size. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string` \| `string[]` | Emitted once every file has been read. |
