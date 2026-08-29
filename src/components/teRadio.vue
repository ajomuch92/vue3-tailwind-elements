<template>
  <div class="form-check">
    <input
      :id="radioId"
      v-model="model"
      :value="nativeValue"
      type="radio"
      class="form-check-input"
      :name="name"
      :disabled="disabled"
    />
    <label class="form-check-label inline-block te-text-soft" :for="radioId" :class="{'opacity-50': disabled}">
      <slot name="default">
        {{ label }}
      </slot>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';

defineOptions({ name: 'TeRadio' });

const model = defineModel<string | number | null>({ default: null });

const props = defineProps({
  /* Was `idInput`, defaulting to crypto.randomUUID() — undefined outside a
     secure context and unstable across SSR hydration. */
  id: { type: String, default: undefined },
  /* Radios only behave as a group when they share a name. */
  name: { type: String, default: undefined },
  label: { type: String, default: '' },
  nativeValue: { type: [String, Number], default: null },
  disabled: { type: Boolean, default: false },
});

const uid = useId();
const radioId = computed(() => props.id ?? uid);
</script>
