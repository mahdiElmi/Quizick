/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {

        shine: {
          "0%": {
            transform: 'scaleX(0)',
            transformOrigin:"left"
          },
          "20%": {
            transform: 'scaleX(0.4)',
          },
          "60%": {
            transformOrigin: "right"
          },
          "100%": {
            transform: "scaleX(0)",
            transformOrigin: "right"
          }
        }
      },
      animation: {
        "shine": "shine 500ms ease-in-out 1"
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  
  plugins: [require("@tailwindcss/forms")],
};
