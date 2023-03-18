<template>
  <div class="accordion" :class="{'accordion-flush': flush }">
    <div 
      v-for="(item, key) in items"
      :key="key" 
      class="accordion-item bg-white border border-gray-200"
      :class="{
        'border-l-0 border-r-0 rounded-none': flush,
        'border-t-0': flush && key === 0,
        'border-b-0': flush && key === items.length - 1,
      }"
    >
      <h2 class="accordion-header mb-0">
        <button
          class="
            accordion-button
            relative
            flex
            items-center
            w-full
            py-4
            px-5
            text-base text-gray-800 text-left
            bg-white
            border-0
            rounded-none
            transition
            focus:outline-none
          "
          :class="{'collapsed': !itemsOpened.includes(key)}"
          type="button"
          @click="toggle(key)"
        >
          <slot v-bind:title="item" :name="`header-${key+1}`">
            {{item}}
          </slot>
        </button>
      </h2>
      <div
        :ref="refs[key]"
        :id="`collapse-${key}`"
        class="accordion-collapse"
        :class="{'border-0': flush}"
        :style="getItemStyle(key)"
      >
        <div class="accordion-body py-4 px-5">
          <slot :name="`content-${key+1}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, toRefs, defineProps } from 'vue';

const props = defineProps({
  items: {
    type: Array<any>,
    default: () => [],
  },
  flush: {
    type: Boolean,
    default: false,
  },
  singleOpen: {
    type: Boolean,
    default: false,
  }
});

const itemsOpened = ref([]);
const isMounted = ref(false);
const refs = ref([]);

const { singleOpen } = toRefs(props);

onMounted(() => {
  isMounted.value = true;
});

watch(singleOpen, () => {
  itemsOpened.value = [];
});

function toggle(key: number) {
  if (!itemsOpened.value.includes(key)) {
    if (props.singleOpen) itemsOpened.value = [];
    itemsOpened.value.push(key);
  } else {
    const index = itemsOpened.value.indexOf(key)
    itemsOpened.value.splice(index, 1);
  }
}

function getItemStyle(key: number) {
  if (!isMounted.value) return {};
  const ref = refs.value[key];
  return itemsOpened.value.includes(key) ? { maxHeight: `${ref.scrollHeight}px` } : {}
}
</script>

<style scoped>
  .accordion-collapse {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
  }
</style>