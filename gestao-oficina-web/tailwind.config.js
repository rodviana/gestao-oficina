/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      colors: {
        shop: {
          50: '#f3f7f4',
          100: '#e2ebe4',
          200: '#c5d7ca',
          500: '#3d6b4f',
          700: '#2a4a37',
          900: '#1a2e22',
        },
        sand: {
          50: '#faf8f5',
          100: '#f3efe8',
          200: '#e6ddd0',
        },
      },
      boxShadow: {
        soft: '0 10px 40px rgba(26, 46, 34, 0.08)',
      },
    },
  },
  plugins: [],
};
