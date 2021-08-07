module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      text: {
        DEFAULT: "#2E384D",
        fade1: "#69707F",
        fade2: "#8798AD",
        fade3: "#B0BAC9",
      },
      white: "#FFF",
      primary: {
        DEFAULT: "#2E5BFF",
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
