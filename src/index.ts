import type { App, Plugin } from 'vue';

import TeAccordion from './components/teAccordion.vue';
import TeAlert from './components/teAlert.vue';
import TeBadge from './components/teBadge.vue';
import TeBreadcrumb from './components/teBreadcrumb.vue';
import TeButton from './components/teButton.vue';
import TeButtonGroup from './components/teButtonGroup.vue';
import TeCard from './components/teCard.vue';
import TeCheckbox from './components/teCheckbox.vue';
import TeChip from './components/teChip.vue';
import TeDatePicker from './components/teDatePicker.vue';
import TeDropdown from './components/teDropdown.vue';
import TeFile from './components/teFile.vue';
import TeIcon from './components/teIcon.vue';
import TeInput from './components/teInput.vue';
import TeListGroup from './components/teListGroup.vue';
import TeLoading from './components/teLoading.vue';
import TeModal from './components/teModal.vue';
import TeMultiselect from './components/teMultiselect.vue';
import TeNotification from './components/teNotification.vue';
import TeOffcanvas from './components/teOffcanvas.vue';
import TePagination from './components/tePagination.vue';
import TeProgress from './components/teProgress.vue';
import TeRadio from './components/teRadio.vue';
import TeRange from './components/teRange.vue';
import TeRating from './components/teRating.vue';
import TeScrollToTop from './components/teScrollToTop.vue';
import TeSelect from './components/teSelect.vue';
import TeSpinner from './components/teSpinner.vue';
import TeStepper from './components/teStepper.vue';
import TeSwitch from './components/teSwitch.vue';
import TeTable from './components/teTable.vue';
import TeTabs from './components/teTabs.vue';
import TeTextarea from './components/teTextarea.vue';
import TeTimePicker from './components/teTimePicker.vue';
import TeToast from './components/teToast.vue';
import TeToastLight from './components/teToastLight.vue';
import TeTooltip from './components/teTooltip.vue';

import clickOutside from './directives/v-outside';
import showToast from './components/toast';
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
  'te-dropdown': TeDropdown,
  'te-file': TeFile,
  'te-icon': TeIcon,
  'te-input': TeInput,
  'te-list-group': TeListGroup,
  'te-loading': TeLoading,
  'te-modal': TeModal,
  'te-multiselect': TeMultiselect,
  'te-notification': TeNotification,
  'te-offcanvas': TeOffcanvas,
  'te-pagination': TePagination,
  'te-progress': TeProgress,
  'te-radio': TeRadio,
  'te-range': TeRange,
  'te-rating': TeRating,
  'te-scroll-to-top': TeScrollToTop,
  'te-select': TeSelect,
  'te-spinner': TeSpinner,
  'te-stepper': TeStepper,
  'te-switch': TeSwitch,
  'te-table': TeTable,
  'te-tabs': TeTabs,
  'te-textarea': TeTextarea,
  'te-time-picker': TeTimePicker,
  'te-toast': TeToast,
  'te-toast-light': TeToastLight,
  'te-tooltip': TeTooltip,
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
  TeCard, TeCheckbox, TeChip, TeDatePicker, TeDropdown, TeFile, TeIcon, TeInput,
  TeListGroup, TeLoading, TeModal, TeMultiselect, TeNotification, TeOffcanvas,
  TePagination, TeProgress, TeRadio, TeRange, TeRating, TeScrollToTop,
  TeSelect, TeSpinner, TeStepper, TeSwitch, TeTable, TeTabs, TeTextarea,
  TeTimePicker, TeToast, TeToastLight, TeTooltip,
  clickOutside, showToast, useOptions,
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
    TeDropdown: typeof TeDropdown;
    TeFile: typeof TeFile;
    TeIcon: typeof TeIcon;
    TeInput: typeof TeInput;
    TeListGroup: typeof TeListGroup;
    TeLoading: typeof TeLoading;
    TeModal: typeof TeModal;
    TeMultiselect: typeof TeMultiselect;
    TeNotification: typeof TeNotification;
    TeOffcanvas: typeof TeOffcanvas;
    TePagination: typeof TePagination;
    TeProgress: typeof TeProgress;
    TeRadio: typeof TeRadio;
    TeRange: typeof TeRange;
    TeRating: typeof TeRating;
    TeScrollToTop: typeof TeScrollToTop;
    TeSelect: typeof TeSelect;
    TeSpinner: typeof TeSpinner;
    TeStepper: typeof TeStepper;
    TeSwitch: typeof TeSwitch;
    TeTable: typeof TeTable;
    TeTabs: typeof TeTabs;
    TeTextarea: typeof TeTextarea;
    TeTimePicker: typeof TeTimePicker;
    TeToast: typeof TeToast;
    TeToastLight: typeof TeToastLight;
    TeTooltip: typeof TeTooltip;
  }
}
