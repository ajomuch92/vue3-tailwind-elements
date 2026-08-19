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
      onClick: rec('click'),
      onOpen: rec('open'),
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
