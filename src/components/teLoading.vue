<template>
  <div ref="el" class="backdrop absolute top-0 left-0 flex flex-col justify-center items-center h-screen w-full">
    <te-spinner :type="type" :size="size" :color="color"/>
    <label>{{text}}</label>
  </div>
</template>

<script>
export default {
  name: 'teLoading',
}
</script>

<script setup>
import { ref } from 'vue';
import teSpinner from './teSpinner.vue';

const el = ref(undefined);

const props = defineProps({
  type: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'growing'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium','large'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['normal','primary', 'secondary', 'success', 'warning', 'danger', 'pink', 'purple', 'light', 'dark'].includes(value)
  },
  text: {
    type: String,
  }
});

function close() {
  setTimeout(() => {
    // this.$destroy();
    el.value.parentNode.removeChild(el.value);
  }, 500);
}

</script>

<style scoped>
  .backdrop {
    background-color: rgba(0, 0, 0, 0.25);
    z-index: 9999;
  }
</style>