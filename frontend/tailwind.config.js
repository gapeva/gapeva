/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Identity & Luxury Aura [cite: 44, 45]
        navy: {
          900: '#0A0F1E', // Midnight Navy (Background)
          800: '#161d30', // Lighter Navy (Cards)
        },
        gold: {
          400: '#D4AF37', // Champagne Gold (Accents/Primary)
          500: '#b59328', // Darker Gold (Hover)
        },
        white: '#FFFFFF', // Pure White 
      },
      fontFamily: {
        // Typography Standards [cite: 46, 47]
        serif: ['"Playfair Display"', 'serif'], // Headlines
        sans: ['Inter', 'sans-serif'],          // Data/Body
      },
    },
  },
  plugins: [],
}
