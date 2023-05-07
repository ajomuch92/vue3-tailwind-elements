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
        ref="collapseRefs[key]"
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

<script>
  export default {
    name: 'TeAccordion'
  }
</script>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';

const emit = defineEmits(['open', 'close']);

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  flush: {
    type: Boolean,
    default: false,
  },
  singleOpen: {
    type: Boolean,
    default: false,
  },
  defaultOpen: {
    type: Array,
    default: () => [],
  }
});

const itemsOpened = ref([]);
const isMounted = ref(false);
const collapseRefs = ref([]);

onMounted(() => {
  isMounted.value = true;
  itemsOpened.value = props.defaultOpen;
});

const singleOpen = computed(() => props.singleOpen);

watch(singleOpen, () => {
  itemsOpened.value = [];
});

function toggle(key) {
  if (!itemsOpened.value.includes(key)) {
    if (singleOpen.value) itemsOpened.value = [];
    itemsOpened.value.push(key);
    emit('open', key);
  } else {
    const index = itemsOpened.value.indexOf(key)
    itemsOpened.value.splice(index, 1);
    emit('close', key);
  }
}

function getItemStyle(key) {
  if (!isMounted.value) return {};
  const ref = collapseRefs[key];
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