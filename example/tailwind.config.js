/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    './node_modules/vue3-tailwind-elements/**/*.{js,ts,vue}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('vue3-tailwind-elements/dist/plugin'),
  ],
}

