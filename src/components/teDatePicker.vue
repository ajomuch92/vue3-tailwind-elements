<template>
  <div class="antialiased sans-serif date-picker">
    <div class="relative">
      <slot name="trigger">
        <input
          type="text"
          readonly
          v-model="datepickerValue"
          @click="showDatepicker = !showDatepicker"
          @keydown.esc="showDatepicker = false"
          class="
            w-full
            pl-4
            pr-10
            py-3
            leading-none
            rounded-lg
            focus:outline-none focus:shadow-outline
            text-gray-600
            font-medium
            border-2
            z-0
          "
          :placeholder="placeholder"
          :disabled="disabled"
        />
      </slot>

      <div class="absolute top-1/2 transform -translate-y-1/2 right-0 px-3 py-2">
        <slot name="icon">
          <svg
            class="h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </slot>
      </div>

      <div
        class="
          bg-white
          mt-12
          rounded-lg
          shadow
          p-4
          absolute
          top-0
          left-0
          z-50
        "
        style="width: 17rem"
        v-show="showDatepicker"
        v-click-outside="hideCalendar"
      >
        <div class="flex justify-between items-center mb-2">
          <div>
            <select
              name="hours"
              class="bg-transparent text-lg font-bold text-gray-800 appearance-none outline-none"
              v-model="month"
            >
              <option v-for="(month, key) in monthNames" :key="key" :value="key">{{ month }}</option>
            </select>
            <select
              name="hours"
              class="bg-transparent text-lg font-normal text-gray-600 appearance-none outline-none"
              v-model="year"
            >
              <option v-for="($year, key) in years" :key="key" :value="$year">{{ $year }}</option>
            </select>
          </div>
          <div>
            <button
              type="button"
              class="
                transition
                ease-in-out
                duration-100
                inline-flex
                cursor-pointer
                hover:bg-gray-200
                p-1
                rounded-full
              "
              :class="{'opacity-25 pointer-events-none': !isPreviousAllowed}"
              @click="deductMonth"
            >
              <svg
                class="h-6 w-6 text-gray-500 inline-flex"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              class="
                transition
                ease-in-out
                duration-100
                inline-flex
                cursor-pointer
                hover:bg-gray-200
                p-1
                rounded-full
              "
              :class="{'opacity-25 pointer-events-none': !isNextAllowed}"
              @click="addMonth"
            >
              <svg
                class="h-6 w-6 text-gray-500 inline-flex"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex flex-wrap mb-3 -mx-1">
          <template v-for="(day, index) in days" :key="`d-${index}`">
            <div style="width: 14.26%" class="px-1">
              <div class="text-gray-800 font-medium text-center text-xs">
                {{day}}
              </div>
            </div>
          </template>
        </div>

        <div class="flex flex-wrap -mx-1">
          <template v-for="(blankday, key) in blankdays" :key="`bd-${key}`">
            <div
              style="width: 14.28%"
              class="
                text-center
                border
                p-1
                border-transparent
                text-sm
              "
            />
          </template>
          <template
            v-for="(date, dateIndex) in noOfDays"
            :key="dateIndex"
          >
            <div style="width: 14.28%" class="px-1 mb-1">
              <div
                @click="getDateValue(date)"
                class="
                  cursor-pointer
                  text-center text-sm
                  rounded-full
                  leading-loose
                  transition
                  ease-in-out
                  duration-100
                "
                :class="{
                  'bg-blue-500 text-white': isToday(date), 
                  'text-gray-700 hover:bg-blue-200': !isToday(date), 
                  'opacity-25 pointer-events-none': isNotAllowedDate(date) || isOutOfRange(date)
                }"
              >
                {{date}}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TeDatePicker'
  };
</script>

<script setup>
import { computed, ref, watch } from 'vue';
import { clickOutside as vClickOutside} from './directives';

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Date,
    default: null,
  },
  monthNames: {
    type: Array,
    default: () => [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  },
  days: {
    type: Array,
    default: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Select a date'
  },
  maxDate: {
    type: Date,
    default: null
  },
  minDate: {
    type: Date,
    default: null
  },
  notAllowedDates: {
    type: Array,
    default: () => [],
    validator: (value) => value.length === 0 || value.every(r => r instanceof Date && r.getTime())
  },
});

