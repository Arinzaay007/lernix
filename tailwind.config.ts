import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'Courier New', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#0a0a0f',
          card:    '#0f0f18',
          code:    '#0d0d14',
        },
        accent: {
          DEFAULT: '#6c63ff',
          dim:     'rgba(108,99,255,0.12)',
          glow:    'rgba(108,99,255,0.35)',
          text:    '#a5a0ff',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          light:   'rgba(255,255,255,0.04)',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'dot-bounce':'dotBounce 1.4s ease infinite',
        'pulse-dot': 'pulseDot 2s ease infinite',
        'spin-slow': 'spin 1.2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        dotBounce: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%':           { transform: 'translateY(-5px)', opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.8)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#d0cde8',
            maxWidth: 'none',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
