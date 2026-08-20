import { createApp, h, ref } from 'vue';
import type { App } from 'vue';
import TeToastHandler from './toastHandler.vue';

export interface ShowToastOptions {
  toast: Record<string, unknown>;
  type?: 'normal' | 'light';
  position?: 'top' | 'bottom';
  align?: 'left' | 'center' | 'right';
  /** Auto-dismiss after this many milliseconds. Omit to keep it open. */
  timeout?: number;
}

export interface ToastInstance {
  close: () => void;
}

/*
 * Vue 2's `new (Vue.extend(C))({ propsData }).$mount()` has no Vue 3
 * equivalent; a toast is its own little app now, unmounted after the leave
 * transition so nothing leaks.
 */
const showToast = (options: ShowToastOptions): ToastInstance | undefined => {
  if (typeof document === 'undefined' || !options?.toast) return undefined;

  const host = document.createElement('div');
  document.body.appendChild(host);

  const handler = ref<{ close: () => void } | null>(null);
  let app: App | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const destroy = () => {
    if (timer) clearTimeout(timer);
    app?.unmount();
    host.remove();
    app = null;
  };

  // Called once the handler reports it has started fading out.
  const onClosed = () => {
    if (app) setTimeout(destroy, 500);
  };

  // Public close: run the leave transition first, then tear down.
  const close = () => handler.value?.close();

  app = createApp({
    render: () =>
      h(TeToastHandler, {
        ref: handler,
        position: options.position,
        align: options.align,
        type: options.type,
        toast: options.toast,
        onClose: onClosed,
      }),
  });
  app.mount(host);

  if (options.timeout) {
    timer = setTimeout(close, options.timeout);
  }

  return { close };
};

export default showToast;
