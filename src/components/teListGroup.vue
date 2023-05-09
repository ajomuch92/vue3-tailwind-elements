<template>
  <ul class="bg-white rounded-lg inline-block text-gray-900" :class="{'border border-gray-200': !flush}">
    <li 
      v-for="(item, key) in items"
      :key="key" 
      class="px-6 py-2 w-full"
      :class="{
        'rounded-t-lg': key===0,
        'rounded-b-lg': key===items.length-1,
        'bg-blue-600 text-white': key===currentActiveItem,
        'text-gray-400 pointer-events-none': item.disabled,
        'cursor-pointer': clickable,
        'hover:bg-gray-100': clickable && key!==currentActiveItem,
        'border-b border-gray-200': key<items.length-1
      }"
      @click="clickHandler(key)"
    >
      <slot :name="item.name||`item-${key}`">
        {{item.label||item}}
      </slot>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'teListGroup',
}
</script>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['update:activeItem']);

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  clickable: {
    type: Boolean,
    default: true,
  },
  activeItem: {
    type: Number,
    default: null,
  },
  flush: {
    type: Boolean,
    default: false,
  }
});

const currentActiveItem = ref(undefined);

watch(currentActiveItem, (val) => {
  emit('update:activeItem', val);
});

watch(activeItem, (val) => {
  currentActiveItem.value = val;
});

function clickHandler(index) {
  if(props.clickable) {
    currentActiveItem.value = index;
  }
}
</script>
