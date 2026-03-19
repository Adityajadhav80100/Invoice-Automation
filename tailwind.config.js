/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f7f8fa",
        line: "#d9dee7",
        ink: "#0f172a",
        muted: "#5b6473",
        accent: "#0f766e",
        success: "#15803d",
        danger: "#b91c1c",
      },
      boxShadow: {
        panel: "0 18px 60px -28px rgba(15, 23, 42, 0.24)",
      },
    },
  },
  plugins: [],
};
