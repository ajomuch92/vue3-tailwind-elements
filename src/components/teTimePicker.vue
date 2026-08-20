<template>
  <div class="mt-2 px-5 py-2 bg-white rounded-lg border-2 time-picker" :class="{'pointer-events-none bg-gray-50': disabled}">
    <div class="flex">
      <select v-model="hours" name="hours" aria-label="Hours" class="bg-transparent text-xl appearance-none focus:outline-2 focus:outline-blue-500">
        <option v-for="hour in hourOptions" :key="hour" :value="hour">{{ pad(hour) }}</option>
      </select>
      <span class="text-xl mx-1">:</span>
      <select v-model="minutes" name="minutes" aria-label="Minutes" class="bg-transparent text-xl appearance-none focus:outline-2 focus:outline-blue-500">
        <option v-for="minute in 60" :key="minute" :value="minute - 1">{{ pad(minute - 1) }}</option>
      </select>
      <span class="text-xl mx-1">:</span>
      <select v-model="seconds" name="seconds" aria-label="Seconds" class="bg-transparent text-xl appearance-none mr-1 focus:outline-2 focus:outline-blue-500">
        <option v-for="second in 60" :key="second" :value="second - 1">{{ pad(second - 1) }}</option>
      </select>
      <select v-if="ampm" v-model="meridiem" name="ampm" aria-label="AM or PM" class="bg-transparent text-xl appearance-none focus:outline-2 focus:outline-blue-500">
        <option value="am">AM</option>
        <option value="pm">PM</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

defineOptions({ name: 'TeTimePicker' });

/** Milliseconds since the epoch, like `Date.prototype.valueOf()`. */
const model = defineModel<number | null>({ default: null });

const props = defineProps({
  ampm: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
});

const hours = ref(12);
const minutes = ref(0);
const seconds = ref(0);
const meridiem = ref<'am' | 'pm'>('am');

const hourOptions = computed(() =>
  props.ampm ? Array.from({ length: 12 }, (_, i) => i + 1) : Array.from({ length: 24 }, (_, i) => i)
);

/* Vue 3 removed filters, so the `| lpad` in the template had to become a
   plain function. */
const pad = (n: number) => String(n).padStart(2, '0');

const currentTime = computed(() => {
  let h = hours.value;
  if (props.ampm) {
    if (meridiem.value === 'pm') h = h === 12 ? 12 : h + 12;
    else if (h === 12) h = 0;
  }
  const date = new Date(model.value ?? Date.now());
  date.setHours(h, minutes.value, seconds.value, 0);
  return date.valueOf();
});

function readModel() {
  if (model.value == null || model.value === currentTime.value) return;
  const date = new Date(model.value);
  minutes.value = date.getMinutes();
  seconds.value = date.getSeconds();
  const h = date.getHours();
  if (props.ampm) {
    /* The old conversion produced hours like 25 for 1pm. */
    meridiem.value = h >= 12 ? 'pm' : 'am';
    hours.value = h % 12 === 0 ? 12 : h % 12;
  } else {
    hours.value = h;
  }
}

watch(currentTime, (value) => { model.value = value; });
watch(model, readModel);

readModel();
</script>

<style scoped>
  .time-picker {
    max-width: 12rem;
  }
</style>
