export default {
  props: { filled: false, pills: false, vertical: false },
  model: 0,
  data: { titles: ['Overview', 'Details', { label: 'Disabled', disabled: true }] },
  template: (attrs) => `<te-tabs :titles="titles"${attrs}>
  <template #tab-0><div class="p-4">Overview panel</div></template>
  <template #tab-1><div class="p-4">Details panel</div></template>
</te-tabs>`,
};
