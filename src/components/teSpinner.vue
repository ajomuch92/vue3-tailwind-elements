<template>
  <div class="spinner" :class="[{...typeClass}, size, color]" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { oneOf, SIZES, SPINNER_TYPES, VARIANTS } from '../types';

defineOptions({ name: 'TeSpinner' });

const props = defineProps({
  type: { ...oneOf(SPINNER_TYPES), default: 'normal' },
  size: { ...oneOf(SIZES), default: 'medium' },
  color: { ...oneOf(VARIANTS), default: 'primary' },
});

const typeClass = computed(() => ({
  'spinner-border animate-spin border-4': props.type === 'normal',
  'spinner-grow bg-current opacity-0': props.type === 'growing',
}));
</script>
