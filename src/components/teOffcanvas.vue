<template>
  <dialog
    ref="dialogRef"
    class="offcanvas max-w-full te-raised bg-clip-padding shadow-sm outline-none te-text-body w-96"
    :class="positionClass"
    :aria-label="title || undefined"
    @close="onNativeClose"
    @click.self="onSelfClick"
  >
    <div class="offcanvas-header flex items-center justify-between p-4">
      <h5 class="offcanvas-title mb-0 leading-normal font-semibold">{{ title }}</h5>
      <button
        type="button"
        class="btn-close w-4 h-4 p-2 text-black opacity-50 hover:opacity-75 focus:opacity-100 focus:outline-none"
        aria-label="Close"
        @click="dialogRef?.close()"
      />
    </div>
    <div class="offcanvas-body grow p-4 overflow-y-auto">
      <slot name="default" />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { oneOf } from '../types';

defineOptions({ name: 'TeOffcanvas' });

const emit = defineEmits<{ close: [] }>();

const model = defineModel<boolean>({ default: false });

const props = defineProps({
  title: { type: String, default: '' },
  position: { ...oneOf(['right', 'left'] as const), default: 'left' },
});

const positionClass = computed(() => (props.position === 'left' ? 'offcanvas-start' : 'offcanvas-end'));

/* The backdrop used to be a sibling div with its own z-index, and the panel a
   v-show'd div toggled by a `.show` class — no Escape, no focus trap, and the
   page behind stayed tabbable. A native <dialog> in the top layer gives all
   three, so ::backdrop replaces the div and the `open` attribute replaces
   `.show`. */
const dialogRef = ref<HTMLDialogElement>();

function sync() {
  const el = dialogRef.value;
  if (!el) return;
  if (model.value && !el.open) el.showModal();
  else if (!model.value && el.open) el.close();
}

watch(model, sync, { flush: 'post' });
onMounted(sync);

function onNativeClose() {
  model.value = false;
  emit('close');
}

/* Unlike the modal, the <dialog> here *is* the panel, so a ::backdrop click
   and a click on the panel's own padding both arrive with the dialog as the
   target. The rect tells them apart. */
function onSelfClick(event: MouseEvent) {
  const rect = dialogRef.value?.getBoundingClientRect();
  if (!rect) return;
  const outside = event.clientX < rect.left || event.clientX > rect.right
    || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialogRef.value?.close();
}
</script>
