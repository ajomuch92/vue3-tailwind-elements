import HelloWorld from './components/HelloWorld.vue';
import TeButton from './components/TeButton.vue';

import Plugin from './plugin';

export default function install(vueApp) {
  vueApp.component('hello-world', HelloWorld);
  vueApp.component('te-button', TeButton);
}

export { Plugin };