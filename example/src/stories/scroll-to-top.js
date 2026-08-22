export default {
  props: { offset: 50 },
  template: (attrs) => `<div id="scroll-box" class="relative h-80 overflow-y-auto rounded border border-gray-300 p-4">
  <p v-for="n in 60" :key="n">Scroll me — line {{ n }}</p>
  <te-scroll-to-top parent="#scroll-box"${attrs} />
</div>`,
  note: 'Omit `parent` to watch the page itself instead of a container.',
};
