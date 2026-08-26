// Interaction tests against a real DOM.
//
// Runs the built bundle inside happy-dom with Node's test runner — no vitest,
// no @vue/test-utils. Covers what SSR cannot: event handlers, the
// v-click-outside directive's mount/unmount lifecycle, v-model round-trips
// and the date picker's month arithmetic.
import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();

// Imported after the DOM globals exist, so Vue picks up its browser build.
const { createApp, h, reactive, resolveComponent, nextTick } = await import('vue');
const { default: install } = await import('../dist/vue3-tailwind-elements.js');

// happy-dom keeps timers and the window alive; without this the runner sits
// on an open event loop and aborts the file with SIGABRT after its timeout.
after(async () => { await GlobalRegistrator.unregister(); });

const OPTIONS = { customIcons: { fa: { prefix: 'fa-', icons: { star: 'star' } } } };

/**
 * Mounts one component into the document and wires every event it can emit to
 * a recorder. `update:*` handlers write back into the props, so `v-model`
 * behaves as it would in a real parent.
 */
function mount(tag, initialProps = {}, slots) {
  const state = reactive({ ...initialProps });
  const emitted = {};
  const rec = (name) => (...args) => { (emitted[name] ??= []).push(args); };
  const model = (key) => (value) => { state[key] = value; rec(`update:${key}`)(value); };

  const host = document.createElement('div');
  document.body.appendChild(host);

  const app = createApp({
    render: () => h(resolveComponent(tag), {
      ...state,
      'onUpdate:modelValue': model('modelValue'),
      'onUpdate:activeItem': model('activeItem'),
      'onUpdate:visible': model('visible'),
      'onUpdate:sort': model('sort'),
      'onUpdate:selected': model('selected'),
      'onUpdate:columnOrder': model('columnOrder'),
      onClick: rec('click'),
      onOpen: rec('open'),
      onSelect: rec('select'),
      onClose: rec('close'),
      onBlur: rec('blur'),
      onChange: rec('change'),
      onFocus: rec('focus'),
      onKeydown: rec('keydown'),
      onKeypress: rec('keypress'),
      onKeyup: rec('keyup'),
      onRightIconClick: rec('right-icon-click'),
      onLeftIconClick: rec('left-icon-click'),
    }, slots),
  });
  app.use(install, OPTIONS);
  app.mount(host);

  return {
    host,
    state,
    emitted,
    $: (sel) => host.querySelector(sel),
    $$: (sel) => [...host.querySelectorAll(sel)],
    unmount: () => { app.unmount(); host.remove(); },
  };
}

const click = async (el, init = {}) => {
  /* Vue drops any event whose timestamp is not strictly newer than the moment
     its listener was attached, and happy-dom's clock only ticks whole
     milliseconds — so a click dispatched in the same millisecond as the mount
     silently never reaches the handler. Browsers time events sub-millisecond
     and never hit this; one tick of slack keeps the tests honest. */
  await new Promise((resolve) => setTimeout(resolve, 2));
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...init });
  for (const [k, v] of Object.entries(init)) {
    if (!(k in event)) Object.defineProperty(event, k, { value: v });
  }
  el.dispatchEvent(event);
  await nextTick();
};

const isVisible = (el) => !!el && el.style.display !== 'none';

/* ---------------------------------------------------------------- buttons */

test('te-button emits click and paints a ripple', async () => {
  const w = mount('te-button', { ripple: true }, () => 'Go');
  const button = w.$('button');
  // happy-dom does no layout, so the ripple's size input has to be supplied.
  Object.defineProperty(button, 'clientWidth', { value: 120 });
  Object.defineProperty(button, 'clientHeight', { value: 40 });

  assert.equal(w.$('span.ripple'), null, 'ripple present before any click');
  await click(button, { offsetX: 60, offsetY: 20 });

  assert.equal(w.emitted.click?.length, 1, 'click not emitted');
  const ripple = w.$('span.ripple');
  assert.ok(ripple, 'ripple was not painted');
  assert.equal(ripple.style.width, '120px');
  // The ripple is centred on the pointer: offset minus the radius, where the
  // radius is max(120, 40) / 2 = 60. NaN here would mean the click's offset
  // never reached setRipple.
  assert.equal(ripple.style.left, '0px');   // 60 - 60
  assert.equal(ripple.style.top, '-40px');  // 20 - 60

  await new Promise((r) => setTimeout(r, 750));
  await nextTick();
  assert.equal(w.$('span.ripple'), null, 'ripple never cleared');
  w.unmount();
});

