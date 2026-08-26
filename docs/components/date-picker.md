# Date picker

`te-date-picker` binds a `Date` and closes when you click outside of it, which
relies on the `v-click-outside` directive the plugin registers.

## Basic

<Demo block>
  <te-date-picker />
</Demo>

```vue
<te-date-picker />
```

## Localised month and day names

<Demo block>
  <te-date-picker
    placeholder="Selecciona una fecha"
    :days="['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']"
    :month-names="['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']"
  />
</Demo>

```vue
<te-date-picker
  placeholder="Selecciona una fecha"
  :days="['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']"
  :month-names="['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']"
/>
```

## Inside a scrolling container

An ancestor with `overflow: hidden` or its own scrollbar clips the open
calendar. `append-to-body` renders it in `<body>` instead, anchored to the
field while the page or the container scrolls.

<Demo block>
  <div style="height: 8rem; overflow: auto; border: 1px solid var(--vp-c-divider); border-radius: 0.5rem; padding: 1rem;">
    <te-date-picker append-to-body />
    <div style="height: 10rem"></div>
  </div>
</Demo>

```vue
<div class="h-32 overflow-auto">
  <te-date-picker append-to-body v-model="date" />
</div>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `Date` \| `null` | `null` | Selected date. Supports `v-model`. |
| `placeholder` | `string` | `'Select a date'` | Placeholder of the trigger input. |
| `disabled` | `boolean` | `false` | Disables the trigger input. |
| `minDate` / `maxDate` | `Date` \| `null` | `null` | Selectable range. Also limits the year list and the arrows. |
| `notAllowedDates` | `Date[]` | `[]` | Individual dates to block. |
| `monthNames` | `string[]` | English months | Twelve month names. |
| `days` | `string[]` | `['Sun', …]` | Seven weekday labels, starting on Sunday. |
| `appendToBody` | `boolean` | `false` | Renders the calendar in `<body>` so it is not clipped by a scrolling or `overflow: hidden` container. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `Date` | A date was picked. The panel closes. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `trigger` | — | Replaces the input that opens the calendar. |
| `icon` | — | Replaces the calendar icon. |
