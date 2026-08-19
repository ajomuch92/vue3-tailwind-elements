<template>
  <ul class="bg-white rounded-lg inline-block text-gray-900" :class="{'border border-gray-200': !flush}">
    <li 
      v-for="(item, key) in normalizedItems"
      :key="key" 
      class="px-6 py-2 w-full"
      :class="{
        'rounded-t-lg': key===0,
        'rounded-b-lg': key===normalizedItems.length-1,
        'bg-blue-600 text-white': key===model,
        'text-gray-400 pointer-events-none': item.disabled,
        'cursor-pointer': clickable,
        'hover:bg-gray-100': clickable && key!==model,
        'border-b border-gray-200': key<normalizedItems.length-1
      }"
      @click="clickHandler(key)"
    >
      <slot :name="item.name || `item-${key}`">
        {{item.label}}
      </slot>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { ListGroupItem } from '../types';

defineOptions({ name: 'TeListGroup' });

const model = defineModel<number | null>('activeItem', { default: null });

const props = defineProps({
  items: { type: Array as PropType<(ListGroupItem | string)[]>, required: true },
  clickable: { type: Boolean, default: true },
  flush: { type: Boolean, default: false },
});

/** Accepts plain strings or item objects; the template only ever sees objects. */
const normalizedItems = computed<ListGroupItem[]>(() =>
  props.items.map((item) => (typeof item === 'string' ? { label: item } : item))
);

function clickHandler(index: number) {
  if (props.clickable) {
    model.value = index;
  }
}
</script>
