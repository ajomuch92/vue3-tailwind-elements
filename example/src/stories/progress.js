import { SIZES, VARIANTS } from 'vue3-tailwind-elements/types';

export default {
  props: {
    value: 45,
    type: { options: VARIANTS, value: 'primary' },
    size: { options: SIZES, value: 'medium' },
    showValue: false,
  },
};
