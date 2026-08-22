export default {
  data: {
    steps: [{ label: 'Account' }, { label: 'Profile' }, { label: 'Locked', disabled: true }, { label: 'Done' }],
  },
  model: 0,
  template: (attrs) => `<te-stepper :steps="steps"${attrs}>
  <template #step-0><div class="p-4">Account panel</div></template>
  <template #step-1><div class="p-4">Profile panel</div></template>
  <template #step-3><div class="p-4">All done</div></template>
</te-stepper>`,
};