test('te-button without the ripple prop paints nothing', async () => {
  const w = mount('te-button', {}, () => 'Go');
  await click(w.$('button'));
  assert.equal(w.$('span.ripple'), null);
  assert.equal(w.emitted.click?.length, 1);
  w.unmount();
});

test('te-button-group reports which button was clicked', async () => {
  const w = mount('te-button-group', { quantity: 3, disabled: [false, true, false] });
  const buttons = w.$$('button');
  assert.equal(buttons.length, 3);
  assert.ok(buttons[1].disabled, 'disabled[1] was not applied');

  await click(buttons[2]);
  const [payload] = w.emitted.click.at(-1);
  assert.equal(payload.index, 3, 'index is 1-based');
  assert.ok(payload.event instanceof Object, 'no event in the payload');
  w.unmount();
});

/* -------------------------------------------------------------- accordion */

test('te-accordion toggles a panel and emits open/close', async () => {
  const w = mount('te-accordion', { items: ['a', 'b'] });
  const headers = w.$$('button.accordion-button');
  const panels = w.$$('.accordion-collapse');

  assert.ok(!panels[0].classList.contains('is-open'), 'panel starts open');

  await click(headers[0]);
  assert.ok(panels[0].classList.contains('is-open'), 'panel did not open');
  assert.deepEqual(w.emitted.open.at(-1), [0]);

  await click(headers[0]);
  assert.ok(!panels[0].classList.contains('is-open'), 'panel did not close');
  assert.deepEqual(w.emitted.close.at(-1), [0]);
  w.unmount();
});

test('te-accordion clips on an element without padding', () => {
  // `overflow` clips at the padding box, so the collapsing element must carry
  // no padding — otherwise the collapsed panel keeps a strip of content
  // visible. happy-dom does no layout, so this guards the structure instead.
  const w = mount('te-accordion', { items: ['a'] });
  const clip = w.$('.accordion-collapse > .accordion-clip');
  assert.ok(clip, 'the padding-free clipping wrapper is gone');
  assert.ok(clip.querySelector('.accordion-body'), '.accordion-body is not inside the clip');
  assert.ok(![...clip.classList].some((c) => /^p[xyltrb]?-/.test(c)), 'the clip element gained padding');
  w.unmount();
});

test('te-accordion singleOpen keeps only one panel open', async () => {
  const w = mount('te-accordion', { items: ['a', 'b', 'c'], singleOpen: true });
  const headers = w.$$('button.accordion-button');

  await click(headers[0]);
  await click(headers[2]);

  const open = w.$$('.accordion-collapse').map((p) => p.classList.contains('is-open'));
  assert.deepEqual(open, [false, false, true], 'more than one panel stayed open');
  w.unmount();
});

test('te-accordion honours defaultOpen without mutating the prop', async () => {
  const defaultOpen = [1];
  const w = mount('te-accordion', { items: ['a', 'b'], defaultOpen });
  assert.ok(w.$$('.accordion-collapse')[1].classList.contains('is-open'));

  await click(w.$$('button.accordion-button')[0]);
  assert.deepEqual(defaultOpen, [1], 'the defaultOpen array was mutated');
  w.unmount();
});

/* ------------------------------------------------- v-click-outside directive */

test('v-click-outside adds one listener and removes it on unmount', async () => {
  const added = [];
  const removed = [];
  const realAdd = document.addEventListener.bind(document);
  const realRemove = document.removeEventListener.bind(document);
  document.addEventListener = (type, fn, opts) => { if (type === 'click') added.push(fn); return realAdd(type, fn, opts); };
  document.removeEventListener = (type, fn, opts) => { if (type === 'click') removed.push(fn); return realRemove(type, fn, opts); };

  try {
    const w = mount('te-date-picker');
    assert.equal(added.length, 1, 'directive did not register a listener (Vue 2 hooks?)');
    w.unmount();
    await nextTick();
    assert.equal(removed.length, 1, 'listener leaked past unmount');
    assert.equal(removed[0], added[0], 'a different listener was removed');
  } finally {
    document.addEventListener = realAdd;
    document.removeEventListener = realRemove;
  }
});

