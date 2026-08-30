import { createApp, h } from 'vue';
import type { App } from 'vue';
import TeConfirmHandler from './confirmHandler.vue';
import type { Variant } from '../types';

export interface ShowConfirmOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Variant of the confirm button — `danger` for anything destructive. */
  type?: Variant;
  centered?: boolean;
  size?: '' | 'sm' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
}

/*
 * The imperative twin of te-modal, in the shape showToast already established:
 * its own little app, unmounted once the dialog has closed. Awaiting it reads
 * like window.confirm() without freezing the page — and unlike window.confirm,
 * it is your own markup, so it can be styled and translated.
 */
const showConfirm = (options: ShowConfirmOptions = {}): Promise<boolean> => {
  /* No DOM (SSR, a worker) means nobody can answer: the caller gets the same
     "no" it would get from a dismissed dialog rather than a rejected promise. */
  if (typeof document === 'undefined') return Promise.resolve(false);

  const host = document.createElement('div');
  document.body.appendChild(host);

  let app: App | null = null;

  return new Promise<boolean>((resolve) => {
    const settle = (answer: boolean) => {
      resolve(answer);
      /* Torn down after the dialog has finished closing, so the page does not
         blink where it used to be. */
      setTimeout(() => {
        app?.unmount();
        host.remove();
        app = null;
      }, 300);
    };

    app = createApp({ render: () => h(TeConfirmHandler, { ...options, onResolve: settle }) });
    app.mount(host);
  });
};

export default showConfirm;
