# Tooltip

`te-tooltip` shows its `content` slot on hover. It is CSS-only — no positioning
library, no JavaScript.

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

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | — | The trigger. |
| `content` | — | Tooltip body. |
