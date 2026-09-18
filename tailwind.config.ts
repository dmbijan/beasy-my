import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.2)',
          border: 'rgba(255, 255, 255, 0.2)',
          borderDark: 'rgba(255, 255, 255, 0.1)',
          glow: 'rgba(255, 255, 255, 0.4)',
        },
        accent: {
          rose: '#f43f5e',
          indigo: '#6366f1',
          emerald: '#10b981',
          amber: '#f59e0b',
        },
      },
      backdropBlur: {
        xs: '2px',
        xl: '24px',
        '2xl': '40px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
        'glass-inner': 'inset 0 1px 1px rgba(255, 255, 255, 0.4)',
        'glass-lg': '0 12px 48px 0 rgba(0, 0, 0, 0.15)',
        'glow-rose': '0 0 20px rgba(244, 63, 94, 0.4)',
        'glow-indigo': '0 0 20px rgba(99, 102, 241, 0.4)',
      },
      borderRadius: {
        'glass': '1.5rem',
        'glass-lg': '2rem',
        'glass-xl': '2.5rem',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(244, 63, 94, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 30px rgba(244, 63, 94, 0.6)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
