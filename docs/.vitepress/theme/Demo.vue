<template>
  <div class="my-4 rounded-lg border border-[var(--vp-c-divider)] p-4">
    <div :class="block ? 'flex flex-col gap-3' : 'flex flex-wrap items-center gap-3'">
      <slot />
    </div>
    <p v-if="note" class="mt-3 text-sm text-[var(--vp-c-text-2)]">{{ note }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  block: { type: Boolean, default: false },
  note: { type: String, default: '' },
});
</script>
