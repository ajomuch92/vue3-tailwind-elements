<template>
  <label class="inline-flex items-center">
    <input v-model="model" type="checkbox" class="h-4 w-4" :disabled="disabled" :value="nativeValue" />
    <span class="ml-2" :class="{'opacity-50': disabled}">
      <slot name="default" :selected="model">
        {{label}}
      </slot>
    </span>
  </label>
</template>

<script setup lang="ts">
defineOptions({ name: 'TeCheckbox' });

const model = defineModel<boolean | (string | number)[]>({ default: false });

defineProps({
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  nativeValue: { type: [String, Number], default: undefined },
});
</script>

<style scoped>
  input {
    accent-color: rgb(59, 130, 246);
  }
</style>
