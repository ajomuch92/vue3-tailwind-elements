<template>
  <div class="stepper-wrapp">
    <ul class="stepper grid w-full m-auto relative" :style="{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }">
      <hr class="w-full absolute top-1/2 -translate-y-1/2" />
      <li v-for="(step, key) in steps" :key="key" class="flex-auto">
        <div
          class="step-wrap flex cursor-pointer items-center no-underline"
          :class="{
            'justify-center': key > 0 && key < steps.length - 1,
            'justify-end': key === steps.length - 1,
            'active': key === model,
            'cursor-not-allowed opacity-70': step.disabled,
          }"
          @click="select(key)"
        >
          <span class="px-2 py-1 bg-white flex items-center z-10">
            <span
              class="step mr-2 flex items-center justify-center rounded-full text-sm w-8 h-8"
              :class="{ 'active': key === model, 'success': key < model, 'cursor-not-allowed': step.disabled }"
            >
              <slot name="icon" :step="step" :index="key">{{ key + 1 }}</slot>
            </span>
            <span class="font-medium text-gray-500">
              <slot name="label" :step="step" :index="key">{{ step.label }}</slot>
            </span>
          </span>
        </div>
      </li>
    </ul>
    <div class="relative w-full overflow-hidden">
      <template v-for="index in steps.length" :key="index">
        <div v-show="index - 1 === model" class="step-content relative float-left w-full" role="tabpanel">
          <slot :name="`step-${index}`" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

defineOptions({ name: 'TeStepper' });

export interface Step {
  label?: string;
  disabled?: boolean;
}

const model = defineModel<number>({ default: 0 });

/* The old file also imported a `sizeMixin` from './mixins', which does not
   exist, and built `grid-cols-${steps.length}` at runtime — a class Tailwind
   never sees. The column count is an inline style now. */
const props = defineProps({
  steps: {
    type: Array as PropType<Step[]>,
    required: true,
    validator: (value: unknown) => Array.isArray(value) && value.length > 0 && value.length <= 12,
  },
});

function select(index: number) {
  if (!props.steps[index]?.disabled) model.value = index;
}
</script>

<style scoped>
  /* No <Transition> here: it is single-element only, and wrapping a v-for in
     one leaves the outgoing panel without its display:none. */

  .stepper, .step-wrap {
    height: 4rem;
  }

  .step {
    background-color: #ebedef;
  }

  .step.active {
    background-color: #e3ebf7;
  }

  .step-wrap:hover:not(.cursor-not-allowed), .step-wrap.active, .step-wrap.active > span {
    background-color: #f9f9f9;
  }

  .step.success:not(.cursor-not-allowed) {
    background-color: #d6fae4;
  }

  .step-wrap:hover:not(.cursor-not-allowed) > span {
    background-color: #f9f9f9 !important;
  }

  .step-content {
    display: block;
    margin-right: -100%;
    backface-visibility: hidden;
    min-height: inherit;
  }
</style>
