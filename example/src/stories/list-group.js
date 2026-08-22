export default {
  props: { clickable: true, flush: false },
  model: null,
  modelName: 'activeItem',
  data: { items: ['One', 'Two', { label: 'Disabled', disabled: true }, 'Four'] },
  template: (attrs) => `<te-list-group :items="items"${attrs} />`,
};
