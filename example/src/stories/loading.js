import { SIZES, SPINNER_TYPES, VARIANTS } from 'vue3-tailwind-elements/types';

export default {
  props: {
    text: 'Loading...',
    type: { options: SPINNER_TYPES },
    size: { options: SIZES, value: 'medium' },
    color: { options: VARIANTS, value: 'primary' },
  },
  model: false,
  template: (attrs) => `<te-button @click="model = true; setTimeout(() => model = false, 1500)">Show for 1.5s</te-button>

<te-loading${attrs} />`,
};
