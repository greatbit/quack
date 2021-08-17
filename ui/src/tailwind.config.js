const color = require("color");

module.exports = {
  important: ".tailwind",
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      white: "#FFF",
      primary: {
        DEFAULT: "#2E5BFF",
        hover: color("#2E5BFF").darken(0.05).hex(),
      },
      neutral: {
        DEFAULT: "#2E384D",
        fade1: "#69707F",
        fade2: "#8798AD",
        fade3: "#BFC5D2",
        fade4: "#F4F6FC",
        fade5: "#E0E7FF",
        fade6: "#EEF3F5",
      },
      success: "#33AC2E",
      error: "#D63649",
      warning: "#F7C137",
      teal: "#00C1D4",
      purple: "#8C54FF",
    },
    fontFamily: {
      sans: ["Noto Sans", "sans-serif"],
    },
    fontSize: {
      base: "15px",
      sm: "12px",
      lg: "28px",
      xl: "34px",
      xxl: "48px",
    },

    extend: {
      outline: {
        focus: "3px solid #BFC5D2",
      },
      minHeight: {
        10: "40px",
      },
      spacing: {
        3: "1rem !important",
        5: "1.25rem !important",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
