import { ref } from 'vue';

const items = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `Person ${i + 1}`,
  role: i % 2 ? 'Admin' : 'User',
  status: i % 3 ? 'active' : 'off',
  score: (i * 37) % 100,
}));

export default {
  props: {
    itemPerPage: 8,
    headerType: { options: ['normal', 'light', 'dark'] },
    paginationAlign: { options: ['right', 'left', 'center'] },
    search: '',
    maxHeight: '24rem',
    stickyColumns: 1,
    minColumnWidth: 80,
    sortable: true,
    selectable: true,
    stickyHeader: true,
    resizable: true,
    reorderable: true,
    striped: true,
    hoverable: true,
    showRowNum: false,
    bordered: false,
    compact: false,
    loading: false,
  },
  data: {
    items,
    headers: [
      { label: 'Name', field: 'name', width: '200px' },
      { label: 'Role', field: 'role' },
      { label: 'Status', field: 'status', sortable: false },
      { label: 'Score', field: 'score' },
    ],
    selected: ref([]),
    sort: ref(null),
  },
  template: (attrs) => `<te-table
  :headers="headers"
  :items="items"
  row-key="id"
  v-model:selected="selected"
  v-model:sort="sort"${attrs}
>
  <template #status="{ value }">
    <te-badge :type="value === 'active' ? 'success' : 'danger'" :text="value" />
  </template>
</te-table>

<p class="mt-4 text-sm text-gray-500">selected: {{ selected.length }} · sort: {{ sort ? sort.field + ' ' + sort.dir : 'none' }}</p>`,
  note: 'Click a header to sort, drag one onto another to reorder, drag its right edge to resize. Status is not sortable.',
};
