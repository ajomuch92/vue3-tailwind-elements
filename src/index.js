import HelloWorld from './components/HelloWorld.vue';
import TeButton from './components/TeButton.vue';

export default function install(vueApp) {
  vueApp.component('hello-world', HelloWorld);
  vueApp.component('te-button', TeButton);
}