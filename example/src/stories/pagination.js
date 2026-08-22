import { SIZES } from 'vue3-tailwind-elements/types';

export default {
  props: {
    pages: 10,
    pagesToShow: 5,
    size: { options: SIZES, value: 'medium' },
    position: { options: ['center', 'left', 'right'] },
    labelPrev: 'Prev.',
    labelNext: 'Next',
    showIcons: false,
    rounded: false,
  },
  model: 1,
  modelName: 'activePage',
};
