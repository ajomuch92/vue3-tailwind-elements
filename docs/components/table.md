# Table

<script setup>
import { ref } from 'vue';

const gridHeaders = [
  { field: 'name', label: 'Name' },
  { field: 'role', label: 'Role' },
  { field: 'score', label: 'Score' },
];
const wideHeaders = [
  { field: 'name', label: 'Name', width: '220px' },
  { field: 'role', label: 'Role', width: '220px' },
  { field: 'score', label: 'Score', width: '220px' },
];
const gridItems = [
  { id: 1, name: 'item 10', role: 'Engineer', score: 8 },
  { id: 2, name: 'item 2', role: 'Researcher', score: 91 },
  { id: 3, name: 'item 1', role: 'Designer', score: 40 },
];

const sort = ref(null);
const selected = ref([]);
const widths = ref({});
const order = ref([]);
</script>

`te-table` renders rows from `items` using `headers`, with optional search,
pagination and per-column slots. Sorting, row selection, pinned columns and
column resizing turn it into a data grid without a second component.

## Basic

<Demo block>
  <te-table
    :headers="[{ field: 'name', label: 'Name' }, { field: 'role', label: 'Role' }]"
    :items="[{ name: 'Ada', role: 'Engineer' }, { name: 'Alan', role: 'Researcher' }]"
  />
</Demo>

```vue
<te-table
  :headers="[{ field: 'name', label: 'Name' }, { field: 'role', label: 'Role' }]"
  :items="[{ name: 'Ada', role: 'Engineer' }, { name: 'Alan', role: 'Researcher' }]"
/>
```

## Styling

<Demo block>
  <te-table
    striped hoverable bordered show-row-num compact header-type="dark"
    :headers="[{ field: 'name', label: 'Name' }, { field: 'role', label: 'Role' }]"
    :items="[{ name: 'Ada', role: 'Engineer' }, { name: 'Alan', role: 'Researcher' }]"
  />
</Demo>

```vue
<te-table
  striped hoverable bordered show-row-num compact header-type="dark"
  :headers="[{ field: 'name', label: 'Name' }, { field: 'role', label: 'Role' }]"
  :items="[{ name: 'Ada', role: 'Engineer' }, { name: 'Alan', role: 'Researcher' }]"
/>
```

## Empty state

<Demo block>
  <te-table :headers="[{ field: 'name', label: 'Name' }]" :items="[]" no-data-label="Nothing to show" />
</Demo>

```vue
<te-table :headers="[{ field: 'name', label: 'Name' }]" :items="[]" no-data-label="Nothing to show" />
```

### `TableHeader`

```ts
interface TableHeader {
  field?: string;      // key read from each row
  label?: string;      // column heading
  cellClass?: string;  // extra classes on that column's cells
  sortable?: boolean;  // overrides the table-wide `sortable`
  width?: string;      // any CSS length; required on pinned columns
}
```

## Sorting

`sortable` makes every column sortable; a header's own `sortable` wins over it,
so one column can opt out. Clicking a heading cycles ascending → descending →
unsorted, and `v-model:sort` exposes the state as `{ field, dir }`.

<Demo block>
  <te-table sortable :headers="gridHeaders" :items="gridItems" v-model:sort="sort" />
  <span>sort: {{ sort ? `${sort.field} ${sort.dir}` : 'none' }}</span>
</Demo>

```vue
<te-table sortable :headers="headers" :items="items" v-model:sort="sort" />
```

Comparison is type-aware: numbers compare numerically, dates by timestamp, and
strings through `localeCompare` with `numeric: true` — so `item 2` sorts before
`item 10` instead of after it. Empty cells sort last in both directions.

**With `backendPagination` the table does not sort at all.** It only emits
`update:sort`, because the client is holding one page and reordering it would
scramble the sequence rather than sort the set. Sort on the server and send the
page back.

## Selecting rows

`selectable` adds a checkbox column bound to `v-model:selected`.

<Demo block>
  <te-table selectable row-key="id" :headers="gridHeaders" :items="gridItems" v-model:selected="selected" />
  <span>selected: {{ selected.join(', ') || 'none' }}</span>
</Demo>

```vue
<te-table selectable row-key="id" :headers="headers" :items="items" v-model:selected="selected" />
```

`rowKey` names the field that identifies a row, and `selected` then holds those
keys. Without it the array holds the row objects themselves, which only works
while `items` keeps the same object references — so pass a `rowKey` whenever the
rows come from a server.

The header checkbox acts on **the current page only**, and shows an
indeterminate state when part of the page is selected. Paging never clears what
you picked on another page.

## Sticky header and pinned columns

