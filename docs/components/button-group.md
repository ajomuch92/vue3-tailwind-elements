# Button group

`te-button-group` renders `quantity` joined buttons and tells you which one was
clicked. Each button has its own slot.

## Basic

<Demo>
  <te-button-group :quantity="3">
    <template #button-1>One</template>
    <template #button-2>Two</template>
    <template #button-3>Three</template>
  </te-button-group>
</Demo>

```vue
<te-button-group :quantity="3">
  <template #button-1>One</template>
  <template #button-2>Two</template>
  <template #button-3>Three</template>
</te-button-group>
```

## Outlined, with one disabled

`disabled` is indexed from zero even though the click payload is 1-based.

<Demo>
  <te-button-group :quantity="3" type="danger" outlined :disabled="[false, true, false]">
    <template #button-1>One</template>
    <template #button-2>Two</template>
    <template #button-3>Three</template>
  </te-button-group>
</Demo>

```vue
<te-button-group :quantity="3" type="danger" outlined :disabled="[false, true, false]">
  <template #button-1>One</template>
  <template #button-2>Two</template>
  <template #button-3>Three</template>
</te-button-group>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `quantity` | `number` | `1` | How many buttons to render. |
| `type` | `'normal'` \| `'primary'` \| `'secondary'` \| `'success'` \| `'info'` \| `'warning'` \| `'danger'` \| `'pink'` \| `'purple'` \| `'light'` \| `'dark'` | `'primary'` | Colour variant, applied to every button. |
| `size` | `'small'` \| `'medium'` \| `'large'` | `'medium'` | Size, applied to every button. |
| `outlined` | `boolean` | `false` | Outlined style. |
| `disabled` | `boolean[]` | `[]` | Per-button disabled state, indexed from `0`. |

## Events

| Event | Payload | Description |
|---|---|---|
| `click` | `{ index: number; event: MouseEvent }` | `index` is **1-based**. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `button-N` | `{ index }` | Content of the Nth button, starting at `button-1`. |
