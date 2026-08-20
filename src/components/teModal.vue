<template>
  <Teleport to="body">
    <div
      v-show="model"
      class="modal fixed top-0 left-0 w-full h-full outline-none overflow-x-hidden overflow-y-auto"
      tabindex="-1"
      role="dialog"
      :aria-hidden="!model"
      :aria-label="title"
      @click.self="closeOnBackdrop && close()"
    >
      <Transition name="te-modal">
        <div
          v-show="model"
          class="modal-dialog relative w-auto pointer-events-none"
          :class="[sizeClass, {'modal-dialog-scrollable': scrollable, 'modal-dialog-centered': centered}]"
        >
          <div class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div v-if="!hideHeader" class="modal-header flex shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <slot name="header">
                <h5 class="text-xl font-medium leading-normal text-gray-800">{{ title }}</h5>
              </slot>
              <button
                v-if="showCloseButton"
                type="button"
                class="btn-close w-4 h-4 p-1 text-black opacity-50 hover:opacity-75 focus:opacity-100 focus:outline-none"
                aria-label="Close"
                @click="close()"
              />
            </div>
            <div class="modal-body relative p-4">
              <component :is="component" v-if="component" v-bind="componentProps" v-on="componentEvents" />
              <slot v-else name="default" />
            </div>
            <div v-if="!hideFooter" class="modal-footer flex shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component, PropType } from 'vue';
import { oneOf } from '../types';

defineOptions({ name: 'TeModal' });

const emit = defineEmits<{ close: [] }>();

/* Was a `visible` prop plus a manual `update:visible` emit; `v-model:visible`
   is the Vue 3 spelling of the same contract. */
const model = defineModel<boolean>('visible', { default: false });

const props = defineProps({
  title: { type: String, default: '' },
  showCloseButton: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: true },
  hideHeader: { type: Boolean, default: false },
  hideFooter: { type: Boolean, default: false },
  scrollable: { type: Boolean, default: false },
  centered: { type: Boolean, default: false },
  size: { ...oneOf(['', 'sm', 'lg', 'xl'] as const), default: '' },
  component: { type: [Object, Function, String] as PropType<Component | string>, default: undefined },
  componentProps: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
  componentEvents: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
});

const sizeClass = computed(() => (props.size ? `modal-${props.size}` : ''));

/* The old version called `this.$destroy()` and removed its own element, an
   API Vue 3 does not have. Closing is just the model now. */
function close() {
  model.value = false;
  emit('close');
}
</script>

<style scoped>
  .te-modal-enter-active,
  .te-modal-leave-active {
    transition: transform 0.25s ease, opacity 0.25s ease;
  }

  .te-modal-enter-from,
  .te-modal-leave-to {
    transform: translateY(-50px);
    opacity: 0;
  }
</style>
