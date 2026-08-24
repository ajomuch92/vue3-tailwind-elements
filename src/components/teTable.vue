<template>
  <div>
    <div
      class="table-container min-w-full"
      :class="{'overflow-x-auto': responsive, 'overflow-hidden': !responsive, 'relative': loading, 'overflow-y-auto': maxHeight}"
      :style="maxHeight ? { maxHeight } : undefined"
    >
      <table class="min-w-full" :class="{'text-center': centered, 'border': bordered, 'table-fixed': hasWidths}">
        <thead :class="{'border-b': !borderless, 'table-sticky-head': stickyHeader, ...headerBackgroundClass}">
          <tr>
            <th
              v-if="selectable"
              class="table-select-cell text-sm font-medium"
              :class="[paddingClass, headerCellClass, pinClass(-2)]"
              :style="pinStyle(-2)"
            >
              <input
                type="checkbox"
                class="table-check"
                :checked="allSelected"
                :indeterminate="someSelected && !allSelected"
                :aria-label="labelSelectAll"
                @change="toggleAll(($event.target as HTMLInputElement).checked)"
              />
            </th>

            <th
              v-if="showRowNum"
              class="table-num-cell text-sm font-medium"
              :class="[{'text-left': !centered}, headerCellClass, paddingClass, pinClass(-1)]"
              :style="pinStyle(-1)"
            >{{rowNumLabel}}</th>

            <th
              v-for="(header, key) in orderedHeaders"
              :key="header.field"
              scope="col"
              class="text-sm font-medium px-6 relative"
              :class="[{'text-left': !centered}, headerCellClass, paddingClass, pinClass(key), { 'is-drop': dropTarget === header.field }]"
              :style="[pinStyle(key), widthStyle(header)]"
              :aria-sort="ariaSort(header)"
              @dragover="onHeaderDragOver(header, $event)"
              @dragleave="dropTarget = null"
              @drop="onHeaderDrop(header, $event)"
            >
              <span
                class="inline-flex items-center gap-1"
                :class="{ 'cursor-pointer select-none': isSortable(header), 'cursor-grab': reorderable }"
                :draggable="reorderable"
                @dragstart="onHeaderDragStart(header, $event)"
                @dragend="dropTarget = null"
                @click="toggleSort(header)"
              >
                {{ header.label }}
                <span v-if="isSortable(header)" class="table-sort" :class="sortDirOf(header)" aria-hidden="true">
                  <slot name="sort-icon" :header="header" :dir="sortDirOf(header)">
                    {{ sortDirOf(header) === 'asc' ? '▲' : sortDirOf(header) === 'desc' ? '▼' : '↕' }}
                  </slot>
                </span>
              </span>

              <span
                v-if="resizable"
                class="table-resizer"
                role="separator"
                aria-orientation="vertical"
                :aria-label="`${labelResize} ${header.label}`"
                draggable="false"
                @pointerdown="onResizeStart(header, $event)"
                @click.stop
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="hasSubheading">
            <slot name="subheading" />
          </tr>
          <template v-if="pageItems.length>0">
            <tr v-for="(item, key) in pageItems" :key="key" :class="rowClass(key)">
              <td
                v-if="selectable"
                class="table-select-cell text-sm"
                :class="[paddingClass, {'border-r': bordered}, pinClass(-2)]"
                :style="pinStyle(-2)"
              >
                <input
                  type="checkbox"
                  class="table-check"
                  :checked="isSelected(item)"
                  :aria-label="labelSelectRow"
                  @change="toggleRow(item, ($event.target as HTMLInputElement).checked)"
                />
              </td>

              <td
                v-if="showRowNum"
                class="table-num-cell text-sm text-gray-900 font-medium"
                :class="[paddingClass, {'border-r': bordered}, pinClass(-1)]"
                :style="pinStyle(-1)"
              >{{pageOffset + key + 1}}</td>

              <td
                v-for="(header, index) in orderedHeaders"
                :key="header.field"
                class="text-sm text-gray-900 font-medium px-6 whitespace-nowrap"
                :class="[{...paddingClass, 'border-r': bordered}, header.cellClass, pinClass(index)]"
                :style="[pinStyle(index), widthStyle(header)]"
              >
                <slot :name="header.field" :value="getCellValue(item, header)" :row="item" :index="pageOffset + key">
                  {{getCellValue(item, header)}}
                </slot>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td class="text-sm text-slate-500 font-medium px-6 whitespace-nowrap text-center" :class="[{...paddingClass, 'border-r': bordered}]" :colspan="columnCount">
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
import type { SortState, TableSelection } from '../types';

defineOptions({ name: 'TeTable' });

export interface TableHeader {
  label?: string;
  field?: string;
  cellClass?: string;
  /** Per-column override of the `sortable` prop. */
  sortable?: boolean;
  /** Any CSS length. Pinned columns need one so their offsets can be summed. */
  width?: string;
}

type Row = Record<string, unknown>;

const emit = defineEmits<{ 'page-changed': [page: number] }>();

