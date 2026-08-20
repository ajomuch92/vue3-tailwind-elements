<template>
  <div class="flex" :class="alignClass">
    <nav :aria-label="ariaLabel">
      <ul class="flex list-none p-0 m-0">
        <li class="page-item">
          <button
            type="button"
            class="page-link prev"
            :class="[size, {'pointer-events-none opacity-50 select-none': model <= 1 || pages === 0}]"
            :disabled="model <= 1 || pages === 0"
            @click="go(model - 1)"
          >
            <span v-if="!showIcons">{{ labelPrev }}</span>
            <span v-else aria-hidden="true">&laquo;</span>
          </button>
        </li>
        <li v-for="page in displayedPages" :key="page" class="page-item">
          <button
            type="button"
            class="page-link"
            :class="[size, { active: page === model, inactive: page !== model, 'rounded-full': rounded }]"
            :aria-current="page === model ? 'page' : undefined"
            @click="go(page)"
          >
            {{ page }}
          </button>
        </li>
        <li class="page-item">
          <button
            type="button"
            class="page-link next"
            :class="[size, {'pointer-events-none opacity-50 select-none': model >= pages || pages === 0}]"
            :disabled="model >= pages || pages === 0"
            @click="go(model + 1)"
          >
            <span v-if="!showIcons">{{ labelNext }}</span>
            <span v-else aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { oneOf, SIZES } from '../types';

defineOptions({ name: 'TePagination' });

/* Was `activePage` + `.sync`, which Vue 3 removed. */
const model = defineModel<number>('activePage', { default: 1 });

const props = defineProps({
  pages: { type: Number, default: 3 },
  pagesToShow: { type: Number, default: 3 },
  showIcons: { type: Boolean, default: false },
  rounded: { type: Boolean, default: false },
  size: { ...oneOf(SIZES), default: 'medium' },
  position: { ...oneOf(['left', 'center', 'right'] as const), default: 'center' },
  labelNext: { type: String, default: 'Next' },
  labelPrev: { type: String, default: 'Prev.' },
  ariaLabel: { type: String, default: 'Pagination' },
});

const alignClass = computed(() => ({
  'justify-center': props.position === 'center',
  'justify-end': props.position === 'right',
  /* The old class map tested for 'lett', so left alignment never applied. */
  'justify-start': props.position === 'left',
}));

/* Derived rather than kept in `data` and patched by three watchers: the window
   slides to keep the current page inside it and never runs past `pages`. */
const displayedPages = computed(() => {
  const span = Math.min(Math.max(props.pagesToShow, 1), Math.max(props.pages, 1));
  if (props.pages <= 0) return [];
  let start = Math.min(Math.max(model.value - Math.floor(span / 2), 1), Math.max(props.pages - span + 1, 1));
  start = Math.max(start, 1);
  return Array.from({ length: Math.min(span, props.pages) }, (_, i) => start + i);
});

function go(page: number) {
  const next = Math.min(Math.max(page, 1), Math.max(props.pages, 1));
  if (next !== model.value) model.value = next;
}
</script>
