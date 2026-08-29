export default {
  props: {
    shape: { options: ['text', 'rect', 'circle'] },
    lines: 3,
    width: '',
    height: '',
    animated: true,
    label: '',
  },
  note: 'lines only applies to the text shape. Give it a label and it turns into a live region instead of being hidden.',
};
