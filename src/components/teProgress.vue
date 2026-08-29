<template>
  <div class="w-full te-active mb-6" :class="trackClass">
    <div class="progress" :class="[type, size]" :style="{ width: `${clamped}%` }" role="progressbar"
      :aria-valuenow="clamped" aria-valuemin="0" aria-valuemax="100">
      {{ showValue && size === 'large' && clamped > 0 ? `${clamped}%` : '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { oneOf, SIZES, VARIANTS } from '../types';

defineOptions({ name: 'TeProgress' });

const props = defineProps({
  value: { type: Number, required: true },
  size: { ...oneOf(SIZES), default: 'medium' },
  type: { ...oneOf(VARIANTS), default: 'primary' },
  showValue: { type: Boolean, default: false },
});

/* The template referenced a `sizeClass` that was never defined, so the track
   had no height of its own. */
const trackClass = computed(() => ({
  small: 'h-px',
  medium: 'h-2',
  large: 'h-5',
}[props.size]));

const clamped = computed(() => Math.min(100, Math.max(0, props.value)));
</script>
