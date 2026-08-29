<template>
  <div class="calendar flex flex-col gap-3">
    <slot name="toolbar" :label="label" :view="view" :prev="prev" :next="next" :today="today" :shows-today="showsToday" :set-view="setView">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-1">
          <button type="button" class="btn light small" :aria-label="labelPrev" @click="prev">&lsaquo;</button>
          <button type="button" class="btn light small" :disabled="showsToday" @click="today">{{ labelToday }}</button>
          <button type="button" class="btn light small" :aria-label="labelNext" @click="next">&rsaquo;</button>
        </div>

        <h2 class="text-lg font-semibold te-text-body">{{ label }}</h2>

        <div class="flex items-center gap-1">
          <button
            v-for="option in ['month', 'week']"
            :key="option"
            type="button"
            class="btn small"
            :class="view === option ? 'primary' : 'light'"
            @click="setView(option as CalendarView)"
          >{{ option === 'month' ? labelMonth : labelWeek }}</button>
        </div>
      </div>
    </slot>

    <!-- Month ------------------------------------------------------------ -->
    <div v-if="view === 'month'" class="calendar-grid grid grid-cols-7">
      <div v-for="day in weekDays" :key="`h-${day.key}`" class="calendar-heading">
        <slot name="day-header" :date="day.date" :view="view">{{ day.label }}</slot>
      </div>

      <div
        v-for="cell in monthCells"
        :key="cell.key"
        class="calendar-cell"
        :class="{ 'is-outside': !cell.inMonth, 'is-today': cell.isToday }"
        @dragover="onDragOver"
        @drop="onDropDay(cell.date, $event)"
        @click="emit('select-date', cell.date)"
      >
        <span class="calendar-daynum">{{ cell.day }}</span>

        <div class="flex flex-col gap-0.5">
          <button
            v-for="item in cell.visible"
            :key="item.key"
            type="button"
            class="calendar-event"
            :class="item.type"
            :draggable="editable"
            @dragstart="onDragStart(item, $event)"
            @dragend="dragged = null"
            @click.stop="emit('select-event', item.source, item.index)"
          >
            <slot name="event" :event="item.source" :view="view">
              <span v-if="!item.allDay" class="calendar-event-time">{{ formatTime(item.start) }}</span>
              {{ item.title }}
            </slot>
          </button>

          <span v-if="cell.overflow > 0" class="calendar-more">+{{ cell.overflow }} {{ labelMore }}</span>
        </div>
      </div>
    </div>

    <!-- Week ------------------------------------------------------------- -->
    <div v-else class="calendar-grid">
      <div class="grid" :style="weekColumns">
        <div class="calendar-gutter"></div>
        <div v-for="day in weekCells" :key="`h-${day.key}`" class="calendar-heading" :class="{ 'is-today': day.isToday }">
          <slot name="day-header" :date="day.date" :view="view">
            <span class="block">{{ day.label }}</span>
            <span class="block text-lg font-semibold">{{ day.day }}</span>
          </slot>
        </div>
      </div>

      <div v-if="hasAllDay" class="grid border-t te-border" :style="weekColumns">
        <div class="calendar-gutter calendar-gutter-label">{{ labelAllDay }}</div>
        <div
          v-for="day in weekCells"
          :key="`a-${day.key}`"
          class="calendar-allday"
          @dragover="onDragOver"
          @drop="onDropDay(day.date, $event)"
        >
          <button
            v-for="item in day.allDay"
            :key="item.key"
            type="button"
            class="calendar-event"
            :class="item.type"
            :draggable="editable"
            @dragstart="onDragStart(item, $event)"
            @dragend="dragged = null"
            @click.stop="emit('select-event', item.source, item.index)"
          >
            <slot name="event" :event="item.source" :view="view">{{ item.title }}</slot>
          </button>
        </div>
      </div>

      <div class="grid overflow-y-auto border-t te-border" :style="[weekColumns, { maxHeight: bodyHeight }]">
        <div class="calendar-gutter">
          <div v-for="hour in hours" :key="hour" class="calendar-hour-label" :style="{ height: `${hourHeight}px` }">
            {{ formatHour(hour) }}
          </div>
        </div>

        <div
          v-for="day in weekCells"
          :key="`b-${day.key}`"
          class="calendar-column"
          :class="{ 'is-today': day.isToday }"
          :style="{ height: `${hours.length * hourHeight}px` }"
          @dragover="onDragOver"
          @drop="onDropTime(day.date, $event)"
          @click="onColumnClick(day.date, $event)"
        >
          <div v-for="hour in hours" :key="hour" class="calendar-slot" :style="{ height: `${hourHeight}px` }"></div>

          <button
            v-for="item in day.timed"
            :key="item.key"
            type="button"
            class="calendar-event calendar-event-timed"
            :class="item.type"
            :style="item.style"
            :draggable="editable"
            @dragstart="onDragStart(item, $event)"
            @dragend="dragged = null"
            @click.stop="emit('select-event', item.source, item.index)"
          >
            <slot name="event" :event="item.source" :view="view">
              <span class="calendar-event-time">{{ formatTime(item.start) }}</span>
              <span class="block truncate">{{ item.title }}</span>
            </slot>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { PropType } from 'vue';
