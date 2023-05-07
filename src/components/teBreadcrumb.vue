<template>
  <nav class="rounded-md w-full">
    <ol class="list-reset flex">
      <template v-for="(option, key) in options">
        <li :key="key" v-if="key<options.length-1">
          <component :is="linkTag" v-bind="getBindValues(option)" class="text-blue-600 hover:text-blue-700">{{option.label}}</component>
        </li>
        <li v-else :key="`${key}-e`" class="text-gray-500">{{option.label}}</li>
        <li v-if="key<options.length-1" :key="key"><span class="text-gray-500 mx-2">{{separator}}</span></li>
      </template>
    </ol>
  </nav>
</template>

<script>
  export default {
    name: 'TeBreadcrumb'
  }
</script>

<script setup>
const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  separator: {
    type: String,
    default: '/',
    validator: (val) => ['/', '\\', '>'].includes(val),
  },
  linkTag: {
    type: String,
    default: 'a',
    validator: (val) => ['a', 'router-link', 'nuxt-link'].includes(val),
  }
});

function getBindValues(option) {
  return props.linkTag === 'a' ? { href: option.href } : { to: option.to };
}
</script>