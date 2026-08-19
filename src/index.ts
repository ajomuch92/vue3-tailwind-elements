import type { App, Plugin } from 'vue';

import TeAccordion from './components/teAccordion.vue';
import TeAlert from './components/teAlert.vue';
import TeBadge from './components/teBadge.vue';
import TeBreadcrumb from './components/teBreadcrumb.vue';
import TeButton from './components/teButton.vue';
import TeButtonGroup from './components/teButtonGruop.vue';
import TeCard from './components/teCard.vue';
import TeCheckbox from './components/teCheckbox.vue';
import TeChip from './components/teChip.vue';
import TeDatePicker from './components/teDatePicker.vue';
import TeFile from './components/teFile.vue';
import TeIcon from './components/teIcon.vue';
import TeInput from './components/teInput.vue';
import TeListGroup from './components/teListGroup.vue';
import TeLoading from './components/teLoading.vue';
import TeSpinner from './components/teSpinner.vue';

import clickOutside from './directives/v-outside';
import useOptions from './options';
import type { TeOptions } from './types';

const components = {
  'te-accordion': TeAccordion,
  'te-alert': TeAlert,
  'te-badge': TeBadge,
  'te-breadcrumb': TeBreadcrumb,
  'te-button': TeButton,
  'te-button-group': TeButtonGroup,
  'te-card': TeCard,
  'te-checkbox': TeCheckbox,
  'te-chip': TeChip,
  'te-date-picker': TeDatePicker,
  'te-file': TeFile,
  'te-icon': TeIcon,
  'te-input': TeInput,
  'te-list-group': TeListGroup,
  'te-loading': TeLoading,
  'te-spinner': TeSpinner,
} as const;

const install: Plugin<[TeOptions?]> = (app: App, options: TeOptions = {}) => {
  useOptions().setOptions(options);
  for (const [name, component] of Object.entries(components)) {
    app.component(name, component);
  }
  app.directive('click-outside', clickOutside);
};

export default install;

export {
  TeAccordion, TeAlert, TeBadge, TeBreadcrumb, TeButton, TeButtonGroup,
  TeCard, TeCheckbox, TeChip, TeDatePicker, TeFile, TeIcon, TeInput,
  TeListGroup, TeLoading, TeSpinner, clickOutside, useOptions,
};

export type * from './types';

declare module 'vue' {
  export interface GlobalComponents {
    TeAccordion: typeof TeAccordion;
    TeAlert: typeof TeAlert;
    TeBadge: typeof TeBadge;
    TeBreadcrumb: typeof TeBreadcrumb;
    TeButton: typeof TeButton;
    TeButtonGroup: typeof TeButtonGroup;
    TeCard: typeof TeCard;
    TeCheckbox: typeof TeCheckbox;
    TeChip: typeof TeChip;
    TeDatePicker: typeof TeDatePicker;
    TeFile: typeof TeFile;
    TeIcon: typeof TeIcon;
    TeInput: typeof TeInput;
    TeListGroup: typeof TeListGroup;
    TeLoading: typeof TeLoading;
    TeSpinner: typeof TeSpinner;
  }
}
