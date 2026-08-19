import type { Directive, DirectiveBinding } from 'vue';

export type ClickOutsideHandler = (event: MouseEvent, el: HTMLElement) => void;

export interface ClickOutsideOptions {
  handler: ClickOutsideHandler;
  /** Return false to swallow the event. Defaults to always-allow. */
  middleware?: (event: MouseEvent, el: HTMLElement) => boolean;
}

export type ClickOutsideValue = ClickOutsideHandler | ClickOutsideOptions;

const listeners = new WeakMap<HTMLElement, (event: MouseEvent) => void>();

function parse(value: ClickOutsideValue): Required<ClickOutsideOptions> {
  if (typeof value === 'function') return { handler: value, middleware: () => true };
  if (typeof value !== 'object' || value === null || typeof value.handler !== 'function') {
    throw new TypeError(`v-click-outside: binding value must be a function or { handler }, got ${typeof value}`);
  }
  return { handler: value.handler, middleware: value.middleware ?? (() => true) };
}

function mounted(el: HTMLElement, binding: DirectiveBinding<ClickOutsideValue>) {
  const { handler, middleware } = parse(binding.value);
  const listener = (event: MouseEvent) => {
    if (el.contains(event.target as Node)) return;
    if (!middleware(event, el)) return;
    handler(event, el);
  };
  listeners.set(el, listener);
  document.addEventListener('click', listener, true);
}

function unmounted(el: HTMLElement) {
  const listener = listeners.get(el);
  if (!listener) return;
  document.removeEventListener('click', listener, true);
  listeners.delete(el);
}

export const clickOutside: Directive<HTMLElement, ClickOutsideValue> = { mounted, unmounted };

export default clickOutside;
