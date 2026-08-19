# v-click-outside

Registered by the plugin. Runs a handler when a click lands outside the element.

```vue
<template>
  <div v-click-outside="close" class="menu">…</div>
</template>
```

## Object form

Pass a `middleware` function to ignore some clicks. Returning `false` swallows
the event.

```vue
<template>
  <div v-click-outside="{ handler: close, middleware: notOnTrigger }">…</div>
</template>

<script setup>
function close(event, el) {
  open.value = false;
}

// Ignore clicks on the button that opens the menu.
function notOnTrigger(event) {
  return !triggerRef.value?.contains(event.target);
}
</script>
```

## Types

```ts
import type { ClickOutsideValue } from 'vue3-tailwind-elements';

type ClickOutsideHandler = (event: MouseEvent, el: HTMLElement) => void;

interface ClickOutsideOptions {
  handler: ClickOutsideHandler;
  middleware?: (event: MouseEvent, el: HTMLElement) => boolean;
}
```

## Notes

- The listener is attached to `document` in the **capture** phase, so it runs
  before the click reaches its target.
- It is removed on `unmounted`. One listener per element, no leaks.
- Clicks *inside* the element, at any depth, never fire the handler.
- Importing the directive directly is also possible if you would rather not
  register the plugin:

  ```ts
  import { clickOutside as vClickOutside } from 'vue3-tailwind-elements';
  ```
