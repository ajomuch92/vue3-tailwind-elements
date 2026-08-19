# Button

`te-button` covers the usual variants, sizes and states, plus an optional
ripple.

## Variants

<Demo>
  <te-button type="normal">normal</te-button>
  <te-button type="primary">primary</te-button>
  <te-button type="secondary">secondary</te-button>
  <te-button type="success">success</te-button>
  <te-button type="info">info</te-button>
  <te-button type="warning">warning</te-button>
  <te-button type="danger">danger</te-button>
  <te-button type="pink">pink</te-button>
  <te-button type="purple">purple</te-button>
  <te-button type="light">light</te-button>
  <te-button type="dark">dark</te-button>
</Demo>

```vue
<te-button type="normal">normal</te-button>
<te-button type="primary">primary</te-button>
<te-button type="secondary">secondary</te-button>
<te-button type="success">success</te-button>
<te-button type="info">info</te-button>
<te-button type="warning">warning</te-button>
<te-button type="danger">danger</te-button>
<te-button type="pink">pink</te-button>
<te-button type="purple">purple</te-button>
<te-button type="light">light</te-button>
<te-button type="dark">dark</te-button>
```

## Sizes

<Demo>
  <te-button size="small">small</te-button>
  <te-button size="medium">medium</te-button>
  <te-button size="large">large</te-button>
</Demo>

```vue
<te-button size="small">small</te-button>
<te-button size="medium">medium</te-button>
<te-button size="large">large</te-button>
```

## Outlined and text only

<Demo>
  <te-button type="primary" outlined>outlined</te-button>
  <te-button type="danger" outlined>outlined</te-button>
  <te-button type="primary" only-text>only text</te-button>
  <te-button type="danger" only-text>only text</te-button>
</Demo>

```vue
<te-button type="primary" outlined>outlined</te-button>
<te-button type="danger" outlined>outlined</te-button>
<te-button type="primary" only-text>only text</te-button>
<te-button type="danger" only-text>only text</te-button>
```

## Shape and emphasis

<Demo>
  <te-button rounded>rounded</te-button>
  <te-button shadowed>shadowed</te-button>
  <te-button uppercased>uppercased</te-button>
</Demo>

```vue
<te-button rounded>rounded</te-button>
<te-button shadowed>shadowed</te-button>
<te-button uppercased>uppercased</te-button>
```

## Loading and disabled

A loading button shows a spinner but stays clickable — disable it too if the action must not repeat.

<Demo>
  <te-button type="primary" loading>Saving</te-button>
  <te-button type="primary" loading disabled>Saving</te-button>
  <te-button disabled>disabled</te-button>
</Demo>

```vue
<te-button type="primary" loading>Saving</te-button>
<te-button type="primary" loading disabled>Saving</te-button>
<te-button disabled>disabled</te-button>
```

## Ripple

Click to see it.

<Demo>
  <te-button type="primary" ripple>ripple</te-button>
</Demo>

```vue
<te-button type="primary" ripple>ripple</te-button>
```

## Icon only

<Demo>
  <te-button icon type="primary"><te-icon social name="github" /></te-button>
</Demo>

```vue
<te-button icon type="primary"><te-icon social name="github" /></te-button>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'normal'` \| `'primary'` \| `'secondary'` \| `'success'` \| `'info'` \| `'warning'` \| `'danger'` \| `'pink'` \| `'purple'` \| `'light'` \| `'dark'` | `'primary'` | Colour variant. |
| `buttonType` | `'button'` \| `'reset'` \| `'submit'` | `'button'` | Native `type` attribute. |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Padding and minimum height. |
| `rounded` | `boolean` | `false` | Fully rounded corners. |
| `noRounded` | `boolean` | `false` | Square corners. Used by `te-button-group`. |
| `outlined` | `boolean` | `false` | Transparent background with a border. |
| `onlyText` | `boolean` | `false` | No background until hovered. |
| `shadowed` | `boolean` | `false` | Drop shadow that grows on hover. |
| `uppercased` | `boolean` | `false` | Uppercases the label. |
| `disabled` | `boolean` | `false` | Disables the button. |
| `loading` | `boolean` | `false` | Shows a spinner before the label. |
| `ripple` | `boolean` | `false` | Ripple effect on click. |
| `icon` | `boolean` | `false` | Square button sized for a single icon. |

## Events

| Event | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Emitted on click, including while loading. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | Button label. |
