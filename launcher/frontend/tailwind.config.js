/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    '../../games/yugioh/frontend/src/**/*.{js,jsx}',
    '../../games/pokemon/frontend/src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'yugioh-accent': '#f5c518',
        'yugioh-gold': '#ffd700',
        'yugioh-dark': '#0a0a1a',
        'yugioh-blue': '#1e3a8a',
        'yugioh-purple': '#6b21a8',
        'poke-gold': '#ffcb05',
        'poke-dark': '#1a1a2e',
        'poke-red': '#ef4444',
        'poke-blue': '#3b82f6',
      },
      backgroundImage: {
        'yugioh-gradient': 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)',
      },
      boxShadow: {
        'yugioh-glow': '0 0 20px rgba(245, 197, 24, 0.3)',
      },
    },
  },
  plugins: [],
}
