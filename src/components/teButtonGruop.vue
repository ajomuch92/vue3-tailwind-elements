<template>
  <div class="flex items-center justify-center my-1">
    <te-button
      v-for="n in quantity"
      :key="n"
      :type="type"
      :size="size"
      :outlined="outlined"
      no-rounded
      :class="{'rounded-l': n===1, 'rounded-r': n===quantity}"
      :disabled="disabled[n-1] || false"
      @click="emit('click', { index: n, event: $event })"
    >
      <slot :name="`button-${n}`" :index="n" />
    </te-button>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import teButton from './teButton.vue';
import { oneOf, SIZES, VARIANTS } from '../types';

defineOptions({ name: 'TeButtonGroup' });

const emit = defineEmits<{
  click: [payload: { index: number; event: MouseEvent }];
}>();

defineProps({
  quantity: { type: Number, default: 1 },
  type: { ...oneOf(VARIANTS), default: 'primary' },
  size: { ...oneOf(SIZES), default: 'medium' },
  outlined: { type: Boolean, default: false },
  disabled: { type: Array as PropType<boolean[]>, default: () => [] },
});
</script>
