export default {
  props: {
    separator: { options: ['/', '\\', '>'] },
    linkTag: { options: ['a', 'router-link', 'nuxt-link'] },
  },
  data: {
    options: [
      { label: 'Home', href: '#breadcrumb' },
      { label: 'Components', href: '#breadcrumb' },
      { label: 'Breadcrumb' },
    ],
  },
  template: (attrs) => `<te-breadcrumb :options="options"${attrs} />`,
};
