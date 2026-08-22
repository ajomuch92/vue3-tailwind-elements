import { SIZES } from 'vue3-tailwind-elements/types';

export default {
  props: {
    placeholder: 'Pick one',
    size: { options: SIZES, value: 'medium' },
    displayField: 'label',
    valueField: 'id',
    multiple: false,
    disabled: false,
  },
  model: null,
  data: { options: [{ id: 1, label: 'Apple' }, { id: 2, label: 'Banana' }, { id: 3, label: 'Cherry' }] },
  template: (attrs) => `<te-select :options="options"${attrs} />`,
  note: 'options also accepts plain strings or numbers.',
};
