# Notification badge

`te-notification` pins a small badge to a corner of whatever you put in its
default slot.

## Positions

<Demo>
  <te-notification text="3" position="top-right"><te-button>Inbox</te-button></te-notification>
  <te-notification text="9" position="top-left"><te-button>Inbox</te-button></te-notification>
  <te-notification text="1" position="bottom-right"><te-button>Inbox</te-button></te-notification>
  <te-notification text="7" position="bottom-left"><te-button>Inbox</te-button></te-notification>
</Demo>

```vue
<te-notification text="3" position="top-right"><te-button>Inbox</te-button></te-notification>
<te-notification text="9" position="top-left"><te-button>Inbox</te-button></te-notification>
<te-notification text="1" position="bottom-right"><te-button>Inbox</te-button></te-notification>
<te-notification text="7" position="bottom-left"><te-button>Inbox</te-button></te-notification>
```

## Dot and colours

Leaving `text` empty renders a plain dot.

<Demo>
  <te-notification color="danger"><te-button type="light">Alerts</te-button></te-notification>
  <te-notification text="12" color="success"><te-button type="light">Done</te-button></te-notification>
</Demo>

```vue
<te-notification color="danger"><te-button type="light">Alerts</te-button></te-notification>
<te-notification text="12" color="success"><te-button type="light">Done</te-button></te-notification>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | `''` | Badge content. Empty renders a dot. |
| `position` | `'top-left'` \| `'top-right'` \| `'bottom-left'` \| `'bottom-right'` | `'top-right'` | Corner to pin to. |
| `color` | `'normal'` \| `'primary'` \| `'secondary'` \| `'success'` \| `'info'` \| `'warning'` \| `'danger'` \| `'pink'` \| `'purple'` \| `'light'` \| `'dark'` | `'primary'` | Colour variant. |
| `hide` | `boolean` | `false` | Hides the badge, keeping the slot content. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | The element the badge is attached to. |
