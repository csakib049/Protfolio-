/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: 'rgb(var(--color-bg-rgb))',
        primary: 'rgb(var(--color-primary-rgb) / <alpha-value>)',
        main: 'rgb(var(--color-text-rgb))',
        muted: 'rgb(var(--color-text-muted-rgb))',
        glass: 'rgb(var(--color-glass-rgb) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
