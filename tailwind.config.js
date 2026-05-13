/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'Georgia', 'serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        navy: { DEFAULT: '#1B2A4A', light: '#243556', deep: '#111D33' },
        gold: { DEFAULT: '#C8A951', light: '#DFC27A', pale: '#F5EDD4' },
        slate: { DEFAULT: '#8896AB', light: '#B4BFCC', dark: '#4A5568' },
        cream: { DEFAULT: '#FAF8F4', dark: '#F0EDE6' },
      },
    },
  },
  plugins: [],
}
