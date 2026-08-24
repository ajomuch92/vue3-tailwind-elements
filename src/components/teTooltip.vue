<template>
  <span
    class="tooltip-wrap relative inline-block cursor-pointer"
    tabindex="0"
    :aria-describedby="tooltipId"
  >
    <slot />
    <span
      :id="tooltipId"
      role="tooltip"
      class="tooltip-content text-center absolute rounded-md z-10 py-1 px-2 opacity-0"
      :class="[position, { arrow }]"
      :style="{ '--te-tooltip-offset': offsetPx }"
    >
      <slot name="content" />
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { oneOf } from '../types';

defineOptions({ name: 'TeTooltip' });

const props = defineProps({
  arrow: { type: Boolean, default: true },
  position: { ...oneOf(['top', 'right', 'bottom', 'left'] as const), default: 'top' },
  /** Gap in pixels between the trigger and the bubble. */
  offset: { type: Number, default: 8, validator: (v: unknown) => typeof v === 'number' && v >= 0 },
});

/* The tip used to open on :hover alone, so it did not exist for a keyboard or
   a screen reader. The wrapper is focusable now and :focus-within opens it;
   aria-describedby is what actually reads the content out. */
const tooltipId = useId();

const offsetPx = computed(() => `${props.offset}px`);
</script>

<style scoped>
  /* One declaration of the colour feeds both the bubble and the arrow. The
     arrow used to be hard-coded `black` against a `bg-gray-800` bubble, so the
     two never matched; there is nothing left to keep in sync now. Both are
     plain custom properties, so a theme can override them without :deep(). */
  .tooltip-content {
    --te-tooltip-bg: var(--color-gray-800);
    --te-tooltip-color: var(--color-white);
    --te-tooltip-arrow: 6px;
    /* Overridden by the inline style the component binds. Declared here too so
       the gap survives server-rendered markup, which `v-bind()` in scoped CSS
       does not reach until the component hydrates. */
    --te-tooltip-offset: 8px;

    visibility: hidden;
    min-width: 120px;
    background-color: var(--te-tooltip-bg);
    color: var(--te-tooltip-color);
    transition: opacity 250ms;
  }

  .tooltip-wrap:hover .tooltip-content,
  .tooltip-wrap:focus-within .tooltip-content {
    opacity: 1;
    visibility: visible;
  }

  /* Anchored to the trigger's edges rather than nudged by a fixed `-top-9` and
     a `left: -110%`: the old offsets were guesses about the bubble's own size,
     so a two-line tip overlapped the trigger and a wide one drifted sideways.
     Edge anchoring plus a margin holds the gap at any size. */
  .tooltip-content.top {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: var(--te-tooltip-offset);
  }

  .tooltip-content.bottom {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: var(--te-tooltip-offset);
  }

  .tooltip-content.left {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-right: var(--te-tooltip-offset);
  }

  .tooltip-content.right {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: var(--te-tooltip-offset);
  }

  .tooltip-content.arrow::after {
    content: "";
    position: absolute;
    border-style: solid;
    border-width: var(--te-tooltip-arrow);
  }

  .tooltip-content.top.arrow::after {
    top: 100%;
    left: 50%;
    margin-left: calc(var(--te-tooltip-arrow) * -1);
    border-color: var(--te-tooltip-bg) transparent transparent transparent;
  }

  .tooltip-content.bottom.arrow::after {
    bottom: 100%;
    left: 50%;
    margin-left: calc(var(--te-tooltip-arrow) * -1);
    border-color: transparent transparent var(--te-tooltip-bg) transparent;
  }

  .tooltip-content.right.arrow::after {
    top: 50%;
    right: 100%;
    margin-top: calc(var(--te-tooltip-arrow) * -1);
    border-color: transparent var(--te-tooltip-bg) transparent transparent;
  }

  .tooltip-content.left.arrow::after {
    top: 50%;
    left: 100%;
    margin-top: calc(var(--te-tooltip-arrow) * -1);
    border-color: transparent transparent transparent var(--te-tooltip-bg);
  }
</style>
