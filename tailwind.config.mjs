/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        ink: "#152319",
        sage: "#214734",
        moss: "#4e6b58",
        sand: "#f2efe6",
        fog: "#fbfaf7",
        clay: "#d9d2c4",
        river: "#f1992d",
        ember: "#f08a1b"
      },
      fontFamily: {
        display: ["'Open Sans'", "system-ui", "sans-serif"],
        sans: ["'Open Sans'", "system-ui", "sans-serif"],
        accent: ["'Roboto'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 30px rgba(28, 35, 32, 0.08)",
        lift: "0 18px 40px rgba(28, 35, 32, 0.12)"
      }
    }
  },
  plugins: []
};
