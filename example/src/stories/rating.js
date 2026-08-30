export default {
  props: {
    quantity: 5,
    icon: 'star-fill',
    color: 'gold',
    iconSizeClass: 'text-2xl',
    spacing: 1,
    hasHalfValues: true,
    clearable: false,
    disabled: false,
    label: 'Rating',
    clearLabel: 'Clear rating',
  },
  model: 3.5,
  note: 'spacing is 0-5. Try icon: heart-fill with color: crimson. Tab to the stars and use the arrow keys.',
};
