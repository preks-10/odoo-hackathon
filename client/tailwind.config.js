/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#87CEEB', // Sky Blue (soft blue)
          dark: '#4682B4', // Steel Blue
          light: '#B0E0E6', // Powder Blue
        },
        accent: {
          DEFAULT: '#98FB98', // Pale Green
          dark: '#32CD32', // Lime Green
        },
        secondary: {
          DEFAULT: '#DDA0DD', // Plum (soft purple)
          light: '#E6E6FA', // Lavender
        },
        background: {
          DEFAULT: '#FFFFFF', // White
          light: '#F8F8FF', // Alice Blue
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'serif'],
      },
    },
  },
  plugins: [],
};
