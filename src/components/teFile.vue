<template>
  <input class="form-control file-control"
    :class="[size]"
    type="file"
    :disabled="disabled"
    :accept="accept"
    :multiple="multiple"
    @change="fileChange"
  >
</template>

<script setup>

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: ''
  },
  accept: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
});

function getBase64(file) {
  return new Promise ((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

async function fileChange(e) {
  const files = e.target.files || e.dataTransfer.files;
  if(files.length) {
    const filesConverted = [];
    for(const file of files) {
      const base64 = await getBase64(file);
      filesConverted.push(base64);
    }
    if(filesConverted.length === 1) {
      emit('update:modelValue', filesConverted[0]);
    } else if (filesConverted.length > 1) {
      emit('update:modelValue', filesConverted);
    }
  }
}
</script>

<script>
export default {
  name: 'teFile',
}
</script>
