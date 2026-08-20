# Rating

`te-rating` is a star rating with optional half values.

## Basic

<Demo block>
  <te-rating v-model="score" />
  <te-rating v-model="score" :quantity="10" />
</Demo>

```vue
<te-rating v-model="score" />
<te-rating v-model="score" :quantity="10" />
```

## Half values, clearable and disabled

<Demo block>
  <te-rating v-model="score" clearable />
  <te-rating :model-value="3.5" disabled />
</Demo>

```vue
<te-rating v-model="score" clearable />
<te-rating :model-value="3.5" disabled />
```

## Custom icon and colour

<Demo block>
  <te-rating v-model="score" icon="heart-fill" color="crimson" />
</Demo>

```vue
<te-rating v-model="score" icon="heart-fill" color="crimson" />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number` | `0` | Supports `v-model`. Halves are allowed. |
| `quantity` | `number` | `5` | How many icons. |
| `icon` | `string` | `'star-fill'` | Icon name, from your icon font. |
| `iconSizeClass` | `string` | `'text-xl'` | Classes controlling the icon size. |
| `spacing` | `number` (0–5) | `1` | Gap between icons. |
| `color` | `string` | `'gold'` | Any CSS colour for the filled state. |
| `hasHalfValues` | `boolean` | `true` | Enables half selections. |
| `clearable` | `boolean` | `false` | Adds an eraser that resets to `0`. |
| `disabled` | `boolean` | `false` | Makes it read-only. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `number` | A value was picked. |
