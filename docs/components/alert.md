# Alert

`te-alert` is a tinted message block. It grows to fit its content, so a long
message wraps instead of overflowing.

## Variants

<Demo block>
  <te-alert type="normal" text="A normal message" />
  <te-alert type="primary" text="A primary message" />
  <te-alert type="success" text="Saved successfully" />
  <te-alert type="info" text="Something worth knowing" />
  <te-alert type="warning" text="Check this before continuing" />
  <te-alert type="danger" text="Something went wrong" />
</Demo>

```vue
<te-alert type="normal" text="A normal message" />
<te-alert type="primary" text="A primary message" />
<te-alert type="success" text="Saved successfully" />
<te-alert type="info" text="Something worth knowing" />
<te-alert type="warning" text="Check this before continuing" />
<te-alert type="danger" text="Something went wrong" />
```

## Solid

<Demo block>
  <te-alert type="success" solid text="Saved successfully" />
  <te-alert type="danger" solid text="Something went wrong" />
</Demo>

```vue
<te-alert type="success" solid text="Saved successfully" />
<te-alert type="danger" solid text="Something went wrong" />
```

## Custom content

The default slot replaces `text`.

<Demo block>
  <te-alert type="info">
    <strong>Heads up.</strong>&nbsp;You can put markup in here.
  </te-alert>
</Demo>

```vue
<te-alert type="info">
  <strong>Heads up.</strong>&nbsp;You can put markup in here.
</te-alert>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | `''` | Message. Ignored when the default slot is used. |
| `type` | `'normal'` \| `'primary'` \| `'secondary'` \| `'success'` \| `'info'` \| `'warning'` \| `'danger'` \| `'pink'` \| `'purple'` \| `'light'` \| `'dark'` | `'normal'` | Colour variant. |
| `solid` | `boolean` | `false` | Filled background instead of a 10% tint. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | Alert content. |
