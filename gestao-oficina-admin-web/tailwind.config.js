/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f4f6f8',
          100: '#e8ecf0',
          200: '#d0d8e0',
          300: '#a8b4c0',
          400: '#7a8a9a',
          500: '#5a6a7a',
          600: '#3d4d5c',
          700: '#2a3845',
          800: '#1a2430',
          900: '#0f161e',
          950: '#080c11',
        },
        signal: {
          DEFAULT: '#e85d04',
          soft: '#fff0e6',
          strong: '#c44a00',
          muted: '#f4a261',
        },
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#f7f9fb',
          border: '#e2e8ef',
          mist: '#eef2f6',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 22, 30, 0.04), 0 4px 16px rgba(15, 22, 30, 0.06)',
        lift: '0 8px 28px rgba(15, 22, 30, 0.12)',
        glow: '0 0 0 3px rgba(232, 93, 4, 0.2)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.35s ease-out both',
        'fade-in': 'fade-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
