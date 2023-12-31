/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mainColor: "#ec4c56",
        subColor: "#596172",
        subColorAlt: "#9da5b9",
        subColorDark: "#1c222d",
        bgColor: "#242933",
        textCorrect: "#f6f0e9",
      },
    },
  },
  plugins: [],
};