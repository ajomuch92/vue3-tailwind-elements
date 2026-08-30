<template>
  <div class="antialiased sans-serif date-picker" :class="{'opacity-50': disabled}">
    <div ref="wrapper" class="relative">
      <slot name="trigger">
        <input
          :id="fieldId"
          ref="trigger"
          type="text"
          readonly
          aria-haspopup="dialog"
          :aria-describedby="fieldDescribedBy"
          :aria-invalid="fieldInvalid || undefined"
          :aria-expanded="showDatepicker"
          :value="datepickerValue"
          @click="showDatepicker = !showDatepicker"
          @keydown="onTriggerKeydown"
          class="
            w-full
            pl-4
            pr-10
            py-3
            leading-none
            rounded-lg
            focus:outline-none
            te-text-mild
            font-medium
            border-2
            z-0
          "
          :class="{'te-active cursor-not-allowed': disabled, 'border-red-500': fieldInvalid}"
          :placeholder="placeholder"
          :disabled="disabled"
        />
      </slot>

      <div class="absolute top-1/2 transform -translate-y-1/2 right-0 px-3 py-2">
        <slot name="icon">
          <svg
            class="h-6 w-6 te-text-faint"
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

      <Teleport to="body" :disabled="!appendToBody">
        <div
          class="
            te-raised
            mt-12
            rounded-lg
            shadow
            p-4
            absolute
            top-0
            left-0
            z-50
          "
          :style="appendToBody ? { ...anchorStyle, width: '17rem' } : { width: '17rem' }"
          v-show="showDatepicker"
          v-click-outside="hideCalendar"
          role="dialog"
          :aria-label="`${monthNames[month]} ${year}`"
          @keydown.esc.prevent="closeAndRestore"
        >
        <div class="flex justify-between items-center mb-2">
          <div>
            <select
              name="month"
              aria-label="Month"
              class="bg-transparent text-lg font-bold te-text-soft appearance-none focus:outline-2 focus:outline-blue-500"
              v-model="month"
            >
              <option v-for="(month, key) in monthNames" :key="key" :value="key">{{ month }}</option>
            </select>
            <select
              name="year"
              aria-label="Year"
              class="bg-transparent text-lg font-normal te-text-mild appearance-none focus:outline-2 focus:outline-blue-500"
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
                te-hover-strong
                p-1
                rounded-full
              "
              :class="{'opacity-25 pointer-events-none': !isPreviousAllowed}"
              @click="deductMonth"
            >
              <svg
                class="h-6 w-6 te-text-muted inline-flex"
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
                te-hover-strong
                p-1
                rounded-full
              "
              :class="{'opacity-25 pointer-events-none': !isNextAllowed}"
              @click="addMonth"
            >
              <svg
                class="h-6 w-6 te-text-muted inline-flex"
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
              <div class="te-text-soft font-medium text-center text-xs">
                {{day}}
              </div>
            </div>
          </template>
        </div>

        <div ref="grid" class="flex flex-wrap -mx-1" @keydown="onGridKeydown">
          <template v-for="key in blankdays.length" :key="`bd-${key}`">
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
                :data-day="date"
                role="button"
                :tabindex="date === focusedDay ? 0 : -1"
                :aria-label="dayLabel(date)"
                :aria-pressed="isToday(date)"
                :aria-disabled="isNotAllowedDate(date) || isOutOfRange(date) ? true : undefined"
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
                  'te-text-body hover:bg-blue-200': !isToday(date), 
                  'opacity-25 pointer-events-none': isNotAllowedDate(date) || isOutOfRange(date)
                }"
              >
                {{date}}
              </div>
            </div>
          </template>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import type { PropType } from 'vue';
import { clickOutside as vClickOutside } from '../directives';
import { useBodyAnchor } from '../composables/useBodyAnchor';
import { useField } from '../composables/useField';

defineOptions({ name: 'TeDatePicker' });

const model = defineModel<Date | null>({ default: null });

