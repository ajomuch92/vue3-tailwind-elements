<template>
  <div class="alert" :class="getClass">
    <slot name="default">
      {{text}}
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ALERT_TYPES, oneOf } from '../types';

defineOptions({ name: 'TeAlert' });

const props = defineProps({
  text: { type: String, default: '' },
  type: { ...oneOf(ALERT_TYPES), default: 'normal' },
  solid: { type: Boolean, default: false },
});

const getClass = computed(() => ({
  [props.type]: true,
  'solid': props.solid,
}));
</script>
