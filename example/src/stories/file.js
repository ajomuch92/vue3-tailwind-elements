import { SIZES } from 'vue3-tailwind-elements/types';

export default {
  props: {
    accept: 'image/*',
    size: { options: SIZES, value: 'medium' },
    multiple: false,
    disabled: false,
  },
  model: '',
  note: 'The model holds the file(s) as base64 data URLs.',
};
