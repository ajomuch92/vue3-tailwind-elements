<template>
  <transition name="fade">
    <div v-show="visible" class="fixed py-4 px-3" :class="toastClass">
      <te-alert v-if="alert" :solid="alertSolid" :type="alertType" :text="alertText" />
      <te-toast v-else-if="type==='normal'" v-bind="toast" @close="close()"/>
      <te-toast-light v-else v-bind="toast"/>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { PropType } from 'vue';
import TeAlert from './teAlert.vue';
import teToast from './teToast.vue';
import TeToastLight from './teToastLight.vue';
import { oneOf, VARIANTS } from '../types';

defineOptions({ name: 'TeToastHandler' });

const emit = defineEmits<{ close: [] }>();

const props = defineProps({
  position: { ...oneOf(['bottom', 'top'] as const), default: 'bottom' },
  align: { ...oneOf(['right', 'center', 'left'] as const), default: 'center' },
  type: { ...oneOf(['normal', 'light'] as const), default: 'normal' },
  toast: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
  alert: { type: Boolean, default: false },
  alertType: { ...oneOf(VARIANTS), default: 'normal' },
  alertText: { type: String, default: '' },
  alertSolid: { type: Boolean, default: false },
});

const visible = ref(false);

const toastClass = computed(() => [
  props.position === 'bottom' ? 'bottom-0' : 'top-0',
  props.align === 'center' ? 'left-1/2 -translate-x-1/2' : props.align === 'left' ? 'left-0' : 'right-0',
]);

onMounted(() => {
  requestAnimationFrame(() => { visible.value = true; });
});

/* `$destroy()` is gone in Vue 3; the app that mounted this instance tears it
   down instead, so the handler only reports that it is finished. */
function close() {
  visible.value = false;
  emit('close');
}

defineExpose({ close });
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity  .5s;
  }

  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }

  div.fixed {
    z-index: 9999;
  }
</style>