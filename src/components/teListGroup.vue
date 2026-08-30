<template>
  <ul
    ref="list"
    class="te-surface rounded-lg inline-block te-text"
    :class="{'border te-border': !flush}"
    :role="clickable ? 'listbox' : undefined"
    @keydown="onKeydown"
  >
    <li
      v-for="(item, key) in normalizedItems"
      :key="key"
      class="px-6 py-2 w-full"
      :class="{
        'rounded-t-lg': key===0,
        'rounded-b-lg': key===normalizedItems.length-1,
        'bg-blue-600 text-white': key===model,
        'te-text-faint pointer-events-none': item.disabled,
        'cursor-pointer': clickable,
        'te-hover': clickable && key!==model,
        'border-b te-border': key<normalizedItems.length-1
      }"
      :role="clickable ? 'option' : undefined"
      :aria-selected="clickable ? key === model : undefined"
      :aria-disabled="clickable && item.disabled ? true : undefined"
      :tabindex="clickable && !item.disabled ? (key === focusIndex ? 0 : -1) : undefined"
      @click="clickHandler(key)"
    >
      <slot :name="item.name || `item-${key}`">
        {{item.label}}
      </slot>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { PropType } from 'vue';
import type { ListGroupItem } from '../types';
import { edgeIndex, stepIndex } from '../composables/keyboard';

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

const disabled = (index: number) => !!normalizedItems.value[index]?.disabled;

const list = ref<HTMLElement | null>(null);

/* Roving tabindex: the list is one stop in the tab order, and the arrows move
   inside it. The stop is the selection when there is one, the first item
   otherwise — never a disabled row, which cannot take focus. */
const focusIndex = ref(0);
const resetFocusIndex = () => {
  focusIndex.value = model.value !== null && !disabled(model.value)
    ? model.value
    : Math.max(edgeIndex(normalizedItems.value.length, 1, disabled), 0);
};
resetFocusIndex();
watch([model, normalizedItems], resetFocusIndex);

function focusItem(index: number) {
  if (index === -1) return;
  focusIndex.value = index;
  list.value?.querySelectorAll<HTMLElement>('[role="option"]')[index]?.focus();
}

function clickHandler(index: number) {
  if (props.clickable && !disabled(index)) {
    model.value = index;
  }
}

function onKeydown(event: KeyboardEvent) {
  if (!props.clickable) return;
  const count = normalizedItems.value.length;

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    clickHandler(focusIndex.value);
    return;
  }

  let target: number | undefined;
  if (event.key === 'ArrowDown') target = stepIndex(focusIndex.value, 1, count, disabled);
  else if (event.key === 'ArrowUp') target = stepIndex(focusIndex.value, -1, count, disabled);
  else if (event.key === 'Home') target = edgeIndex(count, 1, disabled);
  else if (event.key === 'End') target = edgeIndex(count, -1, disabled);
  if (target === undefined) return;

  /* Moving only moves focus. Selection stays deliberate, because the active
     item is what a parent routes or renders on. */
  event.preventDefault();
  focusItem(target);
}
</script>
