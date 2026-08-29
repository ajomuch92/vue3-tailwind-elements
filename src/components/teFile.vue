<template>
  <input :id="fieldId" class="form-control file-control"
    :class="[size]"
    type="file"
    :aria-describedby="fieldDescribedBy"
    :aria-invalid="fieldInvalid || undefined"
    :disabled="disabled"
    :accept="accept"
    :multiple="multiple"
    @change="fileChange"
  >
</template>

<script setup lang="ts">
import { oneOf, SIZES } from '../types';
import { useField } from '../composables/useField';

defineOptions({ name: 'TeFile' });

const { fieldId, fieldDescribedBy, fieldInvalid } = useField();

const model = defineModel<string | string[]>({ default: '' });

defineProps({
  accept: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  size: { ...oneOf(SIZES), default: 'medium' },
});

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
  });
}

async function fileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (!files?.length) return;
  const filesConverted = await Promise.all([...files].map(getBase64));
  model.value = filesConverted.length === 1 ? filesConverted[0] : filesConverted;
}
</script>
