import { ref } from 'vue';

export default {
  data: { open: ref(true) },
  template: () => `<te-button @click="open = true">Open the box</te-button>

<div v-if="open" v-click-outside="() => (open = false)" class="mt-3 w-64 rounded border border-gray-300 p-4">
  Click anywhere outside this box to close it.
</div>`,
  note: 'The v-click-outside directive, registered by the plugin.',
};
