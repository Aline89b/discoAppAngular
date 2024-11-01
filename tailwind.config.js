/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./app/**/*.{html,ts}",
    "./components/**/*.{html,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}