import { SIZES, VARIANTS } from 'vue3-tailwind-elements/types';

export default {
  props: {
    quantity: 3,
    type: { options: VARIANTS, value: 'primary' },
    size: { options: SIZES, value: 'medium' },
    outlined: false,
  },
  template: (attrs) => `<te-button-group${attrs} :disabled="[false, true, false]" @click="onClick" />`,
  data: { onClick: ({ index }) => console.log('clicked', index) },
  note: 'Click emits { index, event } — check the console.',
};
