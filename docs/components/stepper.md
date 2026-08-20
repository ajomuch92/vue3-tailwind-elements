# Stepper

<script setup>
import { ref } from 'vue';

const step = ref(0);
</script>

`te-stepper` walks through a sequence of steps. Completed steps are marked
automatically.

## Basic

<Demo block>
  <te-stepper v-model="step" :steps="[{ label: 'Cart' }, { label: 'Address' }, { label: 'Payment' }]">
    <template #step-1>Pick your items.</template>
    <template #step-2>Where should it go?</template>
    <template #step-3>How are you paying?</template>
  </te-stepper>
</Demo>

```vue
<te-stepper v-model="step" :steps="[{ label: 'Cart' }, { label: 'Address' }, { label: 'Payment' }]">
  <template #step-1>Pick your items.</template>
  <template #step-2>Where should it go?</template>
  <template #step-3>How are you paying?</template>
</te-stepper>
```

### `Step`

```ts
interface Step {
  label?: string;
  disabled?: boolean;   // the step cannot be clicked
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number` | `0` | Index of the active step. Supports `v-model`. |
| `steps` | `Step[]` | — (required) | Between 1 and 12 steps. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `number` | The active step changed. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `step-N` | — | Panel of the Nth step, starting at `step-1`. |
| `icon` | `{ step, index }` | Replaces the number in the bubble. |
| `label` | `{ step, index }` | Replaces the step label. |