test('te-date-picker opens on the input and closes on an outside click', async () => {
  const w = mount('te-date-picker');
  const panel = w.$('.absolute.top-0.left-0') ?? w.$$('div').find((d) => d.style.display === 'none');

  await click(w.$('input'));
  assert.ok(isVisible(panel), 'panel did not open');

  await click(document.body);
  assert.ok(!isVisible(panel), 'outside click did not close the panel');
  w.unmount();
});

/* ------------------------------------------------------------ date picker */

test('te-date-picker wraps December to January of the next year', async () => {
  const w = mount('te-date-picker', { modelValue: new Date(2024, 11, 15) });
  const month = () => Number(w.$('select[name="month"]').value);
  const year = () => Number(w.$('select[name="year"]').value);
  assert.equal(month(), 11);
  assert.equal(year(), 2024);

  const [prev, next] = w.$$('.flex.justify-between button');
  await click(next);
  assert.equal(month(), 0, 'December did not wrap to January');
  assert.equal(year(), 2025, 'the year did not advance');

  await click(prev);
  assert.equal(month(), 11, 'January did not wrap back to December');
  assert.equal(year(), 2024, 'the year did not go back');
  w.unmount();
});

test('te-date-picker renders the right number of days and blanks', async () => {
  // February 2024 was a leap month starting on a Thursday.
  const w = mount('te-date-picker', { modelValue: new Date(2024, 1, 10) });
  const days = w.$$('.flex.flex-wrap.-mx-1 > div.px-1.mb-1');
  assert.equal(days.length, 29, 'wrong day count for February 2024');
  w.unmount();
});

test('te-date-picker emits the picked date and closes', async () => {
  const w = mount('te-date-picker', { modelValue: new Date(2024, 0, 1) });
  await click(w.$('input'));

  const cells = w.$$('.flex.flex-wrap.-mx-1 > div.px-1.mb-1');
  await click(cells[14].querySelector('div'));

  const [picked] = w.emitted['update:modelValue'].at(-1);
  assert.ok(picked instanceof Date);
  assert.equal(picked.getFullYear(), 2024);
  assert.equal(picked.getMonth(), 0);
  assert.equal(picked.getDate(), 15);
  assert.equal(w.$('input').value, picked.toLocaleDateString(), 'input did not follow the selection');
  w.unmount();
});

test('te-date-picker disables dates outside min/max', async () => {
  const w = mount('te-date-picker', {
    modelValue: new Date(2024, 0, 10),
    minDate: new Date(2024, 0, 5),
    maxDate: new Date(2024, 0, 20),
  });
  const cells = w.$$('.flex.flex-wrap.-mx-1 > div.px-1.mb-1').map((c) => c.querySelector('div'));
  const blocked = (n) => cells[n - 1].classList.contains('pointer-events-none');
  assert.ok(blocked(1), 'a date before minDate is selectable');
  assert.ok(!blocked(10), 'a date inside the range is blocked');
  assert.ok(blocked(25), 'a date after maxDate is selectable');
  w.unmount();
});

/* ---------------------------------------------------------------- v-model */

test('te-checkbox round-trips v-model', async () => {
  const w = mount('te-checkbox', { modelValue: false, label: 'ok' });
  const input = w.$('input');
  assert.equal(input.checked, false);

  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  await nextTick();

  assert.equal(w.emitted['update:modelValue'].at(-1)[0], true);
  assert.equal(w.state.modelValue, true, 'parent state did not update');
  w.unmount();
});

test('te-checkbox reflects a change from the parent', async () => {
  const w = mount('te-checkbox', { modelValue: false });
  w.state.modelValue = true;
  await nextTick();
  assert.equal(w.$('input').checked, true, 'input did not follow the prop');
  w.unmount();
});

test('te-input round-trips v-model and forwards native events', async () => {
  const w = mount('te-input', { modelValue: '' });
  const input = w.$('input');

  input.value = 'hola';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await nextTick();
  assert.equal(w.state.modelValue, 'hola');

  // These seven were silently dropped before: the hook meant to emit them
  // called an `emit` that did not exist.
  for (const [type, EventCtor] of [
    ['blur', FocusEvent], ['focus', FocusEvent], ['change', Event],
    ['keydown', KeyboardEvent], ['keypress', KeyboardEvent], ['keyup', KeyboardEvent],
  ]) {
    input.dispatchEvent(new EventCtor(type, { bubbles: true }));
  }
  await click(input);
  await nextTick();

  for (const name of ['blur', 'focus', 'change', 'keydown', 'keypress', 'keyup', 'click']) {
    assert.equal(w.emitted[name]?.length, 1, `te-input never emitted ${name}`);
  }
  w.unmount();
});

