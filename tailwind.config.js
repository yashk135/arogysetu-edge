/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          950: '#050505',
          900: '#0D0D0D',
          850: '#141414',
          800: '#1A1A1A',
          750: '#222222',
          700: '#2A2A2A',
          600: '#3F3F46',
        },
        accent: {
          emerald: '#10B981',
          emeraldMuted: 'rgba(16,185,129,0.12)',
          red: '#EF4444',
          amber: '#F59E0B',
          blue: '#3B82F6',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
