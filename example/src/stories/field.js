import { ref } from 'vue';

export default {
  props: {
    label: 'Email',
    helper: 'We only use it to reach you',
    // Type anything here and the field turns invalid — an error message is a
    // state of its own.
    error: '',
    required: false,
    invalid: false,
  },
  data: { value: ref('') },
  template: (attrs) => `<te-field${attrs}>
  <te-input v-model="value" class="w-full" placeholder="you@example.com" />
</te-field>`,
  note: 'The label focuses the input, and the hint below it is what the input reports as its description.',
};
