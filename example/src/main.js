import { createApp } from 'vue';
import App from './App.vue';
import Vue3TailwindElements from 'vue3-tailwind-elements';
import 'vue3-tailwind-elements/dist/style.css';
import './styles/index.css';

createApp(App)
  .use(Vue3TailwindElements)
  .mount('#app');