/* Uncontrolled unless bound: `defineModel` keeps its own state, so resizing or
   reordering works without the parent wiring anything up. */
const sort = defineModel<SortState | null>('sort', { default: null });
const selected = defineModel<TableSelection[]>('selected', { default: () => [] });
const columnWidths = defineModel<Record<string, string>>('columnWidths', { default: () => ({}) });
const columnOrder = defineModel<string[]>('columnOrder', { default: () => [] });

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

  /** Makes every column sortable; a header's own `sortable` still wins. */
  sortable: { type: Boolean, default: false },
  /** Adds a checkbox column bound to `v-model:selected`. */
  selectable: { type: Boolean, default: false },
  /** Field to identify a row by. Without one, selection holds the row objects,
      which only survives while `items` keeps the same references. */
  rowKey: { type: String, default: '' },
  /** Keeps the header visible while the body scrolls. Needs `maxHeight`. */
  stickyHeader: { type: Boolean, default: false },
  /** Pins the first N columns, plus the checkbox and row-number columns. */
  stickyColumns: { type: Number, default: 0 },
  maxHeight: { type: String, default: '' },
  resizable: { type: Boolean, default: false },
  reorderable: { type: Boolean, default: false },
  minColumnWidth: { type: Number, default: 80 },
  labelSelectAll: { type: String, default: 'Select all rows' },
  labelSelectRow: { type: String, default: 'Select row' },
  labelResize: { type: String, default: 'Resize column' },
});

const activePage = ref(1);

watch(activePage, (page) => emit('page-changed', page));
watch(() => [props.search, props.items] as const, () => { activePage.value = 1; });

const normalizedHeaders = computed(() =>
  props.headers.map((h) =>
    typeof h === 'string'
      ? { field: h, label: h, cellClass: '', sortable: undefined as boolean | undefined, width: undefined as string | undefined }
      : {
          field: h.field ?? h.label ?? '',
          label: h.label ?? h.field ?? '',
          cellClass: h.cellClass ?? '',
          sortable: h.sortable,
          width: h.width,
        }
  )
);

type Header = (typeof normalizedHeaders.value)[number];

/* `columnOrder` lists fields; anything it does not mention keeps its original
   position at the end, so a stale saved order never drops a column. */
const orderedHeaders = computed(() => {
  if (!columnOrder.value.length) return normalizedHeaders.value;
  const byField = new Map(normalizedHeaders.value.map((h) => [h.field, h]));
  const ordered = columnOrder.value.map((field) => byField.get(field)).filter(Boolean) as Header[];
  const seen = new Set(ordered.map((h) => h.field));
  return [...ordered, ...normalizedHeaders.value.filter((h) => !seen.has(h.field))];
});

const headerKeys = computed(() => normalizedHeaders.value.map((h) => h.field));

const columnCount = computed(() =>
  orderedHeaders.value.length + (props.showRowNum ? 1 : 0) + (props.selectable ? 1 : 0)
);

const filteredItems = computed(() => {
  const term = props.search.trim().toLowerCase();
  if (!term) return props.items;
  return props.items.filter((item) =>
    headerKeys.value.some((key) => String(item[key] ?? '').toLowerCase().includes(term))
  );
});

/* ---------------------------------------------------------------- sorting */

const isSortable = (header: Header) => header.sortable ?? props.sortable;
const sortDirOf = (header: Header) => (sort.value?.field === header.field ? sort.value.dir : null);
const ariaSort = (header: Header) => {
  if (!isSortable(header)) return undefined;
  const dir = sortDirOf(header);
  return dir === 'asc' ? 'ascending' : dir === 'desc' ? 'descending' : 'none';
};

function toggleSort(header: Header) {
  if (!isSortable(header)) return;
  const dir = sortDirOf(header);
  /* asc → desc → unsorted, so a column can always be put back. */
  sort.value = dir === 'asc' ? { field: header.field, dir: 'desc' } : dir === 'desc' ? null : { field: header.field, dir: 'asc' };
  activePage.value = 1;
}

/** `numeric` keeps "item 10" after "item 2", and empties sort last either way. */
function compare(a: unknown, b: unknown) {
  if (a === b) return 0;
  if (a === null || a === undefined || a === '') return 1;
  if (b === null || b === undefined || b === '') return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'boolean' && typeof b === 'boolean') return Number(a) - Number(b);
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

const sortedItems = computed(() => {
  const state = sort.value;
  /* With server-side paging the client holds one page, so sorting it locally
     would only reorder that page — the server owns the order. */
  if (!state || props.backendPagination) return filteredItems.value;
  const factor = state.dir === 'desc' ? -1 : 1;
  return [...filteredItems.value].sort((a, b) => factor * compare(a[state.field], b[state.field]));
});

/* ------------------------------------------------------------- pagination */

const pages = computed(() => {
  if (props.itemPerPage <= 0) return 0;
  const total = props.backendPagination ? props.totalItems : sortedItems.value.length;
  return Math.max(Math.ceil(total / props.itemPerPage), 1);
});

const pageOffset = computed(() =>
  props.backendPagination || props.itemPerPage <= 0 ? 0 : (activePage.value - 1) * props.itemPerPage
);

/* Was `v-show` over every row, which left the whole dataset mounted and only
   hid it — 5,000 rows paginated by 20 still built 5,000 <tr>. */
const pageItems = computed(() => {
  if (props.backendPagination || props.itemPerPage <= 0) return sortedItems.value;
  return sortedItems.value.slice(pageOffset.value, pageOffset.value + props.itemPerPage);
});

/* -------------------------------------------------------------- selection */

const keyOf = (row: Row): TableSelection => (props.rowKey ? (row[props.rowKey] as TableSelection) : row);
const isSelected = (row: Row) => selected.value.includes(keyOf(row));

const allSelected = computed(() => pageItems.value.length > 0 && pageItems.value.every(isSelected));
const someSelected = computed(() => pageItems.value.some(isSelected));

function toggleRow(row: Row, checked: boolean) {
  const key = keyOf(row);
  selected.value = checked
    ? [...selected.value, key]
    : selected.value.filter((entry) => entry !== key);
}

/** Acts on the visible page only, so paging never silently clears a selection. */
function toggleAll(checked: boolean) {
  const keys = pageItems.value.map(keyOf);
  selected.value = checked
    ? [...selected.value, ...keys.filter((key) => !selected.value.includes(key))]
    : selected.value.filter((entry) => !keys.includes(entry));
}

/* ------------------------------------------------------- pinned columns */

const UTILITY_WIDTH = 48;

const widthOf = (header: Header) => columnWidths.value[header.field] ?? header.width;
const hasWidths = computed(() => orderedHeaders.value.some((h) => widthOf(h)));
const widthStyle = (header: Header) => {
  const width = widthOf(header);
  return width ? { width, minWidth: width } : undefined;
};

/* Index -2 is the checkbox column, -1 the row number, 0+ the data columns. A
   sticky cell needs an explicit `left`, so offsets are summed from the widths
   in front of it — which is why a pinned column has to declare one. */
const isPinned = (index: number) => props.stickyColumns > 0 && index < props.stickyColumns;

function pinOffset(index: number) {
  let offset = props.selectable ? UTILITY_WIDTH : 0;
  if (index === -2) return 0;
  if (index === -1) return offset;
  if (props.showRowNum) offset += UTILITY_WIDTH;
  for (let i = 0; i < index; i += 1) {
    offset += parseFloat(widthOf(orderedHeaders.value[i]) ?? '') || 160;
  }
  return offset;
}

const pinClass = (index: number) => (isPinned(index) ? 'table-pinned' : undefined);
const pinStyle = (index: number) => (isPinned(index) ? { left: `${pinOffset(index)}px` } : undefined);

/* ---------------------------------------------------------------- resize */

let resizing: { field: string; startX: number; startWidth: number } | null = null;

function onResizeStart(header: Header, event: PointerEvent) {
  if (!props.resizable) return;
  event.preventDefault();
  event.stopPropagation();
  const cell = (event.currentTarget as HTMLElement).parentElement as HTMLElement;
  resizing = { field: header.field, startX: event.clientX, startWidth: cell.offsetWidth };
  /* Capture keeps the pointer events coming even when the cursor leaves the
     4px handle, which it does immediately on any real drag. */
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  window.addEventListener('pointermove', onResizeMove);
  window.addEventListener('pointerup', onResizeEnd, { once: true });
}

function onResizeMove(event: PointerEvent) {
  if (!resizing) return;
  const width = Math.max(resizing.startWidth + event.clientX - resizing.startX, props.minColumnWidth);
  columnWidths.value = { ...columnWidths.value, [resizing.field]: `${Math.round(width)}px` };
}

function onResizeEnd() {
  resizing = null;
  window.removeEventListener('pointermove', onResizeMove);
}

/* --------------------------------------------------------------- reorder */

const dragging = ref<string | null>(null);
const dropTarget = ref<string | null>(null);

function onHeaderDragStart(header: Header, event: DragEvent) {
  if (!props.reorderable) return;
  dragging.value = header.field;
  event.dataTransfer?.setData('text/plain', header.field);
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
}

function onHeaderDragOver(header: Header, event: DragEvent) {
  if (!props.reorderable || !dragging.value || dragging.value === header.field) return;
  event.preventDefault();
  dropTarget.value = header.field;
}

function onHeaderDrop(header: Header, event: DragEvent) {
  if (!props.reorderable || !dragging.value) return;
  event.preventDefault();
  const fields = orderedHeaders.value.map((h) => h.field);
  const from = fields.indexOf(dragging.value);
  const to = fields.indexOf(header.field);
  dragging.value = null;
  dropTarget.value = null;
  if (from === -1 || to === -1 || from === to) return;
  fields.splice(to, 0, ...fields.splice(from, 1));
  columnOrder.value = fields;
}

/* ----------------------------------------------------------------- misc */

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

function getCellValue(item: Row, header: { field: string }) {
  return item[header.field];
}
</script>
