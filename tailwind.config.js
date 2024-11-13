/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        antBgContainer: '#ffffff',
        customRed: '#FF0000',
      },
      fontSize: {
        base: '14px',
      },
    },
  },
  plugins: [],
}