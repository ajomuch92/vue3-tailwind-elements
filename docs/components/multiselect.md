# Multiselect

<script setup>
import { ref } from 'vue';

const picked = ref([1]);
const one = ref(1);
const clipped = ref([]);
</script>

`te-multiselect` is a dropdown with search, select-all and either single or
multiple selection. It closes on an outside click, so the plugin's
`v-click-outside` directive has to be registered.

## Multiple

<Demo block>
  <te-multiselect
    v-model="picked"
    placeholder="Pick some"
    :options="[{ value: 1, text: 'One' }, { value: 2, text: 'Two' }, { value: 3, text: 'Three' }]"
  />
</Demo>

```vue
<te-multiselect
  v-model="picked"
  placeholder="Pick some"
  :options="[{ value: 1, text: 'One' }, { value: 2, text: 'Two' }, { value: 3, text: 'Three' }]"
/>
```

## Single select

<Demo block>
  <te-multiselect
    v-model="one"
    single-select
    placeholder="Pick one"
    :options="[{ value: 1, text: 'One' }, { value: 2, text: 'Two' }]"
  />
</Demo>

```vue
<te-multiselect
  v-model="one"
  single-select
  placeholder="Pick one"
  :options="[{ value: 1, text: 'One' }, { value: 2, text: 'Two' }]"
/>
```

## Inside a scrolling container

An ancestor with `overflow: hidden` or its own scrollbar clips the open list.
`append-to-body` renders it in `<body>` instead, anchored to the field while
the page or the container scrolls.

<Demo block>
  <div style="height: 8rem; overflow: auto; border: 1px solid var(--vp-c-divider); border-radius: 0.5rem; padding: 1rem;">
    <te-multiselect
      v-model="clipped"
      append-to-body
      placeholder="Pick some"
      :options="[{ value: 1, text: 'One' }, { value: 2, text: 'Two' }, { value: 3, text: 'Three' }]"
    />
    <div style="height: 10rem"></div>
  </div>
</Demo>

```vue
<div class="h-32 overflow-auto">
  <te-multiselect v-model="picked" append-to-body :options="options" />
</div>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string` \| `number` \| `array` | `undefined` | Supports `v-model`. An array unless `singleSelect`. |
| `options` | `object[]` | `[]` | Option list. |
| `displayField` | `string` | `'text'` | Key holding the visible text. |
| `valueField` | `string` | `'value'` | Key holding the value. |
| `singleSelect` | `boolean` | `false` | One selection instead of many. |
| `searchable` | `boolean` | `true` | Shows the search box. |
| `showSelectAll` | `boolean` | `true` | Shows the select-all checkbox. |
| `clearable` | `boolean` | `true` | Shows a clear button once something is selected. |
| `visibleItems` | `number` | `3` | How many labels to list before switching to a count. |
| `placeholder` | `string` | `''` | Placeholder of the closed field. |
| `placeholderSearch` | `string` | `'Search...'` | Placeholder of the search box. |
| `minWidth` | `string` \| `number` | `'250px'` | Minimum width of the field. |
| `listHeight` | `string` \| `number` | `'250px'` | Height of the scrolling list. |
| `disabled` | `boolean` | `false` | Disables the field. |
| `appendToBody` | `boolean` | `false` | Renders the list in `<body>` so it is not clipped by a scrolling or `overflow: hidden` container. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `string` \| `number` \| `array` | Selection changed. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `item` | `{ option, key }` | Custom rendering for an option. |
