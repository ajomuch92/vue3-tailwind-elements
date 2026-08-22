import { VARIANTS } from 'vue3-tailwind-elements/types';

export default {
  props: {
    text: 'New',
    type: { options: VARIANTS },
    size: { options: ['small', 'large'] },
    solid: false,
    rounded: false,
    outlined: false,
  },
};
