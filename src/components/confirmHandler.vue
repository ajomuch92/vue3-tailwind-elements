<template>
  <te-modal
    v-model:visible="open"
    :title="title"
    :centered="centered"
    :size="size"
    :show-close-button="showCloseButton"
    :close-on-backdrop="closeOnBackdrop"
    @close="emit('resolve', answer)"
  >
    <p class="confirm-message">{{ message }}</p>
    <template #footer>
      <te-button type="light" size="small" class="mr-2" @click="settle(false)">{{ cancelLabel }}</te-button>
      <te-button :type="type" size="small" @click="settle(true)">{{ confirmLabel }}</te-button>
    </template>
  </te-modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TeButton from './teButton.vue';
import TeModal from './teModal.vue';
import { oneOf, VARIANTS } from '../types';

defineOptions({ name: 'TeConfirmHandler' });

const emit = defineEmits<{ resolve: [answer: boolean] }>();

defineProps({
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Confirm' },
  cancelLabel: { type: String, default: 'Cancel' },
  type: { ...oneOf(VARIANTS), default: 'primary' },
  centered: { type: Boolean, default: true },
  size: { ...oneOf(['', 'sm', 'lg', 'xl'] as const), default: 'sm' },
  showCloseButton: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: true },
});

const open = ref(false);

/* Every way out — the buttons, Escape, the backdrop, the close button — ends in
   the dialog's `close` event, so the answer is recorded first and the promise
   is settled from that one place. Anything but the confirm button is a no. */
const answer = ref(false);

function settle(value: boolean) {
  answer.value = value;
  open.value = false;
}

/* Opened after mount so the dialog animates in, rather than being open in the
   frame it appears. */
onMounted(() => { open.value = true; });
</script>
