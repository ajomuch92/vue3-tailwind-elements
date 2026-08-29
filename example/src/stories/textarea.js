export default {
  props: {
    placeholder: 'Type something...',
    rows: 4,
    // Clear the field to drop `maxlength` and watch the counter fall back to a
    // plain count.
    maxlength: 180,
    counter: true,
    readonly: false,
    disabled: false,
  },
  model: '',
  // The counter sits at the right edge of the container, so the field is given
  // a width to line up with.
  template: (attrs) => `<te-textarea class="w-full"${attrs} />`,
  note: 'The counter reads `x/y` while a maxlength is set, and just `x` without one.',
};
