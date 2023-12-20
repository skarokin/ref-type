/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.yellow,
        mainColor: "#ec4c56",
        subColor: "#596172",
        subColorAlt: "#9da5b9",
        bgColor: "#242933",
        textCorrect: "#f6f0e9",
      },
    },
  },
  plugins: [],
};