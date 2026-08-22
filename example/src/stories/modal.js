export default {
  props: {
    title: 'Modal title',
    size: { options: ['', 'sm', 'lg', 'xl'] },
    showCloseButton: true,
    closeOnBackdrop: true,
    hideHeader: false,
    hideFooter: false,
    scrollable: false,
    centered: false,
  },
  model: false,
  modelName: 'visible',
  template: (attrs) => `<te-button @click="model = true">Open modal</te-button>

<te-modal${attrs}>
  <p>Escape, backdrop click and the focus trap come from the native &lt;dialog&gt;.</p>
  <template #footer><te-button size="small" @click="model = false">Close</te-button></template>
</te-modal>`,
};
