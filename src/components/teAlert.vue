<template>
  <div class="alert" :class="getClass">
    <slot name="default">
      {{text}}
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { oneOf, VARIANTS } from '../types';

defineOptions({ name: 'TeAlert' });

const props = defineProps({
  text: { type: String, default: '' },
  type: { ...oneOf(VARIANTS), default: 'normal' },
  solid: { type: Boolean, default: false },
});

const getClass = computed(() => ({
  [props.type]: true,
  'solid': props.solid,
}));
</script>
