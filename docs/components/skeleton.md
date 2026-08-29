# Skeleton

`te-skeleton` holds the shape of content that has not arrived yet, so a screen
fills in instead of jumping when it does.

## Text

<Demo block>
  <te-skeleton :lines="3" />
</Demo>

```vue
<te-skeleton :lines="3" />
```

The last line of a multi-line block is short, the way a paragraph ends — unless
you set a `width` of your own.

## Shapes

<Demo block>
  <div class="flex items-center gap-4">
    <te-skeleton shape="circle" />
    <te-skeleton shape="text" :lines="2" class="flex-1" />
  </div>
  <te-skeleton shape="rect" height="8rem" />
</Demo>

```vue
<div class="flex items-center gap-4">
  <te-skeleton shape="circle" />
  <te-skeleton shape="text" :lines="2" class="flex-1" />
</div>

<te-skeleton shape="rect" height="8rem" />
```

`width` and `height` take a number of pixels or any CSS length, and override
the shape's own size.

## Announcing the wait

A skeleton is decoration: it is hidden from assistive tech unless you give it a
`label`, in which case it becomes a live region that says what is loading.

```vue
<!-- Silent: something else on the page announces the loading state. -->
<te-skeleton :lines="3" />

<!-- Announced as "Loading your profile". -->
<te-skeleton :lines="3" label="Loading your profile" />
```

## Stillness

The pulse stops on its own for anyone who asked their system for reduced
motion. `:animated="false"` turns it off for everyone.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `shape` | `'text' \| 'rect' \| 'circle'` | `'text'` | What it stands in for. |
| `lines` | `number` | `1` | Rows of text. Ignored by the other shapes. |
| `width` | `string \| number` | shape's own | Any CSS length; a number is pixels. |
| `height` | `string \| number` | shape's own | Any CSS length; a number is pixels. |
| `animated` | `boolean` | `true` | The pulse. |
| `label` | `string` | `''` | Announces the wait. Silent and `aria-hidden` without one. |
