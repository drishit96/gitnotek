module.exports = {
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  },
  theme: {
    backgroundPosition: {
      zero: "0px 0px !important",
    },
    extend: {
      animation: {
        fadeIn: "fadein 0.4s forwards",
        fadeInDelay50ms: "fadein 0.4s .15s forwards",
        fadeInLeft: "fadein-left 0.4s forwards",
        fadeInOut: "fadein 0.3s, fadeout 0.3s 2.5s",
        type: `typing 1.5s steps(10, end), 
        blink-caret .75s step-end infinite`,
      },
      backgroundImage: {
        circle: "radial-gradient(circle closest-side,currentColor 90%,#0000)",
      },
      backgroundPosition: {},
      gridTemplateColumns: {
        "auto-fill": "repeat(auto-fill, minmax(200px, 1fr))",
      },
      colors: {
        primaryColor: "var(--primary-color)",
        focusedPrimaryColor: "var(--focused-primary-color)",
        textColorPrimary: "var(--text-color-primary)",
        textColorSecondary: "var(--text-color-secondary)",
        bgColor: "var(--bg-color)",
        bgColorEl1: "var(--bg-color-el-1)",
        focusColor: "var(--focus-color)",
        cursorColor: "var(--cursor-color)",
      },
      keyframes: {
        fadein: {
          "0%": { transform: "translateY(30px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        fadeout: {
          "0%": { transform: "translateY(0)", opacity: 1 },
          "100%": { transform: "translateY(30px)", opacity: 0 },
        },
        "fadein-left": {
          "0%": { transform: "translateX(-30px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        typing: {
          "0%": { width: 0 },
          "50%": { width: "100%" },
        },
        "blink-caret": {
          "0%,100%": { "border-color": "transparent" },
          "50%": { "border-color": "var(--primary-color)" },
        },
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
