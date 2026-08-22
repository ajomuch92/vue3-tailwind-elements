import { ref } from 'vue';
import { SIZES, VARIANTS } from 'vue3-tailwind-elements/types';

const selected = ref('none');

export default {
  props: {
    label: 'Menu',
    type: { options: VARIANTS, value: 'light' },
    size: { options: SIZES, value: 'medium' },
    align: { options: ['start', 'end'] },
    closeOnSelect: true,
    disabled: false,
  },
  model: false,
  data: {
    items: ['Profile', 'Settings', { label: 'Disabled', disabled: true }, 'Log out'],
    selected,
    onSelect: (item) => { selected.value = item.label; },
  },
  template: (attrs) => `<te-dropdown :items="items"${attrs} @select="onSelect" />

<p class="mt-4 text-sm text-gray-500">selected: {{ selected }}</p>`,
};
