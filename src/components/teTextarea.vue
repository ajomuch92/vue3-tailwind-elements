<template>
  <textarea
    v-model="model"
    class="form-control"
    :rows="rows"
    :cols="cols"
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
</template>

<script setup lang="ts">
defineOptions({ name: 'TeTextarea' });

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

defineProps({
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  rows: { type: Number, default: 3 },
  cols: { type: Number, default: undefined },
});
</script>
