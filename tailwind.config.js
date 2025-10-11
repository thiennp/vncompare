/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        // Custom Paint Colors
        'paint-orange': '#ff6b35',
        'paint-teal': '#20b2aa',
        'paint-purple': '#8b5cf6',
        'paint-pink': '#ec4899',
        'paint-cyan': '#06b6d4',
        'paint-red': '#ef4444',
        'paint-coral': '#ff7f7f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
