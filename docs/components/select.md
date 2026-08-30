# Select

`te-select` is a native `<select>`. Options can be plain values or objects.

Inside a [`te-field`](/components/field) it takes the id its label points at, its description and its invalid state from the wrapper.

## Objects and plain values

<Demo block>
  <te-select :options="[{ id: 1, label: 'One' }, { id: 2, label: 'Two' }]" placeholder="Pick one" />
  <te-select :options="['Red', 'Green', 'Blue']" placeholder="Pick a colour" />
</Demo>

```vue
<te-select :options="[{ id: 1, label: 'One' }, { id: 2, label: 'Two' }]" placeholder="Pick one" />
<te-select :options="['Red', 'Green', 'Blue']" placeholder="Pick a colour" />
```

## Sizes and multiple

<Demo block>
  <te-select size="small" :options="['One', 'Two']" />
  <te-select size="large" :options="['One', 'Two']" />
  <te-select multiple :options="['One', 'Two', 'Three']" />
</Demo>

```vue
<te-select size="small" :options="['One', 'Two']" />
<te-select size="large" :options="['One', 'Two']" />
<te-select multiple :options="['One', 'Two', 'Three']" />
```

::: tip Falsy values
An option whose value is `0` or `''` is kept as-is. The old implementation used
`option[valueField] || option`, which quietly replaced those with the whole
option object.
:::

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string` \| `number` \| `array` \| `null` | `null` | Supports `v-model`. An array with `multiple`. |
| `options` | `(object \| string \| number)[]` | `[]` | Option list. |
| `displayField` | `string` | `'label'` | Object key holding the visible text. |
| `valueField` | `string` | `'id'` | Object key holding the value. |
| `placeholder` | `string` | `''` | Shown as a disabled first option. Ignored with `multiple`. |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Padding and font size. |
| `multiple` | `boolean` | `false` | Allows several selections. |
| `disabled` | `boolean` | `false` | Disables the field. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string` \| `number` \| `array` | Selection changed. |
