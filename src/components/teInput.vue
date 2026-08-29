<template>
  <div class="input-container">
    <div class="relative" :class="{'form-floating': floating}">
      <input
        :id="inputId"
        v-model="model"
        :type="resolvedType"
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
        :aria-invalid="isInvalid"
        :aria-describedby="fieldDescribedBy"
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
      <!-- A clickable icon is a real control, so it renders as a button: an <i>
           with a click handler is unreachable by keyboard. -->
      <button
        v-if="resolvedRightIcon && type !== 'number' && rightIconInteractive"
        type="button"
        class="te-input-icon absolute right-2 top-1/2 -translate-y-1/2"
        :aria-label="canReveal ? (revealed ? 'Hide password' : 'Show password') : undefined"
        :aria-pressed="canReveal ? revealed : undefined"
        @click="onRightIconClick"
      >
        <te-icon :family="rightIconFamily" :class="rightIconClass ?? iconSizeClass" :name="resolvedRightIcon" />
      </button>
      <te-icon
        v-else-if="resolvedRightIcon && type !== 'number'"
        class="text-gray-400 absolute right-2 top-1/2 -translate-y-1/2"
        :family="rightIconFamily"
        :class="rightIconClass ?? iconSizeClass"
        :name="resolvedRightIcon"
      />
      <button
        v-if="leftIcon && leftIconClickable"
        type="button"
        class="te-input-icon absolute left-2 top-1/2 -translate-y-1/2"
        @click="emit('left-icon-click', $event)"
      >
        <te-icon :family="leftIconFamily" :class="leftIconClass ?? iconSizeClass" :name="leftIcon" />
      </button>
      <te-icon
        v-else-if="leftIcon"
        class="text-gray-400 absolute left-2 top-1/2 -translate-y-1/2"
        :family="leftIconFamily"
        :class="leftIconClass ?? iconSizeClass"
        :name="leftIcon"
      />
      <label v-if="floating" :for="inputId" class="text-gray-700">{{placeholder}}</label>
    </div>
    <div v-if="helperText" class="text-sm mt-1" :class="{'text-red-500':isInvalid, 'text-gray-700': !isInvalid}">{{helperText}}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';
import teIcon from './teIcon.vue';
import { oneOf, SIZES } from '../types';
import { useField } from '../composables/useField';

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
  /* Reveal toggle. Defaults on for `type="password"` unless a custom
     `rightIcon` is given; pass `:revealable="false"` to suppress it. */
  revealable: { type: Boolean, default: undefined },
  rightIcon: { type: String, default: '' },
  rightIconFamily: { type: String, default: undefined },
  rightIconClass: { type: String, default: undefined },
  rightIconClickable: { type: Boolean, default: false },
  leftIcon: { type: String, default: '' },
  leftIconClickable: { type: Boolean, default: false },
  leftIconFamily: { type: String, default: undefined },
  leftIconClass: { type: String, default: undefined },
});

/* useId() is SSR-stable and needs no secure context, unlike
   crypto.randomUUID(), which is undefined over plain HTTP. */
const revealed = ref(false);

const canReveal = computed(() => props.revealable ?? (props.type === 'password' && !props.rightIcon));
const resolvedType = computed(() => (canReveal.value && revealed.value ? 'text' : props.type));
const resolvedRightIcon = computed(() =>
  canReveal.value ? (revealed.value ? 'eye-slash' : 'eye') : props.rightIcon
);
const rightIconInteractive = computed(() => canReveal.value || props.rightIconClickable);

function onRightIconClick(event: MouseEvent) {
  if (canReveal.value) revealed.value = !revealed.value;
  if (props.rightIconClickable) emit('right-icon-click', event);
}

const uid = useId();
/* A te-field around the input owns the id its <label for> points at, and the
   description and invalid state that go with it. Standalone, all three are
   simply absent. */
const { fieldId, fieldDescribedBy, fieldInvalid } = useField();
const inputId = computed(() => props.id ?? fieldId.value ?? uid);
const isInvalid = computed(() => props.invalid || fieldInvalid.value);

const sizeClass = computed(() => {
  const font = { small: 'text-sm', medium: 'text-base', large: 'text-xl' }[props.size];
  // The floating layout sets its own height and padding in the component layer,
  // and Tailwind utilities outrank that layer no matter the specificity — so
  // the size paddings have to be left off entirely, or the label never lines up.
  if (props.floating) return font;
  const padding = { small: 'px-2 py-1', medium: 'px-3 py-1.5', large: 'px-4 py-2' }[props.size];
  return `${padding} ${font}`;
});

/* The old flat `text-2xl` default made the glyph 32px tall inside a 38px
   medium field — it filled 84% of the height. Track the input size instead,
   and pin line-height so the icon box is exactly the glyph. */
const iconSizeClass = computed(() => ({
  small: 'text-base leading-none',
  medium: 'text-lg leading-none',
  large: 'text-xl leading-none',
}[props.size]));

const disabledClass = computed(() => ({ 'text-gray-700 bg-gray-100': props.disabled }));

const invalidClass = computed(() => ({
  'border-red-500 focus:border-red-600 invalid': isInvalid.value,
  'focus:text-gray-700 focus:border-blue-600': !isInvalid.value,
}));

const paddingForIcons = computed(() => ({
  'pr-9': !!resolvedRightIcon.value,
  'pl-9': !!props.leftIcon,
}));
</script>

<style scoped>
  .te-input-icon {
    display: flex;
    color: var(--color-gray-400, #99a1af);
    cursor: pointer;
  }

  .te-input-icon:hover {
    color: var(--color-gray-500, #6a7282);
  }

  .form-control.invalid {
    box-shadow: none !important;
  }
</style>