`stickyHeader` keeps the heading row visible while the body scrolls, which needs
a `maxHeight` to scroll inside. `stickyColumns` pins the first N columns; the
checkbox and row-number columns are pinned with them.

<Demo block>
  <te-table
    sticky-header
    max-height="14rem"
    :sticky-columns="1"
    :headers="wideHeaders"
    :items="gridItems"
  />
</Demo>

```vue
<te-table sticky-header max-height="14rem" :sticky-columns="1" :headers="headers" :items="items" />
```

A pinned column must declare a `width`. Pinning is plain `position: sticky`, and
a sticky cell needs an explicit `left` offset, which the table sums from the
widths in front of it — there is no measuring pass, so an undeclared width falls
back to 160px and the columns behind it will sit slightly off.

## Resizing and reordering columns

`resizable` puts a drag handle on each heading's trailing edge; `reorderable`
lets a heading be dragged onto another. Both keep their state in
`v-model:column-widths` and `v-model:column-order`, so persisting a user's
layout is a matter of storing those two values.

<Demo block note="Drag a heading's right edge to resize it, or drag the heading itself onto another.">
  <te-table
    resizable
    reorderable
    :headers="gridHeaders"
    :items="gridItems"
    v-model:column-widths="widths"
    v-model:column-order="order"
  />
</Demo>

```vue
<te-table
  resizable
  reorderable
  :headers="headers"
  :items="items"
  v-model:column-widths="widths"
  v-model:column-order="order"
/>
```

`columnOrder` is a list of fields. A field the list does not mention keeps its
original position at the end, so a saved order from an older release never drops
a column that was added since.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `object[]` | — (required) | Rows. |
| `headers` | `(TableHeader | string)[]` | — (required) | Columns. A string is used as both field and label. |
| `search` | `string` | `''` | Filters rows across every column. Resets to page 1. |
| `itemPerPage` | `number` | `-1` | Rows per page. `-1` disables pagination. |
| `backendPagination` | `boolean` | `false` | The server already paginates; use with `totalItems`. |
| `totalItems` | `number` | `0` | Row count on the server, for `backendPagination`. |
| `paginationAlign` | `'left'` \| `'center'` \| `'right'` | `'right'` | Where the pager sits. |
| `headerType` | `'normal'` \| `'light'` \| `'dark'` | `'normal'` | Header background. |
| `striped` `hoverable` `bordered` `borderless` `centered` `compact` | `boolean` | `false` | Visual variants. |
| `responsive` | `boolean` | `true` | Horizontal scrolling on overflow. |
| `showRowNum` | `boolean` | `false` | Adds a row-number column. |
| `rowNumLabel` | `string` | `'#'` | Header of that column. |
| `hasSubheading` | `boolean` | `false` | Renders the `subheading` slot as a first row. |
| `noDataLabel` | `string` | `'No Data'` | Text shown when there are no rows. |
| `loading` | `boolean` | `false` | Overlays a spinner. |
| `sortable` | `boolean` | `false` | Makes every column sortable. |
| `selectable` | `boolean` | `false` | Adds the checkbox column. |
| `rowKey` | `string` | `''` | Field identifying a row, for `selected`. |
| `stickyHeader` | `boolean` | `false` | Freezes the heading row. Needs `maxHeight`. |
| `stickyColumns` | `number` | `0` | Pins the first N columns. |
| `maxHeight` | `string` | `''` | Any CSS length; makes the body scroll. |
| `resizable` | `boolean` | `false` | Drag handles on the headings. |
| `reorderable` | `boolean` | `false` | Drag a heading onto another. |
| `minColumnWidth` | `number` | `80` | Smallest width a resize can reach, in px. |
| `labelSelectAll` `labelSelectRow` `labelResize` | `string` | English | Accessible names. |

### Models

| Model | Type | Description |
|---|---|---|
| `v-model:sort` | `{ field, dir } \| null` | Current sort. `null` is unsorted. |
| `v-model:selected` | `unknown[]` | Row keys, or rows when there is no `rowKey`. |
| `v-model:column-widths` | `Record<string, string>` | Field → CSS width. |
| `v-model:column-order` | `string[]` | Fields, in display order. |

Each of these works uncontrolled: leave it unbound and the table keeps the state
itself.

## Events

| Event | Payload | Description |
|---|---|---|
| `page-changed` | `number` | The page changed. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `<field>` | `{ value, row, index }` | Custom cell for that column. `index` is the row's position in the whole set, not in the page. |
| `sort-icon` | `{ header, dir }` | Replaces the sort indicator. |
| `no-data` | — | Replaces the empty state. |
| `subheading` | — | Extra row under the header. |
