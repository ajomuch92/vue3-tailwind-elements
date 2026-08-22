export default {
  props: { title: 'Panel title', position: { options: ['left', 'right'] } },
  model: false,
  template: (attrs) => `<te-button @click="model = true">Open panel</te-button>

<te-offcanvas${attrs}>Panel content.</te-offcanvas>`,
};
