/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        mint: {
          DEFAULT: '#C0FDFB'
        }
      }
    },
  },
  plugins: [],
};


