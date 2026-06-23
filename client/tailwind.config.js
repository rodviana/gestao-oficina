/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#f8fafc',
          border: '#e2e8f0',
        },
      },
    },
  },
  plugins: [],
};
