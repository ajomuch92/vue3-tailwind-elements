<template>
  <div class="backdrop absolute top-0 left-0 flex flex-col justify-center items-center h-screen w-full">
    <te-spinner :type="type" :size="size" :color="color"/>
    <label>{{text}}</label>
  </div>
</template>

<script setup lang="ts">
import teSpinner from './teSpinner.vue';
import { oneOf, SIZES, SPINNER_TYPES, VARIANTS } from '../types';

defineOptions({ name: 'TeLoading' });

defineProps({
  type: { ...oneOf(SPINNER_TYPES), default: 'normal' },
  size: { ...oneOf(SIZES), default: 'medium' },
  color: { ...oneOf(VARIANTS), default: 'primary' },
  text: { type: String, default: '' },
});
</script>
