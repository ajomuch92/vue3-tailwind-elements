<template>
  <div ref="root" class="field" :class="{ 'field-invalid': isInvalid }">
    <label v-if="label || $slots.label" :for="labelFor" class="field-label">
      <slot name="label">{{ label }}</slot>
      <span v-if="required" class="field-required" aria-hidden="true">*</span>
    </label>

    <!-- The control. This library's fields read the id, the description and the
         invalid state off the injected context; the slot props are there for
         anything else. -->
    <slot :id="controlId" :described-by="describedBy" :invalid="isInvalid" />

    <p v-if="message" :id="messageId" class="field-message">
      <slot name="message" :invalid="isInvalid">{{ message }}</slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useId } from 'vue';
import { provideField } from '../composables/useField';

defineOptions({ name: 'TeField' });

const props = defineProps({
  label: { type: String, default: '' },
  /** The hint under the control while everything is fine. */
  helper: { type: String, default: '' },
  /** Replaces `helper` and marks the field invalid on its own. */
  error: { type: String, default: '' },
  invalid: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  /** Overrides the generated id, for a control that already has one. */
  id: { type: String, default: undefined },
});

const uid = useId();
const controlId = computed(() => props.id ?? uid);
const messageId = computed(() => `${controlId.value}-message`);

/* A message is a state of its own: passing `error` is enough, so a form does
   not have to keep a boolean in step with its text. */
const isInvalid = computed(() => props.invalid || !!props.error);
const message = computed(() => (isInvalid.value ? props.error || props.helper : props.helper));
const describedBy = computed(() => (message.value ? messageId.value : undefined));

provideField({ id: controlId, describedBy, invalid: isInvalid });

const root = ref<HTMLElement | null>(null);
const labelFor = ref(controlId.value);

/* Whatever id the control ended up with is the one the label has to name — it
   may have carried its own, and a plain <input> dropped in here carries none.
   Injection cannot answer that, but the DOM can. */
onMounted(() => {
  const control = root.value?.querySelector<HTMLElement>(
    'input, select, textarea, [contenteditable]'
  );
  if (!control) return;
  if (!control.id) control.id = controlId.value;
  labelFor.value = control.id;
});
</script>
