/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060E23',
          900: '#0A1838',
          800: '#0F2A66',
          700: '#1E3A8A',
          600: '#2563EB',
        },
        bjp: {
          DEFAULT: '#FF9933',
          dark: '#EA580C',
          light: '#FFEDD5',
        },
        inc: {
          DEFAULT: '#1982C4',
          dark: '#0284C7',
          light: '#E0F2FE',
        },
        margin: {
          safe: '#16A34A',
          battleground: '#EAB308',
          weak: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
