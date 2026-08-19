# Card

`te-card` is a surface with optional header, image, title and footer.

## Basic

<Demo block>
  <te-card title="A card">
    Cards take their body from the default slot.
  </te-card>
</Demo>

```vue
<te-card title="A card">
  Cards take their body from the default slot.
</te-card>
```

## Header and footer

Both need their flag as well as their slot.

<Demo block>
  <te-card has-header has-footer title="Full card">
    <template #header>Header</template>
    Body content.
    <template #footer>Footer</template>
  </te-card>
</Demo>

```vue
<te-card has-header has-footer title="Full card">
  <template #header>Header</template>
  Body content.
  <template #footer>Footer</template>
</te-card>
```

## Width and shadow

`width` accepts a number of pixels or any CSS length.

<Demo block>
  <te-card :width="240" title="Narrow">Body.</te-card>
  <te-card width="20rem" shadowless title="Shadowless">Body.</te-card>
</Demo>

```vue
<te-card :width="240" title="Narrow">Body.</te-card>
<te-card width="20rem" shadowless title="Shadowless">Body.</te-card>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `''` | Heading above the body. Overridable with the `title` slot. |
| `imgSrc` | `string` | `''` | Image rendered above the body. |
| `width` | `string` \| `number` | `'350px'` | A number is treated as pixels. |
| `hasHeader` | `boolean` | `false` | Renders the `header` slot. |
| `hasFooter` | `boolean` | `false` | Renders the `footer` slot. |
| `shadowless` | `boolean` | `false` | Drops the shadow and rounding. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | Card body. |
| `title` | — | Replaces the `title` prop. |
| `header` | — | Header area. Requires `has-header`. |
| `footer` | — | Footer area. Requires `has-footer`. |
