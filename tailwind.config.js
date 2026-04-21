/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          offwhite: '#F5F3EC',
          warmgray: '#E4E1D5',
          graphite: '#696D78',
          slate: '#1F2837',
          navy: '#1A2C52',
          electric: '#0DACC9',
          glow: '#34D4F0',
          dark: '#0D1620',
        },
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      letterSpacing: {
        tight: '-0.03em',
        display: '-0.04em',
      },
      lineHeight: {
        body: '1.75',
        relaxed: '1.7',
      },
      boxShadow: {
        card: '0 1px 3px rgba(13,22,32,0.06), 0 4px 16px rgba(13,22,32,0.08)',
        'card-hover': '0 4px 12px rgba(13,22,32,0.08), 0 16px 40px rgba(13,22,32,0.12)',
        'electric': '0 4px 24px rgba(13,172,201,0.3)',
        'electric-lg': '0 8px 40px rgba(13,172,201,0.4)',
        'glow': '0 0 40px rgba(52,212,240,0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
