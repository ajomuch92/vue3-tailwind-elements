# Scroll to top

`te-scroll-to-top` is a floating button that appears once the page has been
scrolled and returns it smoothly to the top.

## Usage

It is `position: fixed`, so it is not shown inline here.

<Demo>
  <te-scroll-to-top />
  <te-scroll-to-top parent="#my-scroll-container" :offset="200" />
</Demo>

```vue
<te-scroll-to-top />
<te-scroll-to-top parent="#my-scroll-container" :offset="200" />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `parent` | `string` | `undefined` | CSS selector of the scrolling element. Defaults to the page. |
| `offset` | `number` | `20` | Scroll distance, in pixels, before the button appears. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `icon` | — | Replaces the default arrow. |
