/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#F6F3EA',
        ink: '#2A2823',
        forest: {
          DEFAULT: '#24402E',
          light: '#345943',
          dark: '#182B1F',
        },
        soil: {
          DEFAULT: '#7A4E32',
          light: '#9C6B48',
        },
        wheat: {
          DEFAULT: '#C99A3B',
          light: '#E0B85C',
        },
        sage: '#8FA382',
        rust: '#A6432D',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['"Public Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
