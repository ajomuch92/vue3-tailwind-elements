# Dropdown

<script setup>
import { ref } from 'vue';

const picked = ref('');
const open = ref(false);
</script>

`te-dropdown` is a button and a menu panel. The panel is a native
[popover](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API), so the
browser handles dismissal: clicking anywhere else closes it, <kbd>Esc</kbd>
closes it, and it renders in the top layer — never clipped by a parent's
`overflow`, never in a `z-index` fight. The only thing the component adds is
placing the panel against its trigger.

## Usage

<Demo>
  <te-dropdown label="Actions" :items="['Edit', 'Duplicate', { label: 'Delete', disabled: true }]" @select="picked = $event.label" />
  <span v-if="picked">Picked: {{ picked }}</span>
</Demo>

```vue
<te-dropdown
  label="Actions"
  :items="['Edit', 'Duplicate', { label: 'Delete', disabled: true }]"
  @select="picked = $event.label"
/>
```

Items are plain strings or `{ label, disabled }` objects, the same shape
[`te-list-group`](./list-group) takes.

## Alignment

`align="end"` lines the panel up with the trigger's right edge. It is a
preference, not a promise: the panel is clamped to the viewport, and flips above
the trigger when there is no room below.

<Demo>
  <te-dropdown label="Aligned end" align="end" :items="['One', 'Two']" />
</Demo>

```vue
<te-dropdown label="Aligned end" align="end" :items="['One', 'Two']" />
```

## Custom trigger and content

The `trigger` slot replaces the button's label; the default slot replaces the
whole item list. Anything you put in the default slot still closes the menu when
a `button` or `a` inside it is clicked, unless you set `:close-on-select="false"`.

<Demo>
  <te-dropdown type="primary">
    <template #trigger>Settings ▾</template>
    <button class="dropdown-item">Profile</button>
    <button class="dropdown-item">Billing</button>
  </te-dropdown>
</Demo>

```vue
<te-dropdown type="primary">
  <template #trigger>Settings ▾</template>
  <button class="dropdown-item">Profile</button>
  <button class="dropdown-item">Billing</button>
</te-dropdown>
```

## Controlled

`v-model` reflects and drives the open state.

<Demo>
  <te-button @click="open = !open">Toggle from outside</te-button>
  <te-dropdown v-model="open" label="Menu" :items="['One', 'Two']" />
</Demo>

```vue
<te-button @click="open = !open">Toggle from outside</te-button>
<te-dropdown v-model="open" label="Menu" :items="['One', 'Two']" />
```

## Keyboard

<kbd>Enter</kbd>, <kbd>Space</kbd> or <kbd>↓</kbd> on the trigger opens the menu
and lands on the first item; <kbd>↑</kbd> opens it on the last. A click with the
mouse leaves the focus alone. Disabled items are skipped, and the arrows work on
whatever the default slot renders, not only on `items`.

| Key | Does |
|---|---|
| <kbd>↑</kbd> <kbd>↓</kbd> | Previous / next item. |
| <kbd>Home</kbd> <kbd>End</kbd> | First / last item. |
| <kbd>Enter</kbd> <kbd>Space</kbd> | Activate the focused item. |
| <kbd>Esc</kbd> | Close and go back to the trigger — the popover's own behaviour. |
| <kbd>Tab</kbd> | Close and move on. |

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `boolean` | `false` | Open state. Supports `v-model`. |
| `items` | `(string \| { label, disabled })[]` | `[]` | Menu entries. Ignored when the default slot is used. |
| `label` | `string` | `''` | Trigger text. Ignored when the `trigger` slot is used. |
| `align` | `'start'` \| `'end'` | `'start'` | Edge of the trigger the panel lines up with. |
| `type` | `Variant` | `'light'` | Trigger colour, same set as [`te-button`](./button). |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Trigger size. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `closeOnSelect` | `boolean` | `true` | A click on a `button` or `a` inside the panel closes it. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:modelValue` | `boolean` | Open state changed, including a browser-driven dismissal. |
| `select` | `(item, index)` | An entry from `items` was clicked. Not emitted for default-slot content. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `trigger` | — | Replaces the trigger's label. |
| `default` | — | Replaces the item list. Style entries with `class="dropdown-item"`. |

## Browser support

The panel needs the Popover API (Chrome 114, Firefox 125, Safari 17). Where it
is missing, the trigger and `v-model` simply do nothing rather than throwing.
