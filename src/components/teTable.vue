<template>
  <div>
    <div class="table-container min-w-full" :class="{'overflow-x-auto': responsive, 'overflow-hidden': !responsive, 'relative': loading}">
      <table class="min-w-full" :class="{'text-center': centered, 'border': bordered}">
        <thead :class="{'border-b': !borderless, ...headerBackgroundClass}">
          <tr>
            <th v-if="showRowNum" class="text-sm font-medium" :class="{'text-left': !centered, ...headerCellClass, ...paddingClass}">{{rowNumLabel}}</th>
            <th v-for="(header, key) in normalizedHeaders" :key="key" scope="col" class="text-sm font-medium px-6" :class="{'text-left': !centered, ...headerCellClass, ...paddingClass}">
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="hasSubheading">
            <slot name="subheading" />
          </tr>
          <template v-if="filteredItems.length>0">
            <tr v-for="(item, key) in filteredItems" :key="key" :class="rowClass(key)" v-show="rowVisibility(key+1)">
              <td v-if="showRowNum" class="text-sm text-gray-900 font-medium" :class="[paddingClass, {'border-r': bordered}]">{{key+1}}</td>
              <td v-for="(header, index) in normalizedHeaders" :key="index" class="text-sm text-gray-900 font-medium px-6 whitespace-nowrap" :class="[{...paddingClass, 'border-r': bordered}, header.cellClass]">
                <slot :name="header.field" :value="getCellValue(item, header)" :row="item" :index="key">
                  {{getCellValue(item, header)}}
                </slot>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td class="text-sm text-slate-500 font-medium px-6 whitespace-nowrap text-center" :class="[{...paddingClass, 'border-r': bordered}]" :colspan="normalizedHeaders.length + (showRowNum ? 1 : 0)">
                <slot name="no-data">
                  {{noDataLabel}}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <div v-if="loading" class="h-full w-full bg-gray-50 rounded opacity-70 flex justify-center items-center absolute top-0 left-0 z-50">
        <te-spinner size="large" />
      </div>
    </div>
    <te-pagination
      v-if="itemPerPage>0"
      class="my-1"
      v-model:active-page="activePage"
      :pages="pages"
      :pages-to-show="pages"
      :position="paginationAlign"
      :label-next="labelNext"
      :label-prev="labelPrev"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { PropType } from 'vue';
import tePagination from './tePagination.vue';
import TeSpinner from './teSpinner.vue';
import { oneOf } from '../types';

defineOptions({ name: 'TeTable' });

export interface TableHeader {
  label?: string;
  field?: string;
  cellClass?: string;
}

type Row = Record<string, unknown>;

const emit = defineEmits<{ 'page-changed': [page: number] }>();

const props = defineProps({
  items: { type: Array as PropType<Row[]>, required: true },
  headers: { type: Array as PropType<(TableHeader | string)[]>, required: true },
  striped: { type: Boolean, default: false },
  hoverable: { type: Boolean, default: false },
  bordered: { type: Boolean, default: false },
  centered: { type: Boolean, default: false },
  borderless: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
  responsive: { type: Boolean, default: true },
  headerType: { ...oneOf(['normal', 'light', 'dark'] as const), default: 'normal' },
  search: { type: String, default: '' },
  noDataLabel: { type: String, default: 'No Data' },
  hasSubheading: { type: Boolean, default: false },
  showRowNum: { type: Boolean, default: false },
  rowNumLabel: { type: String, default: '#' },
  itemPerPage: { type: Number, default: -1 },
  /** Set when the server already returns one page at a time. */
  backendPagination: { type: Boolean, default: false },
  totalItems: { type: Number, default: 0 },
  paginationAlign: { ...oneOf(['left', 'center', 'right'] as const), default: 'right' },
  labelNext: { type: String, default: 'Next' },
  labelPrev: { type: String, default: 'Prev.' },
  loading: { type: Boolean, default: false },
});

const activePage = ref(1);

watch(activePage, (page) => emit('page-changed', page));
watch(() => [props.search, props.items] as const, () => { activePage.value = 1; });

/* The original file shipped no `computed` block at all: the template read
   filteredItems, pages, headerBackgroundClass, headerCellClass and
   paddingClass, none of which existed, so it threw on first render. */
const normalizedHeaders = computed(() =>
  props.headers.map((h) =>
    typeof h === 'string'
      ? { field: h, label: h, cellClass: '' }
      : { field: h.field ?? h.label ?? '', label: h.label ?? h.field ?? '', cellClass: h.cellClass ?? '' }
  )
);

const headerKeys = computed(() => normalizedHeaders.value.map((h) => h.field));

const filteredItems = computed(() => {
  const term = props.search.trim().toLowerCase();
  if (!term) return props.items;
  return props.items.filter((item) =>
    headerKeys.value.some((key) => String(item[key] ?? '').toLowerCase().includes(term))
  );
});

const pages = computed(() => {
  if (props.itemPerPage <= 0) return 0;
  const total = props.backendPagination ? props.totalItems : filteredItems.value.length;
  return Math.max(Math.ceil(total / props.itemPerPage), 1);
});

const headerBackgroundClass = computed(() => ({
  'bg-white': props.headerType === 'normal',
  'bg-gray-100': props.headerType === 'light',
  'bg-gray-800': props.headerType === 'dark',
}));

const headerCellClass = computed(() => ({
  'text-gray-900': props.headerType !== 'dark',
  'text-white': props.headerType === 'dark',
}));

const paddingClass = computed(() => ({
  'px-6 py-4': !props.compact,
  'px-3 py-2': props.compact,
}));

function rowClass(index: number) {
  return {
    'border-b': !props.borderless,
    'bg-gray-50': index % 2 === 0 && props.striped,
    'bg-white': index % 2 === 1 && props.striped,
    'transition duration-300 ease-in-out hover:bg-gray-100': props.hoverable,
  };
}

function rowVisibility(index: number) {
  if (props.backendPagination || props.itemPerPage <= 0) return true;
  const last = activePage.value * props.itemPerPage;
  return index > last - props.itemPerPage && index <= last;
}

function getCellValue(item: Row, header: { field: string }) {
  return item[header.field];
}
</script>
