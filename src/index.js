import TeAccordion from './components/teAccordion.vue';
import TeButton from './components/TeButton.vue';
import TeSpinner from './components/teSpinner.vue';


export default function install(vueApp) {
  vueApp.component('te-accordion', TeAccordion);
  vueApp.component('te-button', TeButton);
  vueApp.component('te-spinner', TeSpinner);
}