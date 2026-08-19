<template>
  <span class="badge" :class="[type, size, { solid, outlined, rounded }]">
    <slot name="default">
      {{text}}
    </slot>
  </span>
</template>

<script setup lang="ts">
import { oneOf, VARIANTS } from '../types';

defineOptions({ name: 'TeBadge' });

defineProps({
  text: { type: String, default: '' },
  type: { ...oneOf(VARIANTS), default: 'normal' },
  size: { ...oneOf(['small', 'large'] as const), default: 'small' },
  solid: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
  outlined: { type: Boolean, default: false },
});
</script>
