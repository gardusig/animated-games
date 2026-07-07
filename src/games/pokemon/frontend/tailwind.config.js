/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        poke: {
          red: '#EE1515',
          dark: '#1a1a2e',
          gold: '#FFCB05',
          blue: '#3B4CCA',
        },
      },
    },
  },
  plugins: [],
}
