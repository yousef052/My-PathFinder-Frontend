// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Custom theme handled in index.css via @theme for Tailwind 4 compatibility
    },
  },
  plugins: [],
};