import { oneOf } from '../types';
import type { CalendarEvent, CalendarView } from '../types';

defineOptions({ name: 'TeCalendar' });

const emit = defineEmits<{
  'select-date': [date: Date];
  'select-event': [event: CalendarEvent, index: number];
  'move-event': [payload: { event: CalendarEvent; index: number; start: Date; end: Date }];
}>();

/* The date the grid is looking at — the month in month view, the week that
   contains it in week view. */
const model = defineModel<Date | null>({ default: null });
const view = defineModel<CalendarView>('view', { default: 'month' });

const props = defineProps({
  events: { type: Array as PropType<CalendarEvent[]>, default: () => [] },
  /** Passed straight to Intl, so month and weekday names need no props. */
  locale: { type: String, default: undefined },
  weekStartsOn: { type: Number, default: 0, validator: (v: unknown) => typeof v === 'number' && v >= 0 && v <= 6 },
  /** First and last hour the week body shows. Events are clipped to it. */
  dayStart: { type: Number, default: 7, validator: (v: unknown) => typeof v === 'number' && v >= 0 && v <= 23 },
  dayEnd: { type: Number, default: 21, validator: (v: unknown) => typeof v === 'number' && v >= 1 && v <= 24 },
  hourHeight: { type: Number, default: 48 },
  bodyHeight: { type: String, default: '32rem' },
  /** Events shown per day in month view before they collapse into "+N more". */
  maxPerDay: { type: Number, default: 3 },
  /** Minutes a dragged event snaps to when dropped in the week body. */
  snapMinutes: { type: Number, default: 15 },
  hour12: { type: Boolean, default: undefined },
  /** Turns on drag-and-drop. The component never mutates `events` — it emits
      `move-event` and the parent decides. */
  editable: { type: Boolean, default: false },
  labelToday: { type: String, default: 'Today' },
  labelMonth: { type: String, default: 'Month' },
  labelWeek: { type: String, default: 'Week' },
  labelAllDay: { type: String, default: 'All day' },
  labelMore: { type: String, default: 'more' },
  labelPrev: { type: String, default: 'Previous' },
  labelNext: { type: String, default: 'Next' },
});

const MS_MIN = 60000;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const isSameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();

const startOfWeek = (date: Date) =>
  addDays(date, -(((date.getDay() - props.weekStartsOn) + 7) % 7));

/* `null` means "today", resolved once per render rather than stored, so the
   component works uncontrolled without writing to the model on mount. */
const focus = computed(() => model.value ?? new Date());

const dayEnd = computed(() => Math.max(props.dayEnd, props.dayStart + 1));
const hours = computed(() =>
  Array.from({ length: dayEnd.value - props.dayStart }, (_, i) => props.dayStart + i)
);
const windowStartMin = computed(() => props.dayStart * 60);
const windowMinutes = computed(() => (dayEnd.value - props.dayStart) * 60);

const timeFormat = computed(() =>
  new Intl.DateTimeFormat(props.locale, { hour: 'numeric', minute: '2-digit', hour12: props.hour12 })
);
const hourFormat = computed(() =>
  new Intl.DateTimeFormat(props.locale, { hour: 'numeric', hour12: props.hour12 })
);

const formatTime = (date: Date) => timeFormat.value.format(date);
const formatHour = (hour: number) => hourFormat.value.format(new Date(2000, 0, 1, hour));

/* The button jumps back to the current date, so it has nothing to do while the
   visible range already holds it — greyed out, it stops reading as a label. */
const showsToday = computed(() => {
  const now = new Date();
  if (view.value === 'month') {
    return focus.value.getMonth() === now.getMonth() && focus.value.getFullYear() === now.getFullYear();
  }
  const first = startOfWeek(focus.value);
  const day = startOfDay(now);
  return day >= first && day <= addDays(first, 6);
});

