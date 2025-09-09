/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#ffffff',
        muted: '#f8fafc',
        borderc: '#e5e7eb',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(0,0,0,.06)',
      },
    },
  },
  plugins: [],
}