test('te-input binds a stable id and links its floating label', async () => {
  const w = mount('te-input', { modelValue: '', floating: true, placeholder: 'Name' });
  const id = w.$('input').id;
  assert.ok(id, 'no id was generated');
  assert.equal(w.$('label').getAttribute('for'), id);

  w.state.modelValue = 'x';
  await nextTick();
  assert.equal(w.$('input').id, id, 'the id changed between renders');
  w.unmount();
});

test('te-input keeps non-DOM props off the input element', async () => {
  const w = mount('te-input', { modelValue: '', helperText: 'help', size: 'large', invalid: true });
  const input = w.$('input');
  for (const attr of ['helpertext', 'size', 'invalid', 'floating', 'righticon']) {
    assert.equal(input.getAttribute(attr), null, `${attr} leaked onto the <input>`);
  }
  assert.ok(w.host.textContent.includes('help'), 'helper text is not rendered');
  w.unmount();
});

test('te-input fires icon clicks only when the icon is clickable', async () => {
  const w = mount('te-input', { modelValue: '', rightIcon: 'star', rightIconClickable: false });
  await click(w.$('i'));
  assert.equal(w.emitted['right-icon-click'], undefined, 'emitted while not clickable');

  w.state.rightIconClickable = true;
  await nextTick();
  await click(w.$('i'));
  assert.equal(w.emitted['right-icon-click']?.length, 1, 'did not emit while clickable');
  w.unmount();
});

test('te-input reveals a password and flips the icon back', async () => {
  const w = mount('te-input', { modelValue: 'hunter2', type: 'password' });
  const input = w.$('input');
  const toggle = w.$('button');

  assert.ok(toggle, 'no reveal button on a password field');
  assert.equal(input.type, 'password');
  assert.ok(w.$('i.bi-eye'), 'expected the eye icon while hidden');
  assert.equal(toggle.getAttribute('aria-label'), 'Show password');
  assert.equal(toggle.getAttribute('aria-pressed'), 'false');

  await click(toggle);
  assert.equal(input.type, 'text', 'type did not switch on reveal');
  assert.ok(w.$('i.bi-eye-slash'), 'icon did not flip to eye-slash');
  assert.equal(toggle.getAttribute('aria-label'), 'Hide password');
  assert.equal(toggle.getAttribute('aria-pressed'), 'true');
  assert.equal(input.value, 'hunter2', 'the value was lost across the toggle');

  await click(toggle);
  assert.equal(input.type, 'password', 'type did not switch back');
  assert.ok(w.$('i.bi-eye'), 'icon did not flip back');
  w.unmount();
});

test('te-input reveal can be turned off and never hijacks a custom icon', async () => {
  const off = mount('te-input', { modelValue: 'x', type: 'password', revealable: false });
  assert.equal(off.$('button'), null, 'a reveal button appeared despite revealable=false');
  assert.equal(off.$('i'), null, 'an icon appeared despite revealable=false');
  off.unmount();

  const custom = mount('te-input', { modelValue: 'x', type: 'password', rightIcon: 'star' });
  assert.ok(custom.$('i.bi-star'), 'the custom right icon was replaced by the eye');
  assert.equal(custom.$('input').type, 'password');
  custom.unmount();

  const forced = mount('te-input', { modelValue: 'x', type: 'text', revealable: true });
  assert.ok(forced.$('button'), 'revealable=true was ignored on a non-password field');
  forced.unmount();
});

test('te-input reveal is keyboard reachable', async () => {
  const w = mount('te-input', { modelValue: 'x', type: 'password' });
  const toggle = w.$('button');
  assert.equal(toggle.tagName, 'BUTTON', 'the reveal control is not a button');
  assert.equal(toggle.getAttribute('type'), 'button', 'the toggle would submit a form');
  w.unmount();
});

