<template>
  <div class="tabs-container" :class="{'flex items-start': vertical}">
    <ul
      class="nav flex flex-col flex-wrap list-none border-b-0 pl-0 mb-3"
      :class="{'md:flex-row': !vertical, 'nav-tabs': !pills, 'nav-pills': pills}"
      role="tablist"
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
            :id="`tab-${key}`"
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
            :aria-controls="`tab-content-${key}`"
            :disabled="title.disabled"
            @click="model = key"
          >
            {{ title.label }}
          </button>
        </component>
      </li>
    </ul>
    <div class="content relative w-full overflow-hidden">
      <slide-transition v-for="index in normalizedTitles.length" :key="index" :vertical="vertical">
        <div
          v-show="index - 1 === model"
          :id="`tab-content-${index - 1}`"
          class="tab-panel relative float-left w-full"
          role="tabpanel"
        >
          <slot :name="`tab-${index}`" />
        </div>
      </slide-transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import TeNotification from './teNotification.vue';
import SlideTransition from './transition/slideTransition.vue';

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
</script>

<style scoped>
  .tab-panel {
    display: block;
    margin-right: -100%;
    backface-visibility: hidden;
    min-height: inherit;
  }
</style>
