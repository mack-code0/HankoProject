/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black100: "#111111",
        black200: "#1D1D1D",
        textGrey100: "#A5A5A5",
        green100: "#35ca4a",
        blue100: "#0078d3"
      },
      fontFamily: {
        inter: ["inter"],
        figtree: ["figtree"]
      }
    },
  },
  plugins: [],
}

