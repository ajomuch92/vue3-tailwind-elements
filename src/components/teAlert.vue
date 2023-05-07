<template>
  <div class="alert" :class="getClass">
    <slot name="default">
      {{text}}
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'TeAlert'
  }
</script>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal','primary', 'success', 'info', 'warning', 'danger'].includes(value)
  },
  solid: {
    type: Boolean,
    default: false,
  }
});

const getClass = computed(() => ({
  [props.type]: true,
  'solid': props.solid,
}));
</script>
