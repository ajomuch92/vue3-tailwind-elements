import { VARIANTS } from 'vue3-tailwind-elements/types';

export default {
  props: {
    text: 'Something happened.',
    type: { options: VARIANTS },
    solid: false,
  },
};