const label = computed(() => {
  if (view.value === 'month') {
    return new Intl.DateTimeFormat(props.locale, { month: 'long', year: 'numeric' }).format(focus.value);
  }
  const first = startOfWeek(focus.value);
  const last = addDays(first, 6);
  const sameMonth = first.getMonth() === last.getMonth();
  const head = new Intl.DateTimeFormat(props.locale, { month: 'short', day: 'numeric' }).format(first);
  const tail = new Intl.DateTimeFormat(props.locale, sameMonth
    ? { day: 'numeric', year: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' }).format(last);
  return `${head} – ${tail}`;
});

const weekDays = computed(() => {
  const first = startOfWeek(focus.value);
  const format = new Intl.DateTimeFormat(props.locale, { weekday: 'short' });
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(first, i);
    return { key: i, date, label: format.format(date) };
  });
});

/* Normalised once: `end` defaults to a 30-minute block, and an event with no
   usable start is dropped rather than rendered at the epoch. */
const items = computed(() =>
  props.events
    .map((source, index) => {
      const start = source.start instanceof Date ? source.start : new Date(source.start as string);
      if (Number.isNaN(start.getTime())) return null;
      const rawEnd = source.end instanceof Date ? source.end : source.end ? new Date(source.end as string) : null;
      const end = rawEnd && !Number.isNaN(rawEnd.getTime()) && rawEnd > start
        ? rawEnd
        : new Date(start.getTime() + 30 * MS_MIN);
      return {
        key: `${index}-${start.getTime()}`,
        index,
        source,
        start,
        end,
        title: source.title ?? '',
        type: source.type ?? 'primary',
        allDay: Boolean(source.allDay),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime())
);

type Item = (typeof items.value)[number];

/* An event belongs to a day when it overlaps it at all, so a block crossing
   midnight shows up on both days.
   ponytail: repeated per day rather than drawn as one spanning bar — a bar
   needs row-spanning layout in the month grid; add it if users ask. */
const itemsOn = (date: Date) => {
  const from = startOfDay(date).getTime();
  const to = from + 864e5;
  return items.value.filter((item) => item.start.getTime() < to && item.end.getTime() > from);
};

const monthCells = computed(() => {
  const first = new Date(focus.value.getFullYear(), focus.value.getMonth(), 1);
  const last = new Date(focus.value.getFullYear(), focus.value.getMonth() + 1, 0);
  const gridStart = startOfWeek(first);
  const gridEnd = addDays(startOfWeek(last), 6);
  const total = Math.round((gridEnd.getTime() - gridStart.getTime()) / 864e5) + 1;
  const now = new Date();

  return Array.from({ length: total }, (_, i) => {
    const date = addDays(gridStart, i);
    const dayItems = itemsOn(date);
    return {
      key: date.getTime(),
      date,
      day: date.getDate(),
      inMonth: date.getMonth() === focus.value.getMonth(),
      isToday: isSameDay(date, now),
      visible: dayItems.slice(0, props.maxPerDay),
      overflow: Math.max(dayItems.length - props.maxPerDay, 0),
    };
  });
});

/**
 * Greedy interval colouring: events are clustered into runs that overlap, and
 * inside a run each one takes the first column already free at its start. The
 * run's column count becomes every member's divisor, so a pair of overlapping
 * events is two halves and a lone event still spans the full width.
 */
function layout<T extends { startMin: number; endMin: number }>(entries: T[]) {
  const sorted = [...entries].sort((a, b) => a.startMin - b.startMin || b.endMin - a.endMin);
  const placed: { entry: T; col: number; cols: number }[] = [];
  let cluster: { entry: T; col: number }[] = [];
  let colEnds: number[] = [];
  let clusterEnd = -Infinity;

  const flush = () => {
    for (const seat of cluster) placed.push({ ...seat, cols: colEnds.length });
    cluster = [];
    colEnds = [];
  };

  for (const entry of sorted) {
    /* A gap with nothing running through it ends the cluster, so widths never
       leak from one run of overlaps into the next. */
    if (entry.startMin >= clusterEnd) {
      flush();
      clusterEnd = -Infinity;
    }
    let col = colEnds.findIndex((end) => end <= entry.startMin);
    if (col === -1) col = colEnds.length;
    colEnds[col] = entry.endMin;
    cluster.push({ entry, col });
    clusterEnd = Math.max(clusterEnd, entry.endMin);
  }
  flush();
  return placed;
}

const weekCells = computed(() => {
  const first = startOfWeek(focus.value);
  const format = new Intl.DateTimeFormat(props.locale, { weekday: 'short' });
  const now = new Date();

  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(first, i);
    const dayStartMs = startOfDay(date).getTime();
    const dayItems = itemsOn(date);

    const entries = dayItems
      .filter((item) => !item.allDay)
      .map((item) => {
        /* Clipped to the visible window and to this day, so a block that runs
           past midnight or past dayEnd still draws inside its column. */
        const rawStart = (item.start.getTime() - dayStartMs) / MS_MIN;
        const rawEnd = (item.end.getTime() - dayStartMs) / MS_MIN;
        const startMin = Math.max(rawStart, windowStartMin.value);
        const endMin = Math.min(Math.max(rawEnd, startMin + 15), windowStartMin.value + windowMinutes.value);
        return { item, startMin, endMin };
      })
      .filter((entry) => entry.endMin > windowStartMin.value && entry.startMin < windowStartMin.value + windowMinutes.value);

    const timed = layout(entries).map(({ entry, col, cols }) => {
      const { item, startMin, endMin } = entry;
      return {
        ...item,
        style: {
          top: `${((startMin - windowStartMin.value) / windowMinutes.value) * 100}%`,
          height: `${((endMin - startMin) / windowMinutes.value) * 100}%`,
          left: `${(col / cols) * 100}%`,
          width: `${(1 / cols) * 100}%`,
        },
      };
    });

    return {
      key: date.getTime(),
      date,
      day: date.getDate(),
      label: format.format(date),
      isToday: isSameDay(date, now),
      allDay: dayItems.filter((item) => item.allDay),
      timed,
    };
  });
});

