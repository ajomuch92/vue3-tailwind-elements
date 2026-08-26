# Calendar

<script setup>
import { ref } from 'vue';

const at = (offset, hour, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const events = ref([
  { start: at(0, 9), end: at(0, 10), title: 'Standup', type: 'primary' },
  { start: at(0, 9, 30), end: at(0, 11), title: 'Pairing', type: 'success' },
  { start: at(0, 10, 30), end: at(0, 12), title: 'Design review', type: 'warning' },
  { start: at(1, 14), end: at(1, 15, 30), title: 'Retro', type: 'danger' },
]);

const onMove = ({ index, start, end }) => {
  events.value[index] = { ...events.value[index], start, end };
};

const picked = ref('');
</script>

`te-calendar` shows events in a month grid or a week grid with hour lanes.
Month and weekday names come from `Intl`, so there are no `monthNames` or `days`
props to translate by hand — pass a `locale` and the header, the weekday row and
the clock all follow it.

## Usage

<Demo block>
  <te-calendar :events="events" />
</Demo>

```vue
<te-calendar :events="events" />
```

An event is `{ start, end?, title?, type?, allDay? }`. `start` and `end` take a
`Date` or anything `new Date()` parses; `end` defaults to 30 minutes after
`start`, and `type` is one of the shared [variants](../guide/theming), so an
event chip is coloured like a `te-badge`.

```js
const events = [
  { start: new Date(2024, 0, 15, 9), end: new Date(2024, 0, 15, 10), title: 'Standup' },
  { start: '2024-01-16T14:00', title: 'Retro', type: 'danger' },
  { start: new Date(2024, 0, 17), title: 'Offsite', allDay: true },
];
```

## Week view

`v-model:view` switches between `month` and `week`, and the built-in toolbar
already does it. The week body only draws the hours between `dayStart` and
`dayEnd`; anything outside that window is clipped, so a calendar of working
hours does not scroll through an empty night.

<Demo block>
  <te-calendar view="week" :events="events" :day-start="8" :day-end="18" />
</Demo>

```vue
<te-calendar v-model:view="view" :events="events" :day-start="8" :day-end="18" />
```

Events that share a time range split the column between them, and the split
resets after a gap — three overlapping meetings are three thirds, and the next
free hour goes back to full width. Events marked `allDay` move out of the hour
grid into a row above it.

## Moving events

`editable` turns on drag-and-drop. The component **never mutates the `events`
array**: it emits `move-event` with the new `start` and `end`, and you decide
whether to apply it, ask the server first, or refuse.

<Demo block note="Drag an event to another day or hour.">
  <te-calendar :events="events" editable @move-event="onMove" />
</Demo>

```vue
<te-calendar :events="events" editable @move-event="onMove" />
```

```js
function onMove({ event, index, start, end }) {
  events.value[index] = { ...events.value[index], start, end };
}
```

Dropping on a month cell keeps the time and changes only the date. Dropping in
the week body sets the time too, snapped to `snapMinutes` (15 by default).

## Navigating

`v-model` is the date the grid is looking at — the month it shows in month view,
the week containing it in week view. Leave it unbound and the calendar starts on
today and manages its own position.

```vue
<te-calendar v-model="focus" v-model:view="view" :events="events" />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `Date \| null` | `null` | The visible month or week. `null` means today. |
| `view` | `'month' \| 'week'` | `'month'` | Use with `v-model:view`. |
| `events` | `CalendarEvent[]` | `[]` | |
| `locale` | `string` | browser | Passed to `Intl`. |
| `weekStartsOn` | `0-6` | `0` | `0` is Sunday, `1` Monday. |
| `dayStart` / `dayEnd` | `number` | `7` / `21` | First and last hour of the week body. |
| `hourHeight` | `number` | `48` | Pixel height of one hour. |
| `bodyHeight` | `string` | `'32rem'` | Max height before the week body scrolls. |
| `maxPerDay` | `number` | `3` | Events per month cell before `+N more`. |
| `snapMinutes` | `number` | `15` | Drop granularity in the week body. |
| `hour12` | `boolean` | locale | Forces 12- or 24-hour times. |
| `editable` | `boolean` | `false` | Enables drag-and-drop. |
| `labelToday`, `labelMonth`, `labelWeek`, `labelAllDay`, `labelMore`, `labelPrev`, `labelNext` | `string` | English | Toolbar and chrome copy. |

## Events

| Event | Payload |
| --- | --- |
| `select-date` | The clicked `Date`. In the week body it carries the clicked time. |
| `select-event` | `(event, index)` — the original object you passed in. |
| `move-event` | `{ event, index, start, end }` |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `event` | `{ event, view }` | Replaces an event chip. |
| `day-header` | `{ date, view }` | Replaces a weekday heading. |
| `toolbar` | `{ label, view, prev, next, today, showsToday, setView }` | Replaces the whole toolbar. `showsToday` is `true` while the visible range already contains today — the built-in toolbar uses it to disable its Today button. |

<Demo block>
  <te-calendar :events="events" @select-event="picked = $event.title">
    <template #toolbar="{ label, prev, next }">
      <div class="flex items-center gap-2">
        <te-button size="small" outlined @click="prev">←</te-button>
        <strong>{{ label }}</strong>
        <te-button size="small" outlined @click="next">→</te-button>
      </div>
    </template>
  </te-calendar>
  <span v-if="picked">Picked: {{ picked }}</span>
</Demo>

## What it does not do

No resizing, no recurrence rules, no timezone conversion, and no day or year
view. A multi-day event repeats in each day it covers rather than drawing one
bar across the row. If you need those, use a dedicated calendar library —
this one is a component, not a scheduling engine.
