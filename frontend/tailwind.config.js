/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        foreground: '#FAFAFA',
        card: '#0A0A0A',
        'card-foreground': '#FFFFFF',
        popover: '#0A0A0A',
        'popover-foreground': '#FFFFFF',
        primary: '#7C3AED',
        'primary-foreground': '#FFFFFF',
        secondary: '#06B6D4',
        'secondary-foreground': '#000000',
        muted: '#1F1F1F',
        'muted-foreground': '#A3A3A3',
        accent: '#F472B6',
        'accent-foreground': '#000000',
        destructive: '#EF4444',
        'destructive-foreground': '#FFFFFF',
        border: '#27272A',
        input: '#27272A',
        ring: '#7C3AED',
        'chart-1': '#7C3AED',
        'chart-2': '#06B6D4',
        'chart-3': '#F472B6',
        'chart-4': '#10B981',
        'chart-5': '#F59E0B',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'shimmer': 'shimmer 4s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};