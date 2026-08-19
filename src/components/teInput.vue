<template>
  <div class="input-container">
    <div class="relative" :class="{'form-floating': floating}">
      <input
        :id="inputId"
        v-model="model"
        :type="type"
        :name="name"
        :form="form"
        :min="min"
        :max="max"
        :minlength="minlength"
        :maxlength="maxlength"
        :step="step"
        :pattern="pattern"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :aria-invalid="invalid"
        class="
          form-control
          block
          w-full
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:bg-white focus:outline-none
        "
        :class="[sizeClass, disabledClass, invalidClass, paddingForIcons]"
        @blur="emit('blur', $event)"
        @change="emit('change', $event)"
        @focus="emit('focus', $event)"
        @keydown="emit('keydown', $event)"
        @keypress="emit('keypress', $event)"
        @keyup="emit('keyup', $event)"
        @click="emit('click', $event)"
      />
      <te-icon
        v-if="rightIcon && type !== 'number'"
        class="text-gray-400 absolute right-2 top-1/2 translate-y-1/2"
        :family="rightIconFamily"
        :class="[{'cursor-pointer hover:text-gray-500': rightIconClickable}, rightIconClass]"
        :name="rightIcon"
        @click="rightIconClickable && emit('right-icon-click', $event)"
      />
      <te-icon
        v-if="leftIcon"
        class="text-gray-400 absolute left-2 top-1/2 translate-y-1/2"
        :class="[{'cursor-pointer hover:text-gray-500': leftIconClickable}, leftIconClass]"
        :family="leftIconFamily"
        :name="leftIcon"
        @click="leftIconClickable && emit('left-icon-click', $event)"
      />
      <label v-if="floating" :for="inputId" class="text-gray-700">{{placeholder}}</label>
    </div>
    <div v-if="helperText" class="text-sm mt-1" :class="{'text-red-500':invalid, 'text-gray-700': !invalid}">{{helperText}}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import teIcon from './teIcon.vue';
import { oneOf, SIZES } from '../types';

defineOptions({ name: 'TeInput' });

const emit = defineEmits<{
  blur: [event: FocusEvent];
  change: [event: Event];
  focus: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
  keypress: [event: KeyboardEvent];
  keyup: [event: KeyboardEvent];
  click: [event: MouseEvent];
  'right-icon-click': [event: MouseEvent];
  'left-icon-click': [event: MouseEvent];
}>();

const model = defineModel<string | number>({ default: '' });

const props = defineProps({
  id: { type: String, default: undefined },
  type: { ...oneOf(['text', 'number', 'email', 'search', 'password', 'tel', 'url'] as const), default: 'text' },
  disabled: { type: Boolean, default: false },
  form: { type: String, default: undefined },
  max: { type: [String, Number], default: undefined },
  maxlength: { type: [String, Number], default: undefined },
  min: { type: [String, Number], default: undefined },
  minlength: { type: [String, Number], default: undefined },
  name: { type: String, default: undefined },
  /** Raw HTML `pattern` attribute source, e.g. `[A-Za-z]{3}`. */
  pattern: { type: String, default: undefined },
  placeholder: { type: String, default: undefined },
  readonly: { type: Boolean, default: false },
  step: { type: [String, Number], default: undefined },
  invalid: { type: Boolean, default: false },
  size: { ...oneOf(SIZES), default: 'medium' },
  helperText: { type: String, default: undefined },
  floating: { type: Boolean, default: false },
  rightIcon: { type: String, default: '' },
  rightIconFamily: { type: String, default: undefined },
  rightIconClass: { type: String, default: 'text-2xl' },
  rightIconClickable: { type: Boolean, default: false },
  leftIcon: { type: String, default: '' },
  leftIconClickable: { type: Boolean, default: false },
  leftIconFamily: { type: String, default: undefined },
  leftIconClass: { type: String, default: 'text-2xl' },
});

/* useId() is SSR-stable and needs no secure context, unlike
   crypto.randomUUID(), which is undefined over plain HTTP. */
const uid = useId();
const inputId = computed(() => props.id ?? uid);

const sizeClass = computed(() => ({
  small: 'px-2 py-1 text-sm',
  medium: 'px-3 py-1.5 text-base',
  large: 'px-4 py-2 text-xl',
}[props.size]));

const disabledClass = computed(() => ({ 'text-gray-700 bg-gray-100': props.disabled }));

const invalidClass = computed(() => ({
  'border-red-500 focus:border-red-600 invalid': props.invalid,
  'focus:text-gray-700 focus:border-blue-600': !props.invalid,
}));

const paddingForIcons = computed(() => ({
  'pr-9': !!props.rightIcon,
  'pl-9': !!props.leftIcon,
}));
</script>

<style scoped>
  .form-control.invalid {
    box-shadow: none !important;
  }

  .translate-y-1\/2 {
    transform: translateY(-50%);
  }
</style>
