import { ref } from 'vue';
import { showConfirm } from 'vue3-tailwind-elements';

const answer = ref('—');

export default {
  props: {
    title: 'Delete project',
    message: 'This cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    type: { options: ['primary', 'danger', 'success', 'warning'] },
  },
  data: {
    answer,
    // `values` is the live props panel — the dialog matches what is set below.
    ask: async (values) => {
      answer.value = 'waiting…';
      answer.value = String(await showConfirm({ ...values }));
    },
  },
  // showConfirm is a function rather than a component, so the story renders the
  // button that calls it.
  template: () => `<div class="flex items-center gap-3">
  <te-button type="danger" @click="ask(values)">Ask</te-button>
  <span class="te-text-muted text-sm">resolved: {{ answer }}</span>
</div>`,
  note: 'Cancel, the close button, the backdrop and Escape all resolve false.',
};
