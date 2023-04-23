<template>
  <button
    ref="buttonRef"
    class="btn"
    :class="getClass"
    :disabled="disabled"
    :type="buttonType"
    @click="clickHandler"
  >
    <te-spinner  v-if="loading" :color="type=='light'? 'primary': 'light'" class="mx-1 align-sub" size="small"/>
    <slot name="default" />
    <span v-if="showRipple&&ripple" class="ripple" :style="styleRipple"/>
  </button>
</template>

<script setup>
import { computed, ref } from 'vue';
import teSpinner from './teSpinner.vue';

const emit = defineEmits(['click']);

const props = defineProps({
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['normal', 'primary', 'secondary', 'success', 'warning', 'danger', 'pink', 'purple', 'light', 'dark'].includes(value)
  },
  buttonType: {
    type: String,
    default: 'button',
    validator: (value) => ['button','reset', 'submit'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium','large'].includes(value)
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
  shadowed: {
    type: Boolean,
    default: false,
  },
  uppercased: {
    type: Boolean,
    default: false,
  },
  onlyText: {
    type: Boolean,
    default: false,
  },
  noRounded: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  ripple: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: Boolean,
    default: false,
  },
});

const buttonRef = ref(undefined);
const showRipple = ref(false);
const styleRipple = ref({});
const ripples = ref([]);

function clickHandler(event) {
  if (props.ripple) {
    setRipple(event);
  }
  emit('click', event);
}

function setRipple(event) {
  const button = buttonRef.value;
  const style = {};
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  style.width = style.height = `${diameter}px`;
  style.left = `${event.offsetX - radius}px`;
  style.top = `${event.offsetY - radius}px`;
  styleRipple.value = style;
  showRipple.value = true;
  setTimeout(() => {
    showRipple.value = false;
  }, 700)
}

const getClass = computed(() => {
  const sizes = {
    small: 'md',
    medium: 'lg',
    large: 'lg'
  };
  return {
    [props.type]: true,
    [props.size]: true,
    'only-text': props.onlyText && !props.outlined,
    'outlined': props.outlined,
    'rounded': !props.rounded && !props.noRounded,
    'rounded-full': props.rounded && !props.noRounded,
    'uppercase': props.uppercased,
    'shadow': props.shadowed,
    [`hover:shadow-${sizes[props.size]}`]: props.shadowed,
    'cursor-not-allowed opacity-50': props.disabled,
    'opacity-50 cursor-not-allowed': props.loading,
    'relative overflow-hidden': props.ripple,
    'icon': props.icon,
  }
});
</script>

<style scoped>
span.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple-effect 800ms linear;
  background-color: rgba(255, 255, 255, 0.7);
}

@keyframes ripple-effect {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>