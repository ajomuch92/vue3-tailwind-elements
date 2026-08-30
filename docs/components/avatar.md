# Avatar

`te-avatar` shows a person's picture, and falls back to their initials — and
then to a generic icon — so a missing or broken image never leaves a hole in
the layout.

## Basic

<Demo>
  <te-avatar src="https://i.pravatar.cc/80?img=5" name="Ada Lovelace" />
  <te-avatar name="Ada Lovelace" type="primary" />
  <te-avatar name="Grace Hopper" type="success" />
  <te-avatar />
</Demo>

```vue
<te-avatar src="/ada.jpg" name="Ada Lovelace" />
<te-avatar name="Ada Lovelace" type="primary" />
<te-avatar name="Grace Hopper" type="success" />
<te-avatar />
```

`name` is doing two jobs: it draws the initials — the first letter of the first
two words — and it is what a screen reader hears, whether the picture loaded or
not. Pass `alt` when the two should differ.

With neither `name` nor `alt`, all that is left is the generic icon, which says
nothing a screen reader can use: the avatar is treated as decoration and stays
out of the accessibility tree. Content of your own in the default slot is
yours to describe, so it is left visible.

## Sizes and shape

<Demo>
  <te-avatar name="Ada Lovelace" size="small" type="info" />
  <te-avatar name="Ada Lovelace" size="medium" type="info" />
  <te-avatar name="Ada Lovelace" size="large" type="info" />
  <te-avatar name="Ada Lovelace" size="large" type="purple" square />
</Demo>

```vue
<te-avatar name="Ada Lovelace" size="small" type="info" />
<te-avatar name="Ada Lovelace" size="large" type="purple" square />
```

## A broken image

The fallback is not only for a missing `src`: a URL that fails to load falls
through to the initials at that point, which is the usual fate of a hot-linked
profile picture.

<Demo>
  <te-avatar src="/this-does-not-exist.png" name="Ada Lovelace" type="danger" />
</Demo>

## Your own content

The default slot replaces the initials and the icon — a status dot, a letter of
your own, an icon from your font:

```vue
<te-avatar type="dark">
  <te-icon name="robot" />
</te-avatar>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | `''` | Image URL. Falls back to the initials if it fails to load. |
| `name` | `string` | `''` | Whose avatar it is: drawn as initials, and read out. |
| `alt` | `string` | `''` | Overrides what a screen reader hears. |
| `type` | `Variant` | `'normal'` | Any variant, for the initials background. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 2rem, 2.5rem or 3.5rem. |
| `square` | `boolean` | `false` | Rounded square instead of a circle. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | `{ initials }` | Replaces the initials and the fallback icon. |
