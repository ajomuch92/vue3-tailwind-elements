import TeAccordion from './components/teAccordion.vue';
import TeAlert from './components/teAlert.vue';
import TeBadge from './components/teBadge.vue';
import TeBreadcrumb from './components/teBreadcrumb.vue';
import TeButton from './components/teButton.vue';
import TeButtonGroup from './components/teButtonGruop.vue';
import TeSpinner from './components/teSpinner.vue';
import TeCard from './components/teCard.vue';
import TeCheckbox from './components/teCheckbox.vue';
import TeChip from './components/teChip.vue';
import TeIcon from './components/teIcon.vue';
import TeDatePicker from './components/teDatePicker.vue';

import clickOutside from './directives/v-outside';

import useOptions from './options';

export default function install(vueApp, options = {}) {
  useOptions().setOptions(options);
  vueApp.component('te-accordion', TeAccordion);
  vueApp.component('te-alert', TeAlert);
  vueApp.component('te-badge', TeBadge);
  vueApp.component('te-breadcrumb', TeBreadcrumb);
  vueApp.component('te-button', TeButton);
  vueApp.component('te-button-group', TeButtonGroup);
  vueApp.component('te-spinner', TeSpinner);
  vueApp.component('te-card', TeCard);
  vueApp.component('te-checkbox', TeCheckbox);
  vueApp.component('te-chip', TeChip);
  vueApp.component('te-icon', TeIcon);
  vueApp.component('te-date-picker', TeDatePicker);

  vueApp.directive('click-outside', clickOutside);
}