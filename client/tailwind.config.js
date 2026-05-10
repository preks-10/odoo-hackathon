/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFA07A', // Light Salmon (pastel orange)
          dark: '#FF8C69', // Dark Salmon
          light: '#FFB6C1', // Light Pink (pastel red)
        },
        accent: {
          DEFAULT: '#F4A460', // Sandy Brown (muted orange)
          dark: '#D2691E', // Chocolate
        },
        secondary: {
          DEFAULT: '#D2B48C', // Tan (soft brown)
          light: '#F5DEB3', // Wheat
        },
        background: {
          DEFAULT: '#FFF8DC', // Cornsilk (cream)
          light: '#FFFFF0', // Ivory
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'serif'],
      },
    },
  },
  plugins: [],
};
