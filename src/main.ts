import type { App } from 'vue';
import { TeAccordion } from "./components";

export default {
  install: (app: App) => {
    app.component('TeAccordion', TeAccordion);
  }
};

export { 
  TeAccordion
};
