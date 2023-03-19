import { createApp } from 'vue';
import App from './App.vue';
import './styles/index.css';
import Vue3TailwindElements from 'vue3-tailwind-elements';

createApp(App)
  .use(Vue3TailwindElements)
  .mount('#app');
