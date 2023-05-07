<template>
  <label class="inline-flex items-center">
    <input v-model="currentValue" type="checkbox" class="form-checkbox h-4 w-4" :disabled="disabled" :value="nativeValue" />
    <span class="ml-2" :class="{'opacity-50': disabled}">
      <slot name="default" v-bind:selected="currentValue">
        {{label}}
      </slot>
    </span>
  </label>
</template>

<script>
  export default {
    name: 'TeCheckbox'
  }
</script>

<script setup>
import { computed, ref, watch } from 'vue';


const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: [Boolean, Array],
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  nativeValue: {
    type: [String, Number],
    default: undefined,
  }
});

const currentValue = ref(false);

const valueComputed = computed(() => props.modelValue);

watch(currentValue, (val) => {
  emit('update:modelValue', val);
});

watch(valueComputed, (val) => {
  currentValue.value = val;
})

(() => {
  currentValue.value = props.modelValue;
})();
</script>

<style scoped>
  input {
    accent-color: rgb(59, 130, 246);
  }
</style>