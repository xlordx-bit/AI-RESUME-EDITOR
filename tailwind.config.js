/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        'dark': {
          50: '#383838',
          100: '#333333',
          200: '#2b2b2b',
          300: '#242424',
          400: '#1c1c1c',
          500: '#181818',
          600: '#151515',
          700: '#121212',
          800: '#0f0f0f',
          900: '#0a0a0c',
          950: '#050505',
        },
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      backgroundSize: {
        'gradient-animate': '200% 200%',
      },
    },
  },
  plugins: [],
}
