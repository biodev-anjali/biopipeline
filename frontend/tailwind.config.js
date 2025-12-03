/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0B132B",
        neon: "#22D3EE",
        bioGreen: "#10B981",
      },
    },
  },
  plugins: [],
};

