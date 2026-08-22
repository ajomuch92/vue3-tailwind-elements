export default {
  props: {
    itemPerPage: 5,
    headerType: { options: ['normal', 'light', 'dark'] },
    paginationAlign: { options: ['right', 'left', 'center'] },
    search: '',
    noDataLabel: 'No Data',
    striped: true,
    hoverable: true,
    bordered: false,
    borderless: false,
    centered: false,
    compact: false,
    responsive: true,
    showRowNum: false,
    loading: false,
  },
  data: {
    headers: [
      { label: 'Name', field: 'name' },
      { label: 'Role', field: 'role' },
      { label: 'Status', field: 'status' },
    ],
    items: Array.from({ length: 12 }, (_, i) => ({
      name: `Person ${i + 1}`,
      role: i % 2 ? 'Admin' : 'User',
      status: i % 3 ? 'active' : 'off',
    })),
  },
  template: (attrs) => `<te-table :headers="headers" :items="items"${attrs}>
  <template #status="{ value }">
    <te-badge :type="value === 'active' ? 'success' : 'danger'" :text="value" />
  </template>
</te-table>`,
  note: 'Type in `search` to filter. The status column uses a per-field slot.',
};
