export default {
  props: { position: { options: ['top', 'right', 'bottom', 'left'] }, arrow: true },
  template: (attrs) => `<div class="p-16">
  <te-tooltip${attrs}>
    <te-button>Hover or focus me</te-button>
    <template #content>Tooltip content</template>
  </te-tooltip>
</div>`,
};
