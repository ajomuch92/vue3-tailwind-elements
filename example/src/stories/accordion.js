export default {
  props: { flush: false, singleOpen: true },
  data: { items: ['First section', 'Second section', 'Third section'] },
  template: (attrs) => `<te-accordion :items="items"${attrs} :default-open="[1]">
  <template #content-1>Content of the first section.</template>
  <template #content-2>Content of the second section.</template>
  <template #content-3>Content of the third section.</template>
</te-accordion>`,
};
