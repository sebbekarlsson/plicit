import theme from './theme.config';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}", "./src/index.ts", "./dist/*.html"],
  theme,
  plugins: [],
};
