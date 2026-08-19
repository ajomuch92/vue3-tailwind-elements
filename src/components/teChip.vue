<template>
  <span class="chip" :class="[type, size, imgUrl ? 'pr-4': 'px-4']">
    <img v-if="imgUrl" class="rounded-full max-w-none mr-2" :src="imgUrl" :class="[sizeClass, widthImgClass]" />
    <slot />
    <button v-if="closable" class="bg-transparent hover focus:outline-none" @click="emit('close', $event)">
      <slot name="icon">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times"
          class="w-3 ml-3" role="img" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 352 512">
          <path fill="currentColor"
            d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z">
          </path>
        </svg>
      </slot>
    </button>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { oneOf, SIZES, VARIANTS } from '../types';

defineOptions({ name: 'TeChip' });

const emit = defineEmits<{ close: [event: MouseEvent] }>();

const props = defineProps({
  type: { ...oneOf(VARIANTS), default: 'light' },
  size: { ...oneOf(SIZES), default: 'medium' },
  closable: { type: Boolean, default: false },
  imgUrl: { type: String, default: '' },
});

const sizeClass = computed(() => ({
  'h-9': props.size === 'small',
  'h-11': props.size === 'medium',
  'h-14': props.size === 'large',
}));

const widthImgClass = computed(() => ({
  'w-9': props.size === 'small',
  'w-11': props.size === 'medium',
  'w-14': props.size === 'large',
}));
</script>
