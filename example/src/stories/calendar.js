import { ref } from 'vue';

const at = (dayOffset, hour, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const events = ref([
  { start: at(0, 9), end: at(0, 10), title: 'Standup', type: 'primary' },
  { start: at(0, 9, 30), end: at(0, 11), title: 'Pairing', type: 'success' },
  { start: at(0, 10, 30), end: at(0, 12), title: 'Design review', type: 'warning' },
  { start: at(1, 14), end: at(1, 15, 30), title: 'Retro', type: 'danger' },
  { start: at(2, 8), end: at(2, 17), title: 'Offsite', allDay: true, type: 'purple' },
  { start: at(-1, 16), end: at(-1, 17), title: 'One-on-one', type: 'info' },
]);

export default {
  props: {
    dayStart: 7,
    dayEnd: 20,
    hourHeight: 48,
    maxPerDay: 3,
    snapMinutes: 15,
    weekStartsOn: 0,
    locale: '',
    editable: true,
  },
  model: null,
  data: {
    events,
    view: ref('week'),
    // The component never mutates `events` — it reports the drop and the parent
    // decides, so an optimistic move and a server round-trip look the same.
    onMove: ({ index, start, end }) => {
      events.value[index] = { ...events.value[index], start, end };
    },
  },
  template: (attrs) => `<te-calendar${attrs} v-model:view="view" :events="events" @move-event="onMove" />`,
  note: 'Drag an event to another day or hour. Overlapping events split the column.',
};
