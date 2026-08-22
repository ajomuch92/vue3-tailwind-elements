import { SIZES, VARIANTS } from 'vue3-tailwind-elements/types';

export default {
  props: {
    type: { options: VARIANTS, value: 'light' },
    size: { options: SIZES, value: 'medium' },
    closable: false,
    imgUrl: '',
  },
  slot: 'Chip label',
  note: 'Try imgUrl: https://i.pravatar.cc/60',
};
