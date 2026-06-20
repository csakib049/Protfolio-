/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: 'rgb(var(--color-bg-rgb))',
        primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
        surface: 'rgba(255,255,255,0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
