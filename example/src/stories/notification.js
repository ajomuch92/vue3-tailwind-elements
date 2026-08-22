import { VARIANTS } from 'vue3-tailwind-elements/types';

export default {
  props: {
    text: 'A notification',
    color: { options: VARIANTS, value: 'primary' },
    position: { options: ['top-right', 'top-left', 'bottom-right', 'bottom-left'] },
    hide: false,
  },
};
