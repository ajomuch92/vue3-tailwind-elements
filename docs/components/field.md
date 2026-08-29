# Field

`te-field` puts the three things a form needs around a control — a label that
focuses it, a hint, and an error — and wires the ids and the ARIA between them,
so the control announces its own description and validity instead of leaving a
screen reader to guess from what happens to be next to it.

## Basic

<Demo block>
  <te-field label="Email" helper="We only use it to reach you">
    <te-input placeholder="you@example.com" />
  </te-field>
  <te-field label="Country" error="Pick one" required>
    <te-select :options="['Spain', 'Honduras']" />
  </te-field>
</Demo>

```vue
<te-field label="Email" helper="We only use it to reach you">
  <te-input placeholder="you@example.com" />
</te-field>

<te-field label="Country" error="Pick one" required>
  <te-select :options="['Spain', 'Honduras']" />
</te-field>
```

An `error` is a state on its own: passing one marks the field invalid, so a form
never has to keep a boolean in step with its own message. `invalid` without a
message is there for the cases where the message lives elsewhere.

## What it wires

- The label's `for` points at whatever id the control ends up with — the one
  `te-field` generates, or the control's own if it brought one.
- The control gets `aria-describedby` for the hint or the error line.
- The control gets `aria-invalid`, and paints its border red while invalid.

That happens on its own for `te-input`, `te-textarea`, `te-select`, `te-file`,
`te-multiselect` and `te-date-picker`.

## Around anything else

Any other control reads the same three values off the slot props:

```vue
<te-field v-slot="{ id, describedBy, invalid }" label="Colour" error="Required">
  <input :id="id" type="color" :aria-describedby="describedBy" :aria-invalid="invalid" />
</te-field>
```

A control with no id of its own is given one on mount, so a plain `<input>`
dropped in here is labelled either way.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `''` | Text of the label. Omit it (and the slot) for no label. |
| `helper` | `string` | `''` | Hint under the control while everything is fine. |
| `error` | `string` | `''` | Replaces `helper` and marks the field invalid. |
| `invalid` | `boolean` | `false` | Marks the field invalid without a message. |
| `required` | `boolean` | `false` | Adds the asterisk to the label. |
| `id` | `string` | generated | Id handed to the control, when you need a known one. |

## Slots

| Slot | Props | Description |
|---|---|---|
| `default` | `{ id, describedBy, invalid }` | The control. |
| `label` | — | Replaces the label's text. |
| `message` | `{ invalid }` | Replaces the hint / error text. |
