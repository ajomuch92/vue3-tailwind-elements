import { showToast } from 'vue3-tailwind-elements';

export default {
  props: {
    title: 'Heads up',
    subtitle: '2 minutes ago',
    type: { options: ['info', 'success', 'warning', 'danger'] },
  },
  data: {
    fire: (type) => showToast({ toast: { title: type, subtitle: 'via showToast', type }, type: 'light', timeout: 3000 }),
  },
  template: (attrs) => `<te-toast-light${attrs} />

<div class="mt-6">
  <te-button size="small" @click="fire('success')">showToast light</te-button>
</div>`,
};
