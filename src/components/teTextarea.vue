<template>
  <!-- A plain block: shrink-wrapping it would line the counter up with the
       field, but it would also swallow a `w-full` written on the component. -->
  <div class="textarea-container">
    <textarea
      v-bind="$attrs"
      v-model="model"
      class="form-control"
      :rows="rows"
      :cols="cols"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      @blur="emit('blur', $event as FocusEvent)"
      @change="emit('change', $event)"
      @focus="emit('focus', $event as FocusEvent)"
      @keydown="emit('keydown', $event as KeyboardEvent)"
      @keypress="emit('keypress', $event as KeyboardEvent)"
      @keyup="emit('keyup', $event as KeyboardEvent)"
    />
    <div v-if="counter" class="textarea-counter mt-1 text-right text-sm text-gray-500">
      <slot name="counter" :length="length" :maxlength="maxlength">{{ counterText }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/* The wrapper is the root now, so `class` and the rest would land on it
   instead of the textarea the way they used to. */
defineOptions({ name: 'TeTextarea', inheritAttrs: false });

/* Replaces the `eventMixin` import, which pointed at a file that does not
   exist — the component could not even be built. */
const emit = defineEmits<{
  blur: [event: FocusEvent];
  change: [event: Event];
  focus: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
  keypress: [event: KeyboardEvent];
  keyup: [event: KeyboardEvent];
}>();

const model = defineModel<string>({ default: '' });

const props = defineProps({
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  rows: { type: Number, default: 3 },
  cols: { type: Number, default: undefined },
  maxlength: { type: [String, Number], default: undefined },
  /** Shows the character count under the field: `x/y` with a `maxlength`, plain `x` without one. */
  counter: { type: Boolean, default: false },
});

/* `.length` counts UTF-16 code units, which is exactly what the browser
   enforces `maxlength` in — so the count and the limit can never disagree. */
const length = computed(() => String(model.value ?? '').length);

const counterText = computed(() =>
  props.maxlength === undefined || props.maxlength === ''
    ? `${length.value}`
    : `${length.value}/${props.maxlength}`
);
</script>
