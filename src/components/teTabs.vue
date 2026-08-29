<template>
  <div class="tabs-container" :class="{'flex items-start': vertical}">
    <ul
      ref="tablist"
      class="nav flex flex-col flex-wrap list-none border-b-0 pl-0 mb-3"
      :class="{'md:flex-row': !vertical, 'nav-tabs': !pills, 'nav-pills': pills}"
      role="tablist"
      :aria-orientation="vertical ? 'vertical' : 'horizontal'"
    >
      <li
        v-for="(title, key) in normalizedTitles"
        :key="key"
        class="nav-item"
        :class="navItemClass"
        role="presentation"
      >
        <!-- Only wrap in te-notification when there is one; a plain span keeps
             the markup shape identical otherwise. -->
        <component
          :is="title.notification ? TeNotification : 'span'"
          v-bind="title.notification ?? {}"
          class="block"
          style="margin: 0px;"
        >
          <button
            :id="tabId(key)"
            type="button"
            role="tab"
            class="
              nav-link block font-medium text-xs leading-tight uppercase
              border-x-0 border-t-0 border-b-2 border-transparent
              px-6 py-3 my-2 cursor-pointer w-full
            "
            :class="{
              'cursor-not-allowed pointer-events-none opacity-50': title.disabled,
              'active': key === model,
              'hover:border-transparent hover:bg-gray-100 focus:border-transparent': !pills,
              'focus:outline-none rounded': pills,
            }"
            :aria-selected="key === model"
            :aria-controls="panelId(key)"
            :disabled="title.disabled"
            :tabindex="key === model ? 0 : -1"
            @click="model = key"
            @keydown="onKeydown"
          >
            {{ title.label }}
          </button>
        </component>
      </li>
    </ul>
    <div class="content relative w-full overflow-hidden">
      <template v-for="index in normalizedTitles.length" :key="index">
        <div
          v-show="index - 1 === model"
          :id="panelId(index - 1)"
          class="tab-panel relative float-left w-full"
          role="tabpanel"
          :aria-labelledby="tabId(index - 1)"
          tabindex="0"
        >
          <slot :name="`tab-${index}`" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import type { PropType } from 'vue';
import TeNotification from './teNotification.vue';
import { edgeIndex, stepIndex } from '../composables/keyboard';

defineOptions({ name: 'TeTabs' });

export interface TabTitle {
  label?: string;
  disabled?: boolean;
  notification?: Record<string, unknown>;
}

const model = defineModel<number>({ default: 0 });

const props = defineProps({
  titles: { type: Array as PropType<(TabTitle | string)[]>, required: true },
  filled: { type: Boolean, default: false },
  vertical: { type: Boolean, default: false },
  pills: { type: Boolean, default: false },
});

/* Accepts plain strings or objects, so the template only handles objects. */
const normalizedTitles = computed<TabTitle[]>(() =>
  props.titles.map((t) => (typeof t === 'string' ? { label: t } : { ...t, label: t.label ?? '' }))
);

const navItemClass = computed(() => ({
  'flex-auto text-center': props.filled,
  'flex-grow text-center': props.vertical,
  'mx-1': props.pills && !props.vertical,
}));

/* The ids were `tab-0`, `tab-content-0`… — global, so two sets of tabs on one
   page pointed every aria-controls at the first of them. */
const uid = useId();
const tabId = (index: number) => `${uid}-tab-${index}`;
const panelId = (index: number) => `${uid}-panel-${index}`;

const tablist = ref<HTMLElement | null>(null);

/* Only one tab is in the tab order (the selected one); the rest are reached
   with the arrow keys, as the tablist pattern asks. */
function activate(index: number) {
  if (index === -1 || index === model.value) return;
  model.value = index;
  tablist.value?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[index]?.focus();
}

function onKeydown(event: KeyboardEvent) {
  const disabled = (index: number) => !!normalizedTitles.value[index]?.disabled;
  const count = normalizedTitles.value.length;
  const [next, previous] = props.vertical
    ? ['ArrowDown', 'ArrowUp']
    : ['ArrowRight', 'ArrowLeft'];

  let target: number | undefined;
  if (event.key === next) target = stepIndex(model.value, 1, count, disabled);
  else if (event.key === previous) target = stepIndex(model.value, -1, count, disabled);
  else if (event.key === 'Home') target = edgeIndex(count, 1, disabled);
  else if (event.key === 'End') target = edgeIndex(count, -1, disabled);
  if (target === undefined) return;

  event.preventDefault();
  activate(target);
}
</script>

<style scoped>
  /* No <Transition> here: it is single-element only, and wrapping a v-for in
     one leaves the outgoing panel without its display:none. */

  .tab-panel {
    display: block;
    margin-right: -100%;
    backface-visibility: hidden;
    min-height: inherit;
  }
</style>
