export default {
  props: { disabled: false },
  model: null,
  template: (attrs) => `<te-radio${attrs} name="demo" :native-value="1" label="Option 1" />
<te-radio${attrs} name="demo" :native-value="2" label="Option 2" />
<te-radio${attrs} name="demo" :native-value="3" label="Option 3" />`,
  note: 'Radios only group when they share a name.',
};
