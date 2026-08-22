export default {
  props: {
    placeholder: 'Pick a few',
    placeholderSearch: 'Search...',
    visibleItems: 3,
    minWidth: '250px',
    listHeight: '250px',
    singleSelect: false,
    searchable: true,
    showSelectAll: true,
    clearable: true,
    disabled: false,
  },
  model: [],
  data: { options: Array.from({ length: 8 }, (_, i) => ({ text: `Option ${i + 1}`, value: i + 1 })) },
  template: (attrs) => `<te-multiselect :options="options"${attrs} />`,
};
