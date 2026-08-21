import { GlobalRegistrator } from '@happy-dom/global-registrator';
GlobalRegistrator.register();
const { createApp, h, reactive, resolveComponent, nextTick } = await import('vue');
const { default: install } = await import('./dist/vue3-tailwind-elements.js');
const rec = (n) => (...a) => {};
const state = reactive({ items: ['Edit', { label: 'Delete', disabled: true }] });
const host = document.createElement('div'); document.body.appendChild(host);
const app = createApp({ render: () => h(resolveComponent('te-dropdown'), {
  ...state,
  'onUpdate:modelValue': rec(), 'onUpdate:activeItem': rec(), 'onUpdate:visible': rec(),
  onClick: rec(), onOpen: rec(), onSelect: (...a)=>console.log('select', a), onClose: rec(),
  onBlur: rec(), onChange: rec(), onFocus: rec(), onKeydown: rec(), onKeypress: rec(), onKeyup: rec(),
  onRightIconClick: rec(), onLeftIconClick: rec(),
}, undefined) });
app.use(install); app.mount(host);
const panel = host.querySelector('.dropdown-menu');
let hidden = 0; panel.hidePopover = () => { hidden++; };
const item = host.querySelectorAll('.dropdown-item')[0];
item.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
await nextTick();
console.log('hidden =', hidden);
await GlobalRegistrator.unregister();
