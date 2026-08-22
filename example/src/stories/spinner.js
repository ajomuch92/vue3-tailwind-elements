import { SIZES, SPINNER_TYPES, VARIANTS } from 'vue3-tailwind-elements/types';

export default {
  props: {
    type: { options: SPINNER_TYPES },
    size: { options: SIZES, value: 'large' },
    color: { options: VARIANTS, value: 'primary' },
  },
};
