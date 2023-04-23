<template>
  <div class="spinner" :class="[{...typeClass}, size, color]" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  type: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'growing'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['normal', 'primary', 'secondary', 'success', 'warning', 'danger', 'pink', 'purple', 'light', 'dark'].includes(value)
  },
});

const typeClass = computed(() => (
  {
    'spinner-border animate-spin border-4': props.type === 'normal',
    'spinner-grow bg-current opacity-0': props.type === 'growing',
  }
));
</script>

<style scoped>

</style>