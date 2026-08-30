<template>
  <div class="overflow-hidden card" :class="{'shadow-md rounded-md': !shadowless}">
    <div v-if="hasHeader" class="py-3 px-6 border-b te-border-strong text-center">
      <slot name="header" />
    </div>
    <img
      v-if="imgSrc"
      :src="imgSrc"
      class="mb-4"
      :class="{'rounded-lg shadow-xl': shadowless}"
    />
    <div class="p-5">
      <h5 v-if="title" class="text-xl font-semibold mb-2">
        <slot name="title">{{ title }}</slot>
      </h5>
      <slot name="default"></slot>
    </div>
    <div v-if="hasFooter" class="py-3 px-6 border-t te-border-strong te-text-mild text-center">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'TeCard' });

const props = defineProps({
  imgSrc: { type: String, default: '' },
  width: { type: [String, Number], default: '350px' },
  hasHeader: { type: Boolean, default: false },
  hasFooter: { type: Boolean, default: false },
  shadowless: { type: Boolean, default: false },
  title: { type: String, default: '' },
});

const widthComputed = computed(() => typeof props.width === 'string' ? props.width : `${props.width}px`);
</script>

<style scoped>
.card {
  width: v-bind(widthComputed);
}
</style>