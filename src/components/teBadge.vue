<template>
  <span
    class="
      text-xs
      font-medium
    "
    :class="getClass"
  >
    <slot name="default">
      {{text}}
    </slot>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal','primary', 'success', 'info', 'warning', 'danger', 'pink', 'purple'].includes(value)
  },
  size: {
    type: String,
    default: 'small',
    validator: (value) => ['small','large'].includes(value)
  },
  solid: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  outlined: {
    type: Boolean,
    default: false,
  }
});

const getClass = computed(() => ({
  'bg-gray-500 bg-opacity-10 text-gray-800': props.type === 'normal' && !props.solid && !props.outlined,
  'bg-indigo-500 bg-opacity-10 text-indigo-800': props.type === 'primary' && !props.solid && !props.outlined,
  'bg-green-500 bg-opacity-10 text-green-800': props.type === 'success' && !props.solid && !props.outlined,
  'bg-blue-500 bg-opacity-10 text-blue-800': props.type === 'info' && !props.solid && !props.outlined,
  'bg-yellow-500 bg-opacity-10 text-yellow-800': props.type === 'warning' && !props.solid && !props.outlined,
  'bg-red-500 bg-opacity-10 text-red-800': props.type === 'danger' && !props.solid && !props.outlined,
  'bg-purple-500 bg-opacity-10 text-purple-800': props.type === 'purple' && !props.solid && !props.outlined,
  'bg-pink-500 bg-opacity-10 text-pink-800': props.type === 'pink' && !props.solid && !props.outlined,
  'bg-gray-500 text-white': props.type === 'normal' && props.solid && !props.outlined,
  'bg-indigo-500 text-white': props.type === 'primary' && props.solid && !props.outlined,
  'bg-green-500 text-white': props.type === 'success' && props.solid && !props.outlined,
  'bg-blue-500 text-white': props.type === 'info' && props.solid && !props.outlined,
  'bg-yellow-500 text-white': props.type === 'warning' && props.solid && !props.outlined,
  'bg-red-500 text-white': props.type === 'danger' && props.solid && !props.outlined,
  'bg-purple-500 text-white': props.type === 'purple' && props.solid && !props.outlined,
  'bg-pink-500 text-white': props.type === 'pink' && props.solid && !props.outlined,
  'border border-gray-500 text-gray-500': props.type === 'normal' && props.outlined,
  'border border-indigo-500 text-indigo-500': props.type === 'primary' && props.outlined,
  'border border-green-500 text-green-500': props.type === 'success' && props.outlined,
  'border border-blue-500 text-blue-500': props.type === 'info' && props.outlined,
  'border border-yellow-500 text-yellow-500': props.type === 'warning' && props.outlined,
  'border border-red-500 text-red-500': props.type === 'danger' && props.outlined,
  'border border-purple-500 text-purple-500': props.type === 'purple' && props.outlined,
  'border border-pink-500 text-pink-500': props.type === 'pink' && props.outlined,
  'rounded': !props.rounded,
  'rounded-full': props.rounded,
  'px-3 py-1.5': props.size === 'large',
  'px-2 py-0.5': props.size === 'small',
}));
</script>