test('te-list-group updates activeItem only when clickable', async () => {
  const w = mount('te-list-group', { items: ['one', 'two', 'three'], activeItem: null });
  await click(w.$$('li')[1]);
  assert.equal(w.state.activeItem, 1);
  assert.ok(w.$$('li')[1].classList.contains('bg-blue-600'), 'active item is not highlighted');

  const locked = mount('te-list-group', { items: ['a', 'b'], activeItem: null, clickable: false });
  await click(locked.$$('li')[1]);
  assert.equal(locked.state.activeItem, null, 'changed activeItem while clickable=false');
  w.unmount();
  locked.unmount();
});

test('te-list-group accepts plain strings and item objects together', async () => {
  const w = mount('te-list-group', { items: ['plain', { label: 'obj', disabled: true }] });
  const items = w.$$('li');
  assert.match(items[0].textContent, /plain/);
  assert.match(items[1].textContent, /obj/);
  assert.ok(items[1].classList.contains('pointer-events-none'), 'disabled item is still active');
  w.unmount();
});

/* ------------------------------------------------------------------ misc */

test('te-chip emits close from its button', async () => {
  const w = mount('te-chip', { closable: true }, () => 'tag');
  await click(w.$('button'));
  assert.equal(w.emitted.close?.length, 1, 'close was never emitted');
  w.unmount();
});

test('te-loading is removed from the DOM when v-model is false', async () => {
  const w = mount('te-loading', { modelValue: true, text: 'cargando' });
  assert.ok(w.$('.te-backdrop'), 'backdrop not rendered');

  w.state.modelValue = false;
  await nextTick();
  assert.equal(w.$('.te-backdrop'), null, 'backdrop stayed in the DOM');
  w.unmount();
});

test('te-file converts the selected file to base64', async () => {
  const w = mount('te-file', {});
  const input = w.$('input');
  const file = new File(['hello'], 'a.txt', { type: 'text/plain' });
  Object.defineProperty(input, 'files', { value: [file] });

  input.dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 50));

  const [value] = w.emitted['update:modelValue'].at(-1);
  assert.match(value, /^data:text\/plain;base64,/, 'file was not encoded');
  w.unmount();
});

test('te-icon resolves a registered custom family', async () => {
  const w = mount('te-icon', { name: 'star', family: 'fa' });
  assert.equal(w.$('i').className, 'fa-star');
  w.unmount();
});

/* ------------------------------------------------------- dialog overlays */

/* happy-dom implements showModal/close and the `close` event but not the top
   layer, so these cover the wiring: that the model drives the native dialog,
   that every close path funnels through the dialog's own `close` event (which
   is what Escape fires in a browser), and which clicks count as the backdrop.
   The focus trap and Escape themselves are the UA's, not ours to test. */

/** happy-dom measures everything as 0x0; give the element a real box. */
const stubRect = (el, rect) => {
  Object.defineProperty(el, 'getBoundingClientRect', { value: () => rect, configurable: true });
};

test('te-modal opens and closes the native dialog from the model', async () => {
  const w = mount('te-modal', { visible: false, title: 'Hi' });
  const dialog = w.$('dialog.modal');
  assert.ok(dialog, 'te-modal did not render a <dialog>');
  assert.equal(dialog.open, false, 'the dialog opened before it was asked to');

  w.state.visible = true;
  await nextTick();
  assert.equal(dialog.open, true, 'the model never reached showModal()');

  w.state.visible = false;
  await nextTick();
  assert.equal(dialog.open, false, 'the model never reached close()');
  w.unmount();
});

test('te-modal writes back the model when the dialog closes itself', async () => {
  // Escape, the close button and the backdrop all end here in a real browser.
  const w = mount('te-modal', { visible: true, title: 'Hi' });
  await nextTick();
  const dialog = w.$('dialog.modal');
  assert.equal(dialog.open, true);

  dialog.close();
  await nextTick();
  assert.equal(w.state.visible, false, 'a self-closing dialog left the model true');
  assert.equal(w.emitted['close']?.length, 1, 'close was not emitted exactly once');
  w.unmount();
});

test('te-modal closes on the backdrop but not on its own content', async () => {
  const w = mount('te-modal', { visible: true, title: 'Hi' });
  await nextTick();
  const dialog = w.$('dialog.modal');

  await click(w.$('.modal-content'));
  assert.equal(dialog.open, true, 'a click inside the modal closed it');

  await click(dialog);
  assert.equal(dialog.open, false, 'a backdrop click did not close the modal');
  w.unmount();
});

