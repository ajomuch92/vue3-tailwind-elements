# Progress

`te-progress` is a horizontal progress bar. Values outside `0`–`100` are
clamped.

## Variants

<Demo block>
  <te-progress :value="35" type="primary" />
  <te-progress :value="60" type="success" />
  <te-progress :value="80" type="warning" />
  <te-progress :value="95" type="danger" />
</Demo>

```vue
<te-progress :value="35" type="primary" />
<te-progress :value="60" type="success" />
<te-progress :value="80" type="warning" />
<te-progress :value="95" type="danger" />
```

## Sizes and value label

The percentage is only rendered at `large`, where there is room for it.

<Demo block>
  <te-progress :value="45" size="small" />
  <te-progress :value="45" size="medium" />
  <te-progress :value="45" size="large" show-value />
</Demo>

```vue
<te-progress :value="45" size="small" />
<te-progress :value="45" size="medium" />
<te-progress :value="45" size="large" show-value />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | — (required) | Percentage, clamped to `0`–`100`. |
| `type` | `'normal'` \| `'primary'` \| `'secondary'` \| `'success'` \| `'info'` \| `'warning'` \| `'danger'` \| `'pink'` \| `'purple'` \| `'light'` \| `'dark'` | `'primary'` | Colour variant. |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Bar height. |
| `showValue` | `boolean` | `false` | Prints the percentage inside the bar. Needs `size="large"`. |
