# List group

`te-list-group` is a selectable list. Items can be plain strings or objects.

## Basic

<Demo block>
  <te-list-group :items="['First', 'Second', 'Third']" />
</Demo>

```vue
<te-list-group :items="['First', 'Second', 'Third']" />
```

## Objects, disabled items and flush

<Demo block>
  <te-list-group flush :items="[
    { label: 'First' },
    { label: 'Second', disabled: true },
    { label: 'Third' },
  ]" />
</Demo>

```vue
<te-list-group flush :items="[
  { label: 'First' },
  { label: 'Second', disabled: true },
  { label: 'Third' },
]" />
```

## Not clickable

<Demo block>
  <te-list-group :clickable="false" :items="['First', 'Second']" />
</Demo>

```vue
<te-list-group :clickable="false" :items="['First', 'Second']" />
```

### `ListGroupItem`

```ts
interface ListGroupItem {
  label?: string;
  name?: string;      // slot name for this item
  disabled?: boolean;
}
```

## Keyboard

Only when `clickable` — a static list is not interactive and stays out of the
tab order. The list is one tab stop; the arrows move inside it, and disabled
rows are skipped. Moving the focus does not change the selection, so the active
item only changes when you ask for it.

| Key | Does |
|---|---|
| <kbd>↑</kbd> <kbd>↓</kbd> | Previous / next row. |
| <kbd>Home</kbd> <kbd>End</kbd> | First / last row. |
| <kbd>Enter</kbd> <kbd>Space</kbd> | Select the focused row. |

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `(ListGroupItem | string)[]` | — (required) | List entries. Strings are normalised to `{ label }`. |
| `activeItem` | `number` \| `null` | `null` | Selected index. Supports `v-model:active-item`. |
| `clickable` | `boolean` | `true` | When false, clicking does not change the selection. |
| `flush` | `boolean` | `false` | Removes the outer border. |

## Events

| Event | Payload | Description |
|---|---|---|
| `update:activeItem` | `number` | Emitted when an item is clicked. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `item-N` | — | Content of the Nth item. An item with a `name` uses that name instead. |
