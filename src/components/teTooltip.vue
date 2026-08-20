<template>
  <span class="tooltip-wrap relative inline-block cursor-pointer">
    <slot />
    <span class="tooltip-content bg-gray-800 text-white text-center absolute rounded-md z-10 py-1 px-2 opacity-0" :class="getClass">
      <slot name="content" />
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { oneOf } from '../types';

defineOptions({ name: 'TeTooltip' });

const props = defineProps({
  arrow: { type: Boolean, default: true },
  position: { ...oneOf(['top', 'right', 'bottom', 'left'] as const), default: 'top' },
});

const getClass = computed(() => ({
  'arrow': props.arrow,
  'left-1/2 -translate-x-1/2': props.position === 'top' || props.position === 'bottom',
  'top-1/2 -translate-y-1/2': props.position === 'right' || props.position === 'left',
  '-top-9': props.position === 'top',
  '-bottom-9': props.position === 'bottom',
  [props.position]: true,
}));
</script>

<style scoped>
  .tooltip-content {
    visibility: hidden;
    min-width: 120px;
    transition: opacity 250ms;
  }

  .tooltip-wrap:hover .tooltip-content {
    opacity: 1;
    visibility: visible;
  }

  .tooltip-content.right {
    right: -110%;
  }
  
  .tooltip-content.left {
    left: -110%;
  }
  
  .tooltip-content.arrow::after{
    content: " ";
    position: absolute;
    border-style: solid;
    border-width: 5px;
  }
  
  .tooltip-content.top.arrow::after {
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-color: black transparent transparent transparent;
  }
  
  .tooltip-content.bottom.arrow::after {
    bottom: 100%;
    left: 50%;
    margin-left: -5px;
    border-color: transparent transparent black transparent;
  }
  
  .tooltip-content.right.arrow::after {
    top: 50%;
    right: 100%;
    margin-top: -5px;
    border-color: transparent black transparent transparent;
  }
  
  .tooltip-content.left.arrow::after {
    top: 50%;
    left: 100%;
    margin-top: -5px;
    border-color: transparent transparent transparent black;
  }
</style>
