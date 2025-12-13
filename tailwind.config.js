export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#fe7f2d",
        accent: "#233d4d",
        container: {
          center: true,
          padding: "1rem",
        }
      },
    },
  },
  plugins: [],
}
