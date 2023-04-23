import TeAccordion from './components/teAccordion.vue';
import TeAlert from './components/teAlert.vue';
import TeBadge from './components/teBadge.vue';
import TeBreadcrumb from './components/teBreadcrumb.vue';
import TeButton from './components/teButton.vue';
import TeButtonGroup from './components/teButtonGruop.vue';
import TeSpinner from './components/teSpinner.vue';


export default function install(vueApp) {
  vueApp.component('te-accordion', TeAccordion);
  vueApp.component('te-alert', TeAlert);
  vueApp.component('te-badge', TeBadge);
  vueApp.component('te-breadcrumb', TeBreadcrumb);
  vueApp.component('te-button', TeButton);
  vueApp.component('te-button-group', TeButtonGroup);
  vueApp.component('te-spinner', TeSpinner);
}