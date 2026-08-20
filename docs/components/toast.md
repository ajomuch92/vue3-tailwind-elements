# Toast

Two toast styles ship: `te-toast`, a full card, and `te-toast-light`, a compact
strip. Both can be shown imperatively with `showToast`.

## te-toast

<Demo block>
  <te-toast color="success" title="Saved" subtitle="just now" message="Your changes are live." />
  <te-toast color="danger" title="Failed" subtitle="just now" message="Something went wrong." />
</Demo>

```vue
<te-toast color="success" title="Saved" subtitle="just now" message="Your changes are live." />
<te-toast color="danger" title="Failed" subtitle="just now" message="Something went wrong." />
```

## te-toast-light

<Demo block>
  <te-toast-light type="info" title="Heads up" subtitle="Check the settings page." />
  <te-toast-light type="warning" title="Almost full" subtitle="You are at 90% of your quota." />
</Demo>

```vue
<te-toast-light type="info" title="Heads up" subtitle="Check the settings page." />
<te-toast-light type="warning" title="Almost full" subtitle="You are at 90% of your quota." />
```

## Showing one imperatively

```ts
import { showToast } from 'vue3-tailwind-elements';

const instance = showToast({
  toast: { title: 'Saved', subtitle: 'just now', message: 'All good', color: 'success' },
  position: 'bottom',   // 'top' | 'bottom'
  align: 'center',      // 'left' | 'center' | 'right'
  type: 'normal',       // 'normal' renders te-toast, 'light' renders te-toast-light
  timeout: 4000,        // omit to keep it open
});

instance?.close();
```

The toast mounts its own tiny app into `<body>` and unmounts it once the fade
completes, so nothing is left behind. In Vue 2 this used `Vue.extend` and
`$mount`, neither of which exists in Vue 3.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `''` | Bold heading. |
| `subtitle` | `string` | `''` | Small text beside the title. |
| `message` | `string` | `''` | Body. `te-toast` only. |
| `color` | `'normal'` \| `'primary'` \| `'success'` \| `'warning'` \| `'danger'` | `'normal'` | `te-toast` colour. |
| `type` | `'info'` \| `'success'` \| `'warning'` \| `'danger'` | `'info'` | `te-toast-light` colour. |
| `showCloseButton` | `boolean` | `true` | Close button. `te-toast` only. |

## Events

| Event | Payload | Description |
|---|---|---|
| `close` | `MouseEvent` | Close was clicked. The toast does not remove itself. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | Replaces `message`. |
| `icon` | `{ type }` | Replaces the leading icon. |
