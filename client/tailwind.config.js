/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}"
    ],
    theme: {
      extend: {
        colors: {
          primary: "#0f172a",
          accent: "#2563eb",
        },
      },
    },
    plugins: [],
  };
  