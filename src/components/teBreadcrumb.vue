<template>
  <nav class="rounded-md w-full">
    <ol class="list-reset flex">
      <template v-for="(option, key) in options" :key="key">
        <li v-if="key < options.length - 1">
          <component :is="linkTag" v-bind="getBindValues(option)" class="text-blue-600 hover:text-blue-700">{{option.label}}</component>
        </li>
        <li v-else class="text-gray-500">{{option.label}}</li>
        <li v-if="key < options.length - 1"><span class="text-gray-500 mx-2">{{separator}}</span></li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { oneOf, type BreadcrumbOption } from '../types';

defineOptions({ name: 'TeBreadcrumb' });

const props = defineProps({
  options: {
    type: Array as PropType<BreadcrumbOption[]>,
    default: () => [],
  },
  separator: { ...oneOf(['/', '\\', '>'] as const), default: '/' },
  linkTag: { ...oneOf(['a', 'router-link', 'nuxt-link'] as const), default: 'a' },
});

function getBindValues(option: BreadcrumbOption) {
  return props.linkTag === 'a' ? { href: option.href } : { to: option.to };
}
</script>
