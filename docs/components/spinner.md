# Spinner

`te-spinner` is the loading indicator used inside `te-button` and `te-loading`.
It carries a `visually-hidden` label for screen readers.

## Types

<Demo>
  <te-spinner type="normal" />
  <te-spinner type="growing" />
</Demo>

```vue
<te-spinner type="normal" />
<te-spinner type="growing" />
```

## Sizes

<Demo>
  <te-spinner size="small" />
  <te-spinner size="medium" />
  <te-spinner size="large" />
</Demo>

```vue
<te-spinner size="small" />
<te-spinner size="medium" />
<te-spinner size="large" />
```

## Colours

<Demo>
  <te-spinner color="primary" />
  <te-spinner color="success" />
  <te-spinner color="warning" />
  <te-spinner color="danger" />
  <te-spinner color="dark" />
</Demo>

```vue
<te-spinner color="primary" />
<te-spinner color="success" />
<te-spinner color="warning" />
<te-spinner color="danger" />
<te-spinner color="dark" />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'normal'` \| `'growing'` | `'normal'` | Rotating ring or pulsing dot. |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Diameter. |
| `color` | `'normal'` \| `'primary'` \| `'secondary'` \| `'success'` \| `'info'` \| `'warning'` \| `'danger'` \| `'pink'` \| `'purple'` \| `'light'` \| `'dark'` | `'primary'` | Colour variant. |
