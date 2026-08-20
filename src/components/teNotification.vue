<template>
  <div class="notification-wrapper">
    <div
      v-show="!hide"
      class="notification"
      :class="[color, position, text ? 'py-1 px-2.5' : 'p-2.5']"
    >
      {{ text }}
    </div>
    <slot name="default" />
  </div>
</template>

<script setup lang="ts">
import { oneOf, VARIANTS } from '../types';

defineOptions({ name: 'TeNotification' });

/* The corner offsets live in the plugin stylesheet as .notification.top-left
   etc.; the old `positionClass` computed duplicated them and was never bound
   to anything. */
defineProps({
  text: { type: String, default: '' },
  position: { ...oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const), default: 'top-right' },
  color: { ...oneOf(VARIANTS), default: 'primary' },
  hide: { type: Boolean, default: false },
});
</script>
