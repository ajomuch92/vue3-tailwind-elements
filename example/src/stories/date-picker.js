export default {
  props: { placeholder: 'Select a date', disabled: false, appendToBody: false },
  model: null,
  template: (attrs) => `<te-date-picker${attrs} :min-date="minDate" :max-date="maxDate" :not-allowed-dates="notAllowed" />`,
  data: {
    minDate: new Date(),
    maxDate: new Date(Date.now() + 30 * 864e5),
    notAllowed: [new Date(Date.now() + 3 * 864e5)],
  },
  note: 'Bounded to the next 30 days; day +3 is blocked. Turn on appendToBody if the calendar is clipped by a scrolling container.',
};
