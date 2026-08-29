<template>
  <div class="accordion" :class="{'accordion-flush': flush }">
    <div 
      v-for="(item, key) in items"
      :key="key" 
      class="accordion-item te-surface border te-border"
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
            text-base te-text-soft text-left
            border-0
            rounded-none
            transition
            focus:outline-none
          "
          :class="{'collapsed': !itemsOpened.includes(key)}"
          type="button"
          :aria-expanded="itemsOpened.includes(key)"
          :aria-controls="`collapse-${key}`"
          @click="toggle(key)"
        >
          <slot :title="item" :name="`header-${key+1}`">
            {{item}}
          </slot>
        </button>
      </h2>
      <div
        :id="`collapse-${key}`"
        class="accordion-collapse"
        :class="{'border-0': flush, 'is-open': itemsOpened.includes(key)}"
      >
        <div class="accordion-clip">
          <div class="accordion-body py-4 px-5">
            <slot :name="`content-${key+1}`" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { PropType } from 'vue';

defineOptions({ name: 'TeAccordion' });

const emit = defineEmits<{
  open: [key: number];
  close: [key: number];
}>();

const props = defineProps({
  items: { type: Array as PropType<unknown[]>, default: () => [] },
  flush: { type: Boolean, default: false },
  singleOpen: { type: Boolean, default: false },
  defaultOpen: { type: Array as PropType<number[]>, default: () => [] },
});

const itemsOpened = ref<number[]>([...props.defaultOpen]);

const singleOpen = computed(() => props.singleOpen);

watch(singleOpen, () => {
  itemsOpened.value = [];
});

function toggle(key: number) {
  const index = itemsOpened.value.indexOf(key);
  if (index === -1) {
    itemsOpened.value = props.singleOpen ? [key] : [...itemsOpened.value, key];
    emit('open', key);
  } else {
    itemsOpened.value.splice(index, 1);
    emit('close', key);
  }
}
</script>

<style scoped>
  /* Grid 0fr -> 1fr animates to the content's natural height with no JS measuring. */
  .accordion-collapse {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.2s ease-out;
  }

  .accordion-collapse.is-open {
    grid-template-rows: 1fr;
  }

  /* The clipping element must carry no padding of its own: `overflow` clips at
     the padding box, so padding here would set a floor on the collapsed height
     and leave a strip of content showing. The padding lives on .accordion-body
     inside it. */
  .accordion-clip {
    overflow: hidden;
    min-height: 0;
  }
</style>
