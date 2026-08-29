import { showToast } from 'vue3-tailwind-elements';

export default {
  props: {
    title: 'Saved',
    subtitle: 'just now',
    message: 'Your changes were stored.',
    color: { options: ['normal', 'primary', 'success', 'warning', 'danger'] },
    showCloseButton: true,
  },
  data: {
    // `values` is the live props panel, so the floating toast matches the one
    // rendered inline instead of a hard-coded copy of it.
    fire: (align, values) => showToast({
      toast: { ...values },
      position: 'top',
      align,
      timeout: 3000,
    }),
  },
  template: (attrs) => `<te-toast${attrs} />

<div class="mt-6 flex gap-2">
  <te-button size="small" @click="fire('right', values)">showToast top-right</te-button>
  <te-button size="small" @click="fire('center', values)">showToast top-center</te-button>
</div>`,
  note: 'The buttons fire the same toast through showToast(), using whatever the props panel holds.',
};
