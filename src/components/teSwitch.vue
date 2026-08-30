<template>
  <div class="form-check form-switch">
    <input
      :id="switchId"
      v-model="model"
      class="form-check-input"
      type="checkbox"
      role="switch"
      :disabled="disabled"
    >
    <label class="form-check-label inline-block te-text-soft" :for="switchId" :class="{'opacity-50': disabled}">
      <slot name="default" :selected="model">
        {{ label }}
      </slot>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue';

defineOptions({ name: 'TeSwitch' });

const model = defineModel<boolean>({ default: false });

defineProps({
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
});

/* The label had no `for`, so clicking it did nothing. */
const switchId = useId();
</script>