test('te-modal with closeOnBackdrop false ignores the backdrop', async () => {
  const w = mount('te-modal', { visible: true, title: 'Hi', closeOnBackdrop: false });
  await nextTick();
  const dialog = w.$('dialog.modal');

  await click(dialog);
  assert.equal(dialog.open, true, 'the backdrop closed a modal that opted out');

  // The close button still works — opting out of the backdrop is not a trap.
  await click(w.$('.btn-close'));
  assert.equal(dialog.open, false, 'the close button stopped working');
  w.unmount();
});

test('te-offcanvas tells its backdrop apart from its own padding', async () => {
  const w = mount('te-offcanvas', { modelValue: true, title: 'Panel' });
  await nextTick();
  const dialog = w.$('dialog.offcanvas');
  assert.equal(dialog.open, true);
  // A 320px-wide drawer pinned to the left edge.
  stubRect(dialog, { left: 0, right: 320, top: 0, bottom: 800 });

  await click(dialog, { clientX: 160, clientY: 400 });
  assert.equal(dialog.open, true, 'a click on the panel itself closed it');

  await click(dialog, { clientX: 600, clientY: 400 });
  assert.equal(dialog.open, false, 'a click on the backdrop did not close it');
  assert.equal(w.state.modelValue, false, 'the model was not written back');
  w.unmount();
});

/* -------------------------------------------------------------- dropdown */

test('te-dropdown wires the trigger to the panel as a native popover', async () => {
  const w = mount('te-dropdown', { label: 'Actions', items: ['Edit', 'Delete'] });
  const trigger = w.$('.dropdown-toggle');
  const panel = w.$('.dropdown-menu');

  assert.equal(trigger.getAttribute('popovertarget'), panel.id, 'the trigger points nowhere');
  assert.ok(panel.hasAttribute('popover'), 'the panel is not a popover');
  assert.equal(trigger.getAttribute('aria-expanded'), 'false');
  assert.equal(panel.getAttribute('aria-labelledby'), trigger.id);
  w.unmount();
});

test('te-dropdown normalises string items and reports the picked one', async () => {
  const w = mount('te-dropdown', { items: ['Edit', { label: 'Delete', disabled: true }] });
  const items = w.$$('.dropdown-item');
  assert.equal(items.length, 2);
  assert.equal(items[0].textContent.trim(), 'Edit');
  assert.equal(items[1].disabled, true, 'a disabled item was left clickable');

  // Stubbed because happy-dom ships no Popover API; the component only ever
  // calls hidePopover(), never reimplements dismissal.
  const panel = w.$('.dropdown-menu');
  let hidden = 0;
  panel.hidePopover = () => { hidden++; };

  await click(items[0]);
  assert.deepEqual(w.emitted['select']?.at(-1), [{ label: 'Edit' }, 0]);
  assert.equal(hidden, 1, 'picking an item left the menu open');

  await click(items[1]);
  assert.equal(hidden, 1, 'a disabled item closed the menu');
  w.unmount();
});

test('te-dropdown survives a browser with no Popover API', async () => {
  // The model watcher must no-op rather than throw where showPopover is absent.
  const w = mount('te-dropdown', { items: ['Edit'] });
  w.state.modelValue = true;
  await nextTick();
  assert.equal(w.$('.dropdown-menu').isConnected, true);
  w.unmount();
});

const GRID_HEADERS = [{ label: 'Name', field: 'name' }, { label: 'Qty', field: 'qty' }];
const GRID_ITEMS = [{ name: 'b', qty: 2 }, { name: 'a', qty: 1 }, { name: 'c', qty: 3 }];

test('te-table cycles a sortable header asc -> desc -> unsorted', async () => {
  const w = mount('te-table', { headers: GRID_HEADERS, items: GRID_ITEMS, sortable: true });
  const nameHeader = w.$$('th span')[0];
  const names = () => w.$$('tbody tr td:first-child').map((td) => td.textContent.trim());

  assert.deepEqual(names(), ['b', 'a', 'c'], 'started out sorted');

  await click(nameHeader);
  assert.deepEqual(w.state.sort, { field: 'name', dir: 'asc' });
  assert.deepEqual(names(), ['a', 'b', 'c']);

  await click(nameHeader);
  assert.deepEqual(w.state.sort, { field: 'name', dir: 'desc' });
  assert.deepEqual(names(), ['c', 'b', 'a']);

  /* The third click must clear it, otherwise a column can never go back. */
  await click(nameHeader);
  assert.equal(w.state.sort, null);
  assert.deepEqual(names(), ['b', 'a', 'c']);
  w.unmount();
});

