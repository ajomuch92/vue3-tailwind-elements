<template>
  <select
    :id="fieldId"
    v-model="model"
    class="form-select"
    :aria-describedby="fieldDescribedBy"
    :aria-invalid="fieldInvalid || undefined"
    :class="[size]"
    :disabled="disabled"
    :multiple="multiple"
  >
    <!-- Bound to null, not "", so it is the option that matches an empty
         model and actually shows up as the resting label. -->
    <option v-if="placeholder && !multiple" :value="null" disabled hidden>{{ placeholder }}</option>
    <option v-for="(option, key) in normalized" :key="key" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import { oneOf, SIZES } from '../types';
import { useField } from '../composables/useField';

defineOptions({ name: 'TeSelect' });

const { fieldId, fieldDescribedBy, fieldInvalid } = useField();

type SelectValue = string | number;
type SelectOption = Record<string, unknown>;

const model = defineModel<SelectValue | SelectValue[] | null>({ default: null });

const props = defineProps({
  options: { type: Array as PropType<(SelectOption | SelectValue)[]>, default: () => [] },
  displayField: { type: String, default: 'label' },
  valueField: { type: String, default: 'id' },
  placeholder: { type: String, default: '' },
  size: { ...oneOf(SIZES), default: 'medium' },
  disabled: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
});

/* The old template used `option[valueField] || option`, which fell back to the
   whole object whenever the value was 0 or an empty string. */
const normalized = computed(() =>
  props.options.map((option) => {
    if (option === null || typeof option !== 'object') {
      return { value: option as SelectValue, label: String(option) };
    }
    const value = option[props.valueField];
    const label = option[props.displayField];
    return {
      value: (value ?? '') as SelectValue,
      label: String(label ?? value ?? ''),
    };
  })
);
</script>