const props = defineProps({
  monthNames: {
    type: Array as PropType<string[]>,
    default: () => [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
  },
  days: {
    type: Array as PropType<string[]>,
    default: () => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: 'Select a date' },
  maxDate: { type: Date, default: null },
  minDate: { type: Date, default: null },
  appendToBody: { type: Boolean, default: false },
  notAllowedDates: {
    type: Array as PropType<Date[]>,
    default: () => [],
    validator: (value: unknown) =>
      Array.isArray(value) && value.every((r) => r instanceof Date && !Number.isNaN(r.getTime())),
  },
});

const { fieldId, fieldDescribedBy, fieldInvalid } = useField();

const showDatepicker = ref(false);
const wrapper = ref<HTMLElement | null>(null);
const trigger = ref<HTMLInputElement | null>(null);
const grid = ref<HTMLElement | null>(null);
/* The day the arrows stand on. One cell is in the tab order and the rest are
   reached with the keyboard, so the grid is a single stop, not thirty-one. */
const focusedDay = ref(1);
const { anchorStyle } = useBodyAnchor(wrapper, showDatepicker, () => props.appendToBody);
const month = ref(0);
const year = ref(0);
const noOfDays = ref<number[]>([]);
const blankdays = ref<number[]>([]);

const datepickerValue = computed(() => model.value ? model.value.toLocaleDateString() : '');

function toDate(date: number | Date) {
  return date instanceof Date ? date : new Date(year.value, month.value, date);
}

function initDate() {
  const today = model.value ?? new Date();
  month.value = today.getMonth();
  year.value = today.getFullYear();
}

function isToday(date: number) {
  const today = model.value ?? new Date();
  return today.toDateString() === toDate(date).toDateString();
}

function isNotAllowedDate(date: number | Date) {
  return props.notAllowedDates.some((r) => r.getTime() === toDate(date).getTime());
}

function isOutOfRange(date: number | Date) {
  if (!props.minDate && !props.maxDate) return false;
  const d = toDate(date);
  return (!!props.minDate && d < props.minDate) || (!!props.maxDate && d > props.maxDate);
}

function getDateValue(date: number) {
  model.value = new Date(year.value, month.value, date);
  closeAndRestore();
}

function closeAndRestore() {
  showDatepicker.value = false;
  /* Only reachable when the default trigger is in use; a custom one owns its
     own focus. */
  trigger.value?.focus();
}

const dayLabel = (date: number) => `${props.monthNames[month.value]} ${date}, ${year.value}`;

const focusDay = () =>
  grid.value?.querySelector<HTMLElement>(`[data-day="${focusedDay.value}"]`)?.focus();

/** Moves the grid to `target`, crossing into another month when it has to. */
function goTo(target: Date) {
  month.value = target.getMonth();
  year.value = target.getFullYear();
  focusedDay.value = target.getDate();
  nextTick(focusDay);
}

const moveDays = (delta: number) => goTo(new Date(year.value, month.value, focusedDay.value + delta));

function moveMonths(delta: number) {
  /* Clamped, so leaving the 31st never lands two months ahead. */
  const daysInTarget = new Date(year.value, month.value + delta + 1, 0).getDate();
  goTo(new Date(year.value, month.value + delta, Math.min(focusedDay.value, daysInTarget)));
}

function onTriggerKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') { showDatepicker.value = false; return; }
  if (props.disabled || !['Enter', ' ', 'ArrowDown'].includes(event.key)) return;
  event.preventDefault();
  showDatepicker.value = true;
}

function onGridKeydown(event: KeyboardEvent) {
  const weekday = new Date(year.value, month.value, focusedDay.value).getDay();

  switch (event.key) {
    case 'ArrowLeft': moveDays(-1); break;
    case 'ArrowRight': moveDays(1); break;
    case 'ArrowUp': moveDays(-7); break;
    case 'ArrowDown': moveDays(7); break;
    case 'Home': moveDays(-weekday); break;
    case 'End': moveDays(6 - weekday); break;
    case 'PageUp': moveMonths(-1); break;
    case 'PageDown': moveMonths(1); break;
    case 'Enter':
    case ' ':
      if (!isNotAllowedDate(focusedDay.value) && !isOutOfRange(focusedDay.value)) {
        getDateValue(focusedDay.value);
      }
      break;
    default: return;
  }
  event.preventDefault();
}

function addMonth() {
  if (month.value === 11) {
    month.value = 0;
    year.value += 1;
  } else {
    month.value += 1;
  }
}

function deductMonth() {
  if (month.value === 0) {
    month.value = 11;
    year.value -= 1;
  } else {
    month.value -= 1;
  }
}

function getNoOfDays() {
  const daysInMonth = new Date(year.value, month.value + 1, 0).getDate();
  const dayOfWeek = new Date(year.value, month.value, 1).getDay();
  blankdays.value = Array.from({ length: dayOfWeek }, (_, i) => i + 1);
  noOfDays.value = Array.from({ length: daysInMonth }, (_, i) => i + 1);
}

function hideCalendar() {
  showDatepicker.value = false;
}

const years = computed(() => {
  if (!year.value) return [];
  const initYear = year.value - 100;
  let list = Array.from({ length: 110 }, (_, i) => initYear + i).reverse();
  if (props.minDate) {
    const min = props.minDate.getFullYear();
    list = list.filter((r) => r >= min);
  }
  if (props.maxDate) {
    const max = props.maxDate.getFullYear();
    list = list.filter((r) => r <= max);
  }
  return list;
});

const isPreviousAllowed = computed(() => {
  if (!props.minDate) return true;
  return !isOutOfRange(new Date(year.value, month.value, 0));
});

const isNextAllowed = computed(() => {
  if (!props.maxDate) return true;
  return !isOutOfRange(new Date(year.value, month.value + 1, 1));
});

watch(model, initDate);
watch([month, year], getNoOfDays);

/* Opening hands the keyboard the grid, starting on the selected day when it is
   the one on screen. */
watch(showDatepicker, (open) => {
  if (!open) return;
  const start = model.value ?? new Date();
  const onScreen = start.getMonth() === month.value && start.getFullYear() === year.value;
  focusedDay.value = onScreen ? start.getDate() : 1;
  nextTick(focusDay);
});

initDate();
getNoOfDays();
</script>

<style scoped>
  .date-picker {
    max-width: 12rem;
  }
</style>