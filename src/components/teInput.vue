<template>
  <div class="input-container">
    <div class="relative" :class="{'form-floating': floating}">
      <input
        v-bind="validProps"
        v-model="currentValue"
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
        :class="[sizeClass, ...disabledClass, ...invalidadClass, ...paddingForIcons]"
        :readonly="readonly"
        @blur="onBlurHandler"
        @change="onChangeHandler"
        @focus="onFocusHandler"
        @keydown="onKeyDownHandler"
        @keypress="onKeyPressHandler"
        @keyup="onKeyUpHandler"
        @click="onClickHandler"
      />
      <te-icon
        v-if="rightIcon&&type!='number'"
        class="text-gray-400 absolute right-2 top-1/2 translate-y-1/2"
        :family="rightIconFamily"
        :class="[{'cursor-pointer hover:text-gray-500': rightIconClickable}, rightIconClass]"
        :name="rightIcon"
        @click="rightIconClickable? emit('right-icon-click', $event): noop"
      />
      <te-icon
        v-if="leftIcon"
        class="text-gray-400 absolute left-2 top-1/2 translate-y-1/2"
        :class="[{'cursor-pointer hover:text-gray-500': leftIconClickable}, leftIconClass]"
        :family="leftIconFamily"
        :name="leftIcon"
        @click="leftIconClickable? emit('left-icon-click', $event): noop"
      />
      <label v-if="floating" class="text-gray-700">{{placeholder}}</label>
    </div>
    <div v-if="helperText" class="text-sm mt-1" :class="{'text-red-500':invalid, 'text-gray-700': !invalid}">{{helperText}}</div>
  </div>
</template>

<script>
export default {
  name: 'teInput',
}
</script>

<script setup>
import { computed, ref, watch } from 'vue';
import eventHook from '../hooks/eventHook';
import teIcon from './teIcon.vue';

const {
  onBlurHandler,
  onChangeHandler,
  onFocusHandler,
  onKeyDownHandler,
  onKeyPressHandler,
  onKeyUpHandler,
  onClickHandler,
} = eventHook();

const noop = () => {};

const emit = defineEmits(['update:modelValue', 'right-icon-click', 'left-icon-click']);

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  id: {
    type: String,
    default: () => crypto.randomUUID()
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => {
      return ['text', 'number', 'email', 'search', 'password', 'tel', 'url'].indexOf(value) !== -1
    }
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  form: {
    type: String,
    default: null
  },
  max: {
    type: [String, Number],
    default: null
  },
  maxlength: {
    type: [String, Number],
    default: null
  },
  min: {
    type: [String, Number],
    default: null
  },
  minlength: {
    type: [String, Number],
    default: null
  },
  name: {
    type: String,
    default: null
  },
  pattern: {
    type: RegExp,
    default: null
  },
  placeholder: {
    type: String,
    default: null
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  step: {
    type: [String, Number],
    default: null
  },
  invalid: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  helperText: {
    type: String,
    default: null,
  },
  floating: {
    type: Boolean,
    default: false,
  },
  rightIcon: {
    type: String,
    default: ''
  },
  rightIconFamily: {
    type: String,
    default: undefined
  },
  rightIconClass: {
    type: String,
    default: 'text-2xl'
  },
  rightIconClickable: {
    type: Boolean,
    default: false
  },
  leftIcon: {
    type: String,
    default: ''
  },
  leftIconClickable: {
    type: Boolean,
    default: false
  },
  leftIconFamily: {
    type: String,
    default: undefined
  },
  leftIconClass: {
    type: String,
    default: 'text-2xl'
  }
});

const currentValue = ref('');

const sizeClass = computed(() => {
  const classes = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-3 py-1.5 text-base',
    large: 'px-4 py-2 text-xl'
  }
  return classes[props.size]
});

const disabledClass = computed(() => ({ 'text-gray-700 bg-gray-100': props.disabled }));

const invalidadClass = computed(() => ({
  'border-red-500 focus:border-red-600 invalid': props.invalid,
  'focus:text-gray-700 focus:border-blue-600': !props.invalid
}));

const paddingForIcons = computed(() => ({
  'pr-9': !!props.rightIcon,
  'pl-9': !!props.leftIcon,
}));

const validProps = computed(() => {
  const props = { ...props };
  delete props.size;
  delete props.helperText;
  return props;
});

const valueComputed = computed(() => props.modelValue);

watch(currentValue, (val) => {
  emit('update:modelValue', val);
});

watch(valueComputed, (val) => {
  currentValue.value = val;
});

(() => {
  currentValue.value = props.modelValue;
})();
</script>

<style scoped>
  .form-control.invalid {
    box-shadow: none !important;
  }

  .translate-y-1\/2 {
    transform: translateY(-50%);
  }
</style>