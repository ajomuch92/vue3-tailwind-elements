<template>
  <span
    class="skeleton-root"
    :role="label ? 'status' : undefined"
    :aria-label="label || undefined"
    :aria-busy="label ? 'true' : undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <span
      v-for="line in count"
      :key="line"
      class="skeleton"
      :class="[shape, { 'skeleton-still': !animated }]"
      :style="styleFor(line)"
    />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { oneOf } from '../types';

defineOptions({ name: 'TeSkeleton' });

const props = defineProps({
  shape: { ...oneOf(['text', 'rect', 'circle'] as const), default: 'text' },
  /** Rows of text. Ignored by the other shapes. */
  lines: { type: Number, default: 1, validator: (v: unknown) => typeof v === 'number' && v >= 1 },
  width: { type: [String, Number], default: undefined },
  height: { type: [String, Number], default: undefined },
  animated: { type: Boolean, default: true },
  /**
   * What a screen reader should hear while this stands in for content. Without
   * one the placeholder is hidden from assistive tech, which is what you want
   * when something else already announces the loading state.
   */
  label: { type: String, default: '' },
});

const count = computed(() => (props.shape === 'text' ? Math.max(1, Math.floor(props.lines)) : 1));

const size = (value: string | number) => (typeof value === 'number' ? `${value}px` : value);

function styleFor(line: number) {
  const style: Record<string, string> = {};
  if (props.width !== undefined) style.width = size(props.width);
  if (props.height !== undefined) style.height = size(props.height);
  /* A paragraph does not end flush with the margin, so the last line of a
     multi-line block is short unless a width was asked for. */
  if (props.shape === 'text' && count.value > 1 && line === count.value && props.width === undefined) {
    style.width = '60%';
  }
  return style;
}
</script>
