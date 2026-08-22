import { SIZES, VARIANTS } from 'vue3-tailwind-elements/types';

export default {
  props: {
    type: { options: VARIANTS, value: 'primary' },
    size: { options: SIZES, value: 'medium' },
    buttonType: { options: ['button', 'reset', 'submit'] },
    rounded: false,
    outlined: false,
    shadowed: false,
    uppercased: false,
    onlyText: false,
    noRounded: false,
    ripple: false,
    loading: false,
    disabled: false,
    icon: false,
  },
  slot: 'Click me',
};
