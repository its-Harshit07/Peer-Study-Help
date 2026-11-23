/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F4F0E8',
          200: '#EAE4D7',
          300: '#DDD5C4'
        },
        forest: {
          600: '#235339',
          700: '#1F4A2C',
          800: '#1B4332',
          900: '#143527'
        },
        terracotta: {
          500: '#D9532F',
          600: '#C85A32',
          700: '#B24724'
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace']
      }
    },
  },
  plugins: [],
}
