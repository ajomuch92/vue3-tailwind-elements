<template>
  <div v-if="model" class="te-backdrop" role="status" aria-live="polite" :aria-label="text || 'Loading'">
    <te-spinner :type="type" :size="size" :color="color"/>
    <label v-if="text">{{text}}</label>
  </div>
</template>

<script setup lang="ts">
import teSpinner from './teSpinner.vue';
import { oneOf, SIZES, SPINNER_TYPES, VARIANTS } from '../types';

defineOptions({ name: 'TeLoading' });

/* Visibility is the close API: `<te-loading v-model="loading" />`. Defaults to
   true so the plain `<te-loading v-if="...">` usage keeps working. */
const model = defineModel<boolean>({ default: true });

defineProps({
  type: { ...oneOf(SPINNER_TYPES), default: 'normal' },
  size: { ...oneOf(SIZES), default: 'medium' },
  color: { ...oneOf(VARIANTS), default: 'primary' },
  text: { type: String, default: '' },
});
</script>
