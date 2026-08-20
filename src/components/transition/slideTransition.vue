<template>
  <Transition :name="vertical ? 'te-slide-y' : 'te-slide-x'">
    <slot />
  </Transition>
</template>

<script setup lang="ts">
/*
 * te-tabs and te-stepper imported this from './transition/slideTransition.vue',
 * a path that did not exist, so neither component could be built. It is a thin
 * wrapper over <Transition>; the panels inside keep using v-show.
 */
defineOptions({ name: 'SlideTransition' });

defineProps({
  vertical: { type: Boolean, default: false },
});
</script>

<style scoped>
.te-slide-x-enter-active,
.te-slide-x-leave-active,
.te-slide-y-enter-active,
.te-slide-y-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.te-slide-x-enter-from { transform: translateX(1rem); opacity: 0; }
.te-slide-x-leave-to   { transform: translateX(-1rem); opacity: 0; }
.te-slide-y-enter-from { transform: translateY(1rem); opacity: 0; }
.te-slide-y-leave-to   { transform: translateY(-1rem); opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .te-slide-x-enter-active,
  .te-slide-x-leave-active,
  .te-slide-y-enter-active,
  .te-slide-y-leave-active {
    transition: none;
  }
}
</style>
