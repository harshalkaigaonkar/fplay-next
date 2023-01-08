/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: ['class', '[data-mode="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"),
  ],
}
