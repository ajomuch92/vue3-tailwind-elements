<template>
  <Teleport to="body">
    <div v-show="model" class="offcanvas-backdrop" @click="model = false" />
    <div
      class="offcanvas fixed bottom-0 flex flex-col max-w-full bg-white bg-clip-padding shadow-sm outline-none text-gray-700 border-none w-96"
      :class="getClass"
      role="dialog"
      :aria-hidden="!model"
      :aria-label="title || undefined"
    >
      <div class="offcanvas-header flex items-center justify-between p-4">
        <h5 class="offcanvas-title mb-0 leading-normal font-semibold">{{ title }}</h5>
        <button
          type="button"
          class="btn-close w-4 h-4 p-2 text-black opacity-50 hover:opacity-75 focus:opacity-100 focus:outline-none"
          aria-label="Close"
          @click="model = false"
        />
      </div>
      <div class="offcanvas-body grow p-4 overflow-y-auto">
        <slot name="default" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { oneOf } from '../types';

defineOptions({ name: 'TeOffcanvas' });

const model = defineModel<boolean>({ default: false });

const props = defineProps({
  title: { type: String, default: '' },
  position: { ...oneOf(['right', 'left'] as const), default: 'left' },
});

/* The backdrop used to be a div created with document.createElement and
   appended to `this.$parent.$el` — it broke whenever the parent was a
   fragment, and leaked if the component unmounted while open. It is part of
   the template now, teleported to <body>. */
const getClass = computed(() => ({
  'show': model.value,
  'offcanvas-start top-0 left-0': props.position === 'left',
  'offcanvas-end top-0 right-0': props.position === 'right',
}));
</script>
