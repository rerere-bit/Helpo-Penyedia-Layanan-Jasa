/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', 
        primarydark: '#2563EB', 
        secondary: '#1E293B', 
        accent: '#F59E0B', 
        footer: '#0F172A', 
        light: '#F8FAFC', 
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], 
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1200px', 
        },
      },
    },
  },
  plugins: [],
}