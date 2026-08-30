import DefaultTheme from 'vitepress/theme';
import type { Theme } from 'vitepress';
import Vue3TailwindElements, { showConfirm } from 'vue3-tailwind-elements';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';
import Demo from './Demo.vue';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.use(Vue3TailwindElements);
    app.component('Demo', Demo);
    /* Imperative helpers are functions, not components, so a demo in a
       markdown page can only reach them through the global scope. */
    app.config.globalProperties.showConfirm = showConfirm;
  },
} satisfies Theme;
