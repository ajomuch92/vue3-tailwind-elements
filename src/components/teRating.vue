<template>
  <div class="flex items-center" :class="[gapClass, {'pointer-events-none opacity-70': disabled}]">
    <te-icon
      v-if="clearable"
      name="eraser"
      class="cursor-pointer text-red-500 opacity-60 hover:opacity-100"
      :class="iconSizeClass"
      @click="pick(0)"
    />
    <span v-for="key in quantity" :key="key" class="relative inline-flex">
      <te-icon
        class="cursor-pointer text-gray-400 opacity-60 hover:opacity-100"
        :class="iconSizeClass"
        :name="icon"
        :style="starStyle(key)"
        @mouseover="hoverIndex = key"
        @mouseout="hoverIndex = 0"
        @click="pick(key)"
      />
      <span
        v-if="hasHalfValues"
        class="icon-half"
        @mouseover="hoverIndex = key - 0.5"
        @mouseout="hoverIndex = 0"
        @click="pick(key - 0.5)"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import teIcon from './teIcon.vue';

defineOptions({ name: 'TeRating' });

const model = defineModel<number>({ default: 0 });

const props = defineProps({
  quantity: { type: Number, default: 5 },
  icon: { type: String, default: 'star-fill' },
  iconSizeClass: { type: String, default: 'text-xl' },
  /* Was interpolated into `mx-${spacing}`; Tailwind never sees a class built
     at runtime, so the spacing silently did nothing. */
  spacing: { type: Number, default: 1, validator: (v: unknown) => typeof v === 'number' && v >= 0 && v < 6 },
  disabled: { type: Boolean, default: false },
  color: { type: String, default: 'gold' },
  hasHalfValues: { type: Boolean, default: true },
  clearable: { type: Boolean, default: false },
});

const hoverIndex = ref(0);

const gapClass = computed(() => ['gap-0', 'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5'][props.spacing] ?? 'gap-1');

const half = computed(() => ({
  backgroundImage: `linear-gradient(90deg, ${props.color} 50%, #929292 50%)`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  opacity: 1,
}));

/** Hovering previews a value; otherwise the bound one is shown. */
function starStyle(index: number) {
  const reference = hoverIndex.value || model.value;
  if (index <= reference) return { opacity: 1, color: props.color };
  if (index - 0.5 === reference) return half.value;
  return {};
}

function pick(index: number) {
  if (!props.disabled) model.value = index;
}
</script>

<style scoped>
  .icon-half {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background-color: transparent;
  }
</style>
