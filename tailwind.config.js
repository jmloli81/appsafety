/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",  
    "./presentation/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: {
          DEFAULT: '#8B5CF6',
          light: '#9333EA',
          dark: '#7C3AED',
        },
        tertiary: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        }
      },
      fontFamily: {
        'work-black': ['work-black', 'sans-serif'],
        'work-light': ['work-light', 'sans-serif'],
        'work-medium': ['work-medium', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
