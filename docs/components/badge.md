# Badge

`te-badge` is a small inline label.

## Variants

<Demo>
  <te-badge type="normal" text="normal" />
  <te-badge type="primary" text="primary" />
  <te-badge type="secondary" text="secondary" />
  <te-badge type="success" text="success" />
  <te-badge type="info" text="info" />
  <te-badge type="warning" text="warning" />
  <te-badge type="danger" text="danger" />
  <te-badge type="pink" text="pink" />
  <te-badge type="purple" text="purple" />
</Demo>

```vue
<te-badge type="normal" text="normal" />
<te-badge type="primary" text="primary" />
<te-badge type="secondary" text="secondary" />
<te-badge type="success" text="success" />
<te-badge type="info" text="info" />
<te-badge type="warning" text="warning" />
<te-badge type="danger" text="danger" />
<te-badge type="pink" text="pink" />
<te-badge type="purple" text="purple" />
```

## Solid and outlined

<Demo>
  <te-badge type="success" solid text="solid" />
  <te-badge type="success" outlined text="outlined" />
</Demo>

```vue
<te-badge type="success" solid text="solid" />
<te-badge type="success" outlined text="outlined" />
```

## Sizes and shape

<Demo>
  <te-badge size="small" text="small" />
  <te-badge size="large" text="large" />
  <te-badge rounded text="rounded" />
</Demo>

```vue
<te-badge size="small" text="small" />
<te-badge size="large" text="large" />
<te-badge rounded text="rounded" />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | `''` | Label. Ignored when the default slot is used. |
| `type` | `'normal'` \| `'primary'` \| `'secondary'` \| `'success'` \| `'info'` \| `'warning'` \| `'danger'` \| `'pink'` \| `'purple'` \| `'light'` \| `'dark'` | `'normal'` | Colour variant. |
| `size` | `'small'` \| `'large'` | `'small'` | Padding. |
| `solid` | `boolean` | `false` | Filled background. |
| `outlined` | `boolean` | `false` | Border instead of a background. |
| `rounded` | `boolean` | `false` | Pill shape. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | Badge content. |
