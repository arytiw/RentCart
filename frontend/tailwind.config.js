/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: "#1E88E5",
        accent: "#42A5F5",
        background: "#F5F7FA",
        text: "#212121",
        secondary: "#757575",
      },
    },
  },
  plugins: [],
};
