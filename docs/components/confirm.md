# Confirm

`showConfirm()` asks a yes-or-no question from anywhere in your code and
returns a promise. It is `window.confirm()` in your own markup: it does not
freeze the page, it can be styled and translated, and it is a real
[`te-modal`](/components/modal) underneath — so Escape, the focus trap and the
inert page behind it come from the browser.

## Usage

<Demo>
  <te-button type="danger" @click="showConfirm({ title: 'Delete project', message: 'This cannot be undone.', confirmLabel: 'Delete', type: 'danger' })">Delete project</te-button>
</Demo>

```js
import { showConfirm } from 'vue3-tailwind-elements';

async function remove() {
  const ok = await showConfirm({
    title: 'Delete project',
    message: 'This cannot be undone.',
    confirmLabel: 'Delete',
    type: 'danger',
  });

  if (ok) await api.deleteProject();
}
```

The promise resolves `true` only from the confirm button. Cancel, the close
button, the backdrop and <kbd>Esc</kbd> all resolve `false`, so a dismissed
dialog is a "no" rather than a promise left hanging.

Focus opens on Cancel, which is where you want it when the question is
destructive.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `''` | Heading. Omit it for a bare question. |
| `message` | `string` | `''` | The question. Line breaks are kept. |
| `confirmLabel` | `string` | `'Confirm'` | Label of the yes button. |
| `cancelLabel` | `string` | `'Cancel'` | Label of the no button. |
| `type` | `Variant` | `'primary'` | Variant of the confirm button. |
| `centered` | `boolean` | `true` | Centres the dialog vertically. |
| `size` | `'' \| 'sm' \| 'lg' \| 'xl'` | `'sm'` | Dialog width. |
| `showCloseButton` | `boolean` | `true` | The × in the header. |
| `closeOnBackdrop` | `boolean` | `true` | A click outside answers no. |

## Server-side rendering

With no DOM there is nobody to answer, so `showConfirm()` resolves `false`
instead of throwing. Guard the call if that would be the wrong default:

```js
if (typeof document !== 'undefined' && await showConfirm({ message: 'Sure?' })) {
  // …
}
```
