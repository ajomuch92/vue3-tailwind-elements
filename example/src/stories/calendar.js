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
    // Day and month names come from Intl, so this one control translates every
    // heading the label props below do not cover.
    locale: { options: ['', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP'] },
    editable: true,
    // Every string the component writes itself. Edit one and it shows up in the
    // code below, so the panel doubles as the list of what is translatable.
    labelToday: 'Today',
    labelMonth: 'Month',
    labelWeek: 'Week',
    labelAllDay: 'All day',
    labelMore: 'more',
    labelPrev: 'Previous',
    labelNext: 'Next',
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
  note: 'Drag an event to another day or hour. Overlapping events split the column. The label props cover every string the component writes; day and month names follow `locale` — override them with the `day-header` and `toolbar` slots.',
};
