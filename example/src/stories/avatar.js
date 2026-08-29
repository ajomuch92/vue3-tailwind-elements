import { VARIANTS } from 'vue3-tailwind-elements/types';

export default {
  props: {
    name: 'Ada Lovelace',
    // Point it at something that does not exist to watch it fall back to the
    // initials.
    src: '',
    alt: '',
    type: { options: VARIANTS },
    size: { options: ['small', 'medium', 'large'], value: 'medium' },
    square: false,
  },
  note: 'No src falls back to the initials, and no name falls back to the icon. A broken URL does the same.',
};
