/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Important for React components
    "./public/index.html",      // Important for the main HTML file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
