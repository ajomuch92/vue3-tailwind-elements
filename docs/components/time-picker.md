# Time picker

`te-time-picker` binds a timestamp in milliseconds, like `Date.prototype.valueOf()`.

## 12 and 24 hour

<Demo block>
  <te-time-picker v-model="time" />
  <te-time-picker v-model="time" :ampm="false" />
</Demo>

```vue
<te-time-picker v-model="time" />
<te-time-picker v-model="time" :ampm="false" />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number` \| `null` | `null` | Milliseconds since the epoch. Supports `v-model`. |
| `ampm` | `boolean` | `true` | 12-hour clock with an AM/PM selector. |
| `disabled` | `boolean` | `false` | Disables the picker. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `number` | The time changed. |
