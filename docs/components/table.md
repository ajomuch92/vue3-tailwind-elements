# Table

`te-table` renders rows from `items` using `headers`, with optional search,
pagination and per-column slots.

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
}
```

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

## Events

| Event | Payload | Description |
|---|---|---|
| `page-changed` | `number` | The page changed. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `<field>` | `{ value, row, index }` | Custom cell for that column. |
| `no-data` | — | Replaces the empty state. |
| `subheading` | — | Extra row under the header. |
