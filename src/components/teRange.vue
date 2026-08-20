<template>
  <input
    v-model.number="model"
    type="range"
    class="form-range focus:ring-0"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'TeRange' });

const model = defineModel<number>({ default: 0 });

defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
  step: { type: Number, default: 1 },
  disabled: { type: Boolean, default: false },
});
</script>
