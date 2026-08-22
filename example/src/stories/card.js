export default {
  props: {
    title: 'Card title',
    width: '350px',
    imgSrc: '',
    hasHeader: false,
    hasFooter: false,
    shadowless: false,
  },
  template: (attrs) => `<te-card${attrs}>
  <template #header>Header slot</template>
  Body content goes here.
  <template #footer><te-button size="small">Action</te-button></template>
</te-card>`,
  note: 'Try imgSrc: https://picsum.photos/350/160',
};
