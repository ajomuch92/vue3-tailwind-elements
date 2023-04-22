import HelloWorld from './components/HelloWorld.vue';
import TeButton from './components/TeButton.vue';

import plugin from './plugin';

export default function install(vueApp) {
  vueApp.component('hello-world', HelloWorld);
  vueApp.component('te-button', TeButton);
}

export { plugin };