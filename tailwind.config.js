/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: "#0B1F17",
        forestLight: "#143528",
        gold: "#C9A227",
        goldSoft: "#E4C874",
        ivory: "#F4EFE2",
        sage: "#8FA396",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        draw: {
          "0%": { strokeDashoffset: "600" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        draw: "draw 2.2s ease-out forwards",
      },
    },
  },
  plugins: [],
}
