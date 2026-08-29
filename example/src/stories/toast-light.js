import { showToast } from 'vue3-tailwind-elements';

export default {
  props: {
    title: 'Heads up',
    subtitle: '2 minutes ago',
    type: { options: ['info', 'success', 'warning', 'danger'] },
  },
  data: {
    // `values` is the live props panel — see the toast story.
    fire: (values) => showToast({ toast: { ...values }, type: 'light', timeout: 3000 }),
  },
  template: (attrs) => `<te-toast-light${attrs} />

<div class="mt-6">
  <te-button size="small" @click="fire(values)">showToast light</te-button>
</div>`,
  note: 'The button fires the same toast through showToast(), using whatever the props panel holds.',
};
