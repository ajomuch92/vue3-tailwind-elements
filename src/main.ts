import type { App } from 'vue';
import { TeAccordion, TeAlert } from './components';

export default {
  install: (app: App) => {
    app.component('TeAccordion', TeAccordion);
    app.component('TeAlert', TeAlert);
  }
};

export { 
  TeAccordion,
  TeAlert
};