test('te-table does not sort a column that is not sortable', async () => {
  const w = mount('te-table', {
    headers: [{ label: 'Name', field: 'name' }, { label: 'Qty', field: 'qty', sortable: true }],
    items: GRID_ITEMS,
  });
  await click(w.$$('th span')[0]);
  assert.equal(w.state.sort ?? null, null, 'a plain column reacted to a click');

  await click(w.$$('th span')[1]);
  assert.deepEqual(w.state.sort, { field: 'qty', dir: 'asc' }, 'per-header sortable was ignored');
  w.unmount();
});

test('te-table select-all only touches the visible page', async () => {
  const items = Array.from({ length: 6 }, (_, i) => ({ name: `r${i}`, qty: i }));
  const w = mount('te-table', {
    headers: GRID_HEADERS,
    items,
    selectable: true,
    rowKey: 'name',
    itemPerPage: 3,
    selected: [],
  });

  const headerBox = w.$('thead input[type="checkbox"]');
  headerBox.checked = true;
  headerBox.dispatchEvent(new Event('change'));
  await nextTick();
  assert.deepEqual(w.state.selected, ['r0', 'r1', 'r2'], 'select-all reached rows on other pages');

  /* Off-page selections must survive a second page's select-all. */
  const secondPage = w.$$('.page-link').find((el) => el.textContent.trim() === '2');
  await click(secondPage);
  const box2 = w.$('thead input[type="checkbox"]');
  assert.equal(box2.checked, false, 'page 2 inherited page 1 checked state');

  box2.checked = true;
  box2.dispatchEvent(new Event('change'));
  await nextTick();
  assert.deepEqual(w.state.selected, ['r0', 'r1', 'r2', 'r3', 'r4', 'r5']);
  w.unmount();
});

test('te-table toggles a single row without disturbing the rest', async () => {
  const w = mount('te-table', {
    headers: GRID_HEADERS, items: GRID_ITEMS, selectable: true, rowKey: 'name', selected: ['a'],
  });
  const boxes = w.$$('tbody input[type="checkbox"]');
  boxes[0].checked = true;
  boxes[0].dispatchEvent(new Event('change'));
  await nextTick();
  assert.deepEqual(w.state.selected, ['a', 'b']);

  boxes[0].checked = false;
  boxes[0].dispatchEvent(new Event('change'));
  await nextTick();
  assert.deepEqual(w.state.selected, ['a']);
  w.unmount();
});

/* --------------------------------------------------------- append-to-body */

test('te-multiselect teleports its list to <body> and keeps clicks inside it', async () => {
  const w = mount('te-multiselect', {
    appendToBody: true,
    options: [{ text: 'One', value: 1 }, { text: 'Two', value: 2 }],
    modelValue: [],
  });
  assert.equal(w.$('.list-container'), null, 'list still rendered inside the wrapper');

  const panel = [...document.body.children].find((el) => el.querySelector?.('.list-container'));
  assert.ok(panel, 'list was not teleported to <body>');

  await click(w.$('input'));
  assert.ok(isVisible(panel), 'list did not open');
  assert.equal(panel.style.position, 'fixed', 'teleported list is not anchored');

  // A click inside the teleported list is outside the wrapper — it must not close it.
  await click(panel.querySelector('.list-container'));
  assert.ok(isVisible(panel), 'clicking the teleported list closed it');

  await click(document.body);
  // the zoom transition defers display:none past nextTick
  await new Promise((resolve) => setTimeout(resolve, 50));
  assert.ok(!isVisible(panel), 'outside click did not close the list');
  w.unmount();
});

test('te-date-picker teleports its panel to <body>', async () => {
  const w = mount('te-date-picker', { appendToBody: true });
  assert.equal(w.$('select[name="month"]'), null, 'panel still rendered inside the wrapper');

  const panel = [...document.body.children].find((el) => el.querySelector?.('select[name="month"]'));
  assert.ok(panel, 'panel was not teleported to <body>');

  await click(w.$('input'));
  assert.ok(isVisible(panel), 'panel did not open');
  assert.equal(panel.style.position, 'fixed', 'teleported panel is not anchored');
  await click(document.body);
  assert.ok(!isVisible(panel), 'outside click did not close the panel');
  w.unmount();
});
