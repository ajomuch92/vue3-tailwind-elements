# Radio

<script setup>
import { ref } from 'vue';

const pick = ref('apple');
</script>

`te-radio` is a native radio button. Give a group the same `name` and bind them
to the same model.

## A group

<Demo block>
  <te-radio v-model="pick" name="fruit" native-value="apple" label="Apple" />
  <te-radio v-model="pick" name="fruit" native-value="pear" label="Pear" />
  <te-radio v-model="pick" name="fruit" native-value="plum" label="Plum" disabled />
</Demo>

```vue
<te-radio v-model="pick" name="fruit" native-value="apple" label="Apple" />
<te-radio v-model="pick" name="fruit" native-value="pear" label="Pear" />
<te-radio v-model="pick" name="fruit" native-value="plum" label="Plum" disabled />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string` \| `number` \| `null` | `null` | Selected value. Supports `v-model`. |
| `nativeValue` | `string` \| `number` | `null` | This radio's value. |
| `name` | `string` | `undefined` | Groups radios together. Required for keyboard arrow navigation. |
| `id` | `string` | generated | Falls back to a stable `useId()` value, linked to the label. |
| `label` | `string` | `''` | Text beside the radio. |
| `disabled` | `boolean` | `false` | Disables the radio. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string` \| `number` | Selected. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | Replaces the label. |