const hasAllDay = computed(() => weekCells.value.some((day) => day.allDay.length > 0));

const weekColumns = { gridTemplateColumns: '4rem repeat(7, minmax(0, 1fr))' };

function setView(next: CalendarView) {
  view.value = next;
}

function shift(direction: number) {
  const current = focus.value;
  model.value = view.value === 'month'
    ? new Date(current.getFullYear(), current.getMonth() + direction, 1)
    : addDays(current, direction * 7);
}

const prev = () => shift(-1);
const next = () => shift(1);
const today = () => { model.value = new Date(); };

/* Held in a ref rather than dataTransfer: the payload is a live object, and
   reading dataTransfer during dragover is blocked in every browser. */
const dragged = ref<Item | null>(null);

function onDragStart(item: Item, event: DragEvent) {
  if (!props.editable) return;
  dragged.value = item;
  /* Firefox ignores a drag that carries no data at all. */
  event.dataTransfer?.setData('text/plain', String(item.index));
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
}

function onDragOver(event: DragEvent) {
  if (!props.editable || !dragged.value) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
}

function moveTo(start: Date) {
  const item = dragged.value;
  if (!item) return;
  const duration = item.end.getTime() - item.start.getTime();
  dragged.value = null;
  if (start.getTime() === item.start.getTime()) return;
  emit('move-event', { event: item.source, index: item.index, start, end: new Date(start.getTime() + duration) });
}

/** Month cells and the all-day row keep the time and change only the date. */
function onDropDay(date: Date, event: DragEvent) {
  if (!props.editable || !dragged.value) return;
  event.preventDefault();
  const from = dragged.value.start;
  moveTo(new Date(
    date.getFullYear(), date.getMonth(), date.getDate(),
    from.getHours(), from.getMinutes(), 0, 0,
  ));
}

/** Turns a Y offset inside a day column into a snapped time. */
function minutesAt(event: MouseEvent) {
  const column = event.currentTarget as HTMLElement;
  const offset = event.clientY - column.getBoundingClientRect().top;
  const ratio = Math.min(Math.max(offset / column.offsetHeight, 0), 1);
  const raw = windowStartMin.value + ratio * windowMinutes.value;
  return Math.round(raw / props.snapMinutes) * props.snapMinutes;
}

function onDropTime(date: Date, event: DragEvent) {
  if (!props.editable || !dragged.value) return;
  event.preventDefault();
  const minutes = minutesAt(event);
  moveTo(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, minutes, 0, 0));
}

function onColumnClick(date: Date, event: MouseEvent) {
  const minutes = minutesAt(event);
  emit('select-date', new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, minutes, 0, 0));
}
</script>
