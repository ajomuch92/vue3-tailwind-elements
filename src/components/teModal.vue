<template>
  <dialog
    ref="dialogRef"
    class="modal"
    :aria-label="title || undefined"
    @close="onNativeClose"
    @click.self="closeOnBackdrop && dialogRef?.close()"
  >
    <div
      class="modal-dialog relative w-auto pointer-events-none"
      :class="[sizeClass, {'modal-dialog-scrollable': scrollable, 'modal-dialog-centered': centered}]"
    >
      <div class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto te-raised bg-clip-padding rounded-md outline-none text-current">
        <div v-if="!hideHeader" class="modal-header flex shrink-0 items-center justify-between p-4 border-b te-border rounded-t-md">
          <slot name="header">
            <h5 class="text-xl font-medium leading-normal te-text-soft">{{ title }}</h5>
          </slot>
          <button
            v-if="showCloseButton"
            type="button"
            class="btn-close w-4 h-4 p-1 text-black opacity-50 hover:opacity-75 focus:opacity-100 focus:outline-none"
            aria-label="Close"
            @click="dialogRef?.close()"
          />
        </div>
        <div class="modal-body relative p-4">
          <component :is="component" v-if="component" v-bind="componentProps" v-on="componentEvents" />
          <slot v-else name="default" />
        </div>
        <div v-if="!hideFooter" class="modal-footer flex shrink-0 flex-wrap items-center justify-end p-4 border-t te-border rounded-b-md">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
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

/* Was a <Teleport> into <body> around a v-show div with a hand-rolled scrim
   and z-index: 60. A native <dialog> opened with showModal() renders in the
   top layer instead, which brings Escape, a focus trap, focus restored to the
   trigger on close, ::backdrop and an inert page for free — none of which the
   old markup had. */
const dialogRef = ref<HTMLDialogElement>();

function sync() {
  const el = dialogRef.value;
  if (!el) return;
  if (model.value && !el.open) el.showModal();
  else if (!model.value && el.open) el.close();
}

watch(model, sync, { flush: 'post' });
onMounted(sync);

/* Every close path — the button, the backdrop, Escape, a parent setting the
   model to false — ends in the dialog's own `close` event, so the model write
   and the emit live here once instead of in each handler. */
function onNativeClose() {
  model.value = false;
  emit('close');
}
</script>
