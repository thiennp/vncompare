/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#FF6B35', // Vibrant orange
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#4ECDC4', // Turquoise
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#FF4757', // Vibrant red
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F8F9FA',
          foreground: '#6C757D',
        },
        accent: {
          DEFAULT: '#A8E6CF', // Mint green
          foreground: '#2D3436',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#2D3436',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#2D3436',
        },
        // Vibrant Paint Colors
        'paint-red': '#FF4757',
        'paint-blue': '#3742FA',
        'paint-green': '#2ED573',
        'paint-yellow': '#FFA502',
        'paint-purple': '#9C88FF',
        'paint-pink': '#FF6B9D',
        'paint-orange': '#FF6B35',
        'paint-teal': '#4ECDC4',
        'paint-lime': '#A8E6CF',
        'paint-coral': '#FF7675',
        'paint-indigo': '#6C5CE7',
        'paint-cyan': '#00CEC9',
        'paint-amber': '#FDCB6E',
        'paint-rose': '#E84393',
        'paint-violet': '#A29BFE',
        'paint-emerald': '#00B894',
        'paint-sky': '#74B9FF',
        'paint-slate': '#636E72',
        'paint-stone': '#DDD6FE',
        'paint-zinc': '#F1F2F6',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
