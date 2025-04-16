/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF0000', // Mudando para vermelho
        secondary: '#FF3333', // Vermelho mais claro para hover
        summer: '#FFD700', // Cor amarela para "VERÃO"
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}