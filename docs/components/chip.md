# Chip

`te-chip` is a compact tag, optionally with an avatar and a close button.

## Variants

<Demo>
  <te-chip type="primary">primary</te-chip>
  <te-chip type="success">success</te-chip>
  <te-chip type="danger">danger</te-chip>
  <te-chip type="dark">dark</te-chip>
</Demo>

```vue
<te-chip type="primary">primary</te-chip>
<te-chip type="success">success</te-chip>
<te-chip type="danger">danger</te-chip>
<te-chip type="dark">dark</te-chip>
```

## Sizes

<Demo>
  <te-chip size="small">small</te-chip>
  <te-chip size="medium">medium</te-chip>
  <te-chip size="large">large</te-chip>
</Demo>

```vue
<te-chip size="small">small</te-chip>
<te-chip size="medium">medium</te-chip>
<te-chip size="large">large</te-chip>
```

## Closable

<Demo>
  <te-chip type="primary" closable>Dismiss me</te-chip>
</Demo>

```vue
<te-chip type="primary" closable>Dismiss me</te-chip>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'normal'` \| `'primary'` \| `'secondary'` \| `'success'` \| `'info'` \| `'warning'` \| `'danger'` \| `'pink'` \| `'purple'` \| `'light'` \| `'dark'` | `'light'` | Colour variant. |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Height and avatar size. |
| `closable` | `boolean` | `false` | Shows a close button that emits `close`. |
| `imgUrl` | `string` | `''` | Avatar image shown before the label. |

## Events

| Event | Payload | Description |
|---|---|---|
| `close` | `MouseEvent` | Close button clicked. The chip does not remove itself. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | Chip label. |
| `icon` | — | Replaces the close icon. |