const datepickerValue = ref('');
const showDatepicker = ref(false);
const month = ref(0);
const year = ref(0);
const noOfDays = ref([]);
const blankdays = ref([]);

function initDate() {
  const today = props.modelValue || new Date();
  month.value = today.getMonth();
  year.value = today.getFullYear();
  if (props.modelValue) {
    datepickerValue.value = today.toLocaleDateString();
  }
}

function isToday(date) {
  const d = new Date(year.value, month.value, date);
  const today = props.modelValue || new Date();
  return today.toDateString() === d.toDateString();
}

function isNotAllowedDate(date) {
  const d = date instanceof Date && date.getTime()? date : new Date(year.value, month.value, date);
  return props.notAllowedDates.map(r => r.getTime()).includes(d.getTime());
}

function isOutOfRange(date) {
  if (props.minDate || props.maxDate) {
    const d = date instanceof Date && date.getTime() ? date : new Date(year.value, month.value, date);
    return d < props.minDate || d > props.maxDate;
  }
  return false;
}

function getDateValue(date) {
  const selectedDate = new Date(year.value, month.value, date);
  emit('update:modelValue', selectedDate);
  datepickerValue.value = selectedDate.toLocaleDateString();
  showDatepicker.value = false;
}

function addMonth() {
  if (month.value == 11) {
    month.value = -1;
    year.value += 1;
  }
  month.value += 1;
  getNoOfDays();
}

function deductMonth() {
  if (month.value === 0) {
    month.value = 12;
    year.value -= 1;
  }
  month.value -= 1;
  getNoOfDays();
}

function getNoOfDays() {
  const daysInMonth = new Date(
    year.value,
    month.value + 1,
    0
  ).getDate();
  const dayOfWeek = new Date(year.value, month.value).getDay();
  const blankdaysArray = [];
  for (var i = 1; i <= dayOfWeek; i++) {
    blankdaysArray.push(i);
  }
  const daysArray = [];
  for (var i = 1; i <= daysInMonth; i++) {
    daysArray.push(i);
  }
  blankdays.value = blankdaysArray;
  noOfDays.value = daysArray;
}

function hideCalendar() {
  showDatepicker.value = false;
}

const computedValue = computed(() => props.modelValue);

const years = computed(() => {
  let years = [];
  if (year.value) {
    const initYear = year.value - 100;
    years = (new Array(110).fill().map((_, i) => initYear + i)).reverse();
    if (props.minDate) {
      years = years.filter(r => r >= props.minDate.getFullYear());
    }
    if (props.maxDate) {
      years = years.filter(r => r <= props.maxDate.getFullYear());
    }
  }
  return years;
});

const isPreviousAllowed = computed(() => {
  if (props.minDate) {
    const date = new Date(year.value, month.value, 1);
    date.setDate(1);
    date.setMonth(date.getMonth() - 1);
    const lastDayOfPrevMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    if (isOutOfRange(lastDayOfPrevMonth) || (isOutOfRange(date) && isOutOfRange(lastDayOfPrevMonth))) {
      return false;
    } 
  }
  return true;
});

const isNextAllowed = computed(() => {
  if (props.maxDate) {
    const date = new Date(year.value, month.value + 2, 0);
    const lastDayCurrentMonth = new Date(year.value, month.value + 1, 0);
    if (isOutOfRange(lastDayCurrentMonth) || (isOutOfRange(date) && isOutOfRange(lastDayCurrentMonth))) {
      return false;
    } 
  }
  return true;
});

watch(computedValue, () => {
  initDate();
});

watch(month, () => {
  getNoOfDays();
});

watch(year, (val) => {
  if (val !== 0) {
    getNoOfDays();
  }
});

initDate();
getNoOfDays();
</script>

<style scoped>
  .date-picker {
    max-width: 12rem;
  }
</style>