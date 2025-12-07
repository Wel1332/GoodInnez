/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F2F0E4',
        gold: '#CCA43B',
        black: '#1a1a1a',
        grey: '#666666',
      }
    },
  },
  plugins: [],
}