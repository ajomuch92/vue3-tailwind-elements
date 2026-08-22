import { SIZES } from 'vue3-tailwind-elements/types';

export default {
  props: {
    type: { options: ['text', 'number', 'email', 'search', 'password', 'tel', 'url'] },
    placeholder: 'Type something',
    size: { options: SIZES, value: 'medium' },
    helperText: '',
    leftIcon: '',
    rightIcon: '',
    rightIconClickable: false,
    floating: false,
    invalid: false,
    readonly: false,
    disabled: false,
  },
  model: '',
  note: 'Icons take Bootstrap Icons names, e.g. search or x-circle.',
};
