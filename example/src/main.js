import { createApp } from 'vue';
import App from './App.vue';
import Vue3TailwindElements from 'vue3-tailwind-elements';
import './styles/index.css';

createApp(App)
  .use(Vue3TailwindElements)
  .mount('#app');
