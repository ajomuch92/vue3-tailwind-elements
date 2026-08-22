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
    fire: (align) => showToast({
      toast: { title: 'Saved', subtitle: 'just now', message: 'Your changes were stored.', color: 'success' },
      position: 'top',
      align,
      timeout: 3000,
    }),
  },
  template: (attrs) => `<te-toast${attrs} />

<div class="mt-6 flex gap-2">
  <te-button size="small" @click="fire('right')">showToast top-right</te-button>
  <te-button size="small" @click="fire('center')">showToast top-center</te-button>
</div>`,
};
