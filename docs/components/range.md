# Range

<script setup>
import { ref } from 'vue';

const volume = ref(4);
</script>

`te-range` is a native slider bound with `v-model`.

## Basic

<Demo block>
  <te-range v-model="volume" :min="0" :max="10" />
  <te-range v-model="volume" :min="0" :max="10" :step="2" disabled />
</Demo>

```vue
<te-range v-model="volume" :min="0" :max="10" />
<te-range v-model="volume" :min="0" :max="10" :step="2" disabled />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number` | `0` | Supports `v-model`. The value is kept numeric. |
| `min` | `number` | `0` | Lower bound. |
| `max` | `number` | `5` | Upper bound. |
| `step` | `number` | `1` | Increment. |
| `disabled` | `boolean` | `false` | Disables the slider. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `number` | Value changed. |
