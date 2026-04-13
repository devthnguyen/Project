/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define a custom dark palette optimized for readability
        // Similar tone to UB, but darker and cleaner.
        primary: {
          light: '#2d333b', // Lighter dark for cards/hover
          DEFAULT: '#22272e', // Main dark background
          dark: '#1c2128', // Darkest background
        },
        accent: {
          light: colors.cyan[400],
          DEFAULT: colors.cyan[500], // Primary interaction color
          dark: colors.cyan[600],
        },
        // Score coloring inspired by UB (Speed bands)
        score: {
          tier1: colors.emerald[400], // Excellent
          tier2: colors.sky[400],     // Very Good
          tier3: colors.amber[400],   // Average
          tier4: colors.rose[500],    // Poor
        },
        neutral: colors.neutral, // Use default neutral grays for text
      },
      fontFamily: {
        // Clean modern tech fonts
        sans: ['"Inter"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}