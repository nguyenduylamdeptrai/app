/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        airbnb: '#FF5A5F', // Thêm màu đỏ san hô đặc trưng của Airbnb
      }
    },
  },
  plugins: [],
}