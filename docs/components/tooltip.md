# Tooltip

`te-tooltip` shows its `content` slot on hover **and on keyboard focus** — the
wrapper is focusable and carries `aria-describedby`, so the tip is announced
rather than being mouse-only. Still CSS-only: no positioning library, no
JavaScript.

Because the bubble is positioned `absolute`, an ancestor with `overflow: hidden`
will clip it. Inside a scrolling container, reach for
[`te-dropdown`](./dropdown) instead — it renders in the top layer.

## Positions

<Demo>
  <te-tooltip position="top"><te-button>Top</te-button><template #content>On top</template></te-tooltip>
  <te-tooltip position="bottom"><te-button>Bottom</te-button><template #content>Below</template></te-tooltip>
  <te-tooltip position="left"><te-button>Left</te-button><template #content>To the left</template></te-tooltip>
  <te-tooltip position="right"><te-button>Right</te-button><template #content>To the right</template></te-tooltip>
</Demo>

```vue
<te-tooltip position="top"><te-button>Top</te-button><template #content>On top</template></te-tooltip>
<te-tooltip position="bottom"><te-button>Bottom</te-button><template #content>Below</template></te-tooltip>
<te-tooltip position="left"><te-button>Left</te-button><template #content>To the left</template></te-tooltip>
<te-tooltip position="right"><te-button>Right</te-button><template #content>To the right</template></te-tooltip>
```

## Offset

`offset` is the gap between the trigger and the bubble, in pixels.

<Demo>
  <te-tooltip :offset="2"><te-button>Tight</te-button><template #content>2px</template></te-tooltip>
  <te-tooltip><te-button>Default</te-button><template #content>8px</template></te-tooltip>
  <te-tooltip :offset="20"><te-button>Loose</te-button><template #content>20px</template></te-tooltip>
</Demo>

```vue
<te-tooltip :offset="20"><te-button>Loose</te-button><template #content>20px</template></te-tooltip>
```

The bubble anchors to the trigger's edge and holds the gap with a margin, so the
distance is the same whether the tip is one line or five.

## Colour

The bubble and the arrow read one custom property, so recolouring is two
declarations of plain CSS and the pointer follows automatically:

```css
.tooltip-content {
  --te-tooltip-bg: var(--color-blue-600);
  --te-tooltip-color: white;
}
```

`--te-tooltip-arrow` sets the pointer's size (`6px` by default).

## Without the arrow

<Demo>
  <te-tooltip :arrow="false"><te-button>No arrow</te-button><template #content>Plain</template></te-tooltip>
</Demo>

```vue
<te-tooltip :arrow="false"><te-button>No arrow</te-button><template #content>Plain</template></te-tooltip>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `'top'` \| `'right'` \| `'bottom'` \| `'left'` | `'top'` | Side the bubble appears on. |
| `arrow` | `boolean` | `true` | Draws the little pointer. |
| `offset` | `number` | `8` | Gap in pixels between the trigger and the bubble. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | The trigger. |
| `content` | — | Tooltip body. |
