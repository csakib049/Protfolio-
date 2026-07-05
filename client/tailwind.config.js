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
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ff7a00',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        source: ['"Source Code Pro"', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(255, 122, 0, 0.3), 0 0 20px rgba(255, 122, 0, 0.1)' },
          '50%': { boxShadow: '0 0 16px rgba(255, 122, 0, 0.6), 0 0 40px rgba(255, 122, 0, 0.2)' },
        },
      },
    },
  },
  plugins: [],
};
