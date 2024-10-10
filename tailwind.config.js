/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#080369",
        secondary: "#4e97fc",
        light: "#a4d8fc",
        dark: "#1d1d1d",
      },
    },
  },
  plugins: [],
};
