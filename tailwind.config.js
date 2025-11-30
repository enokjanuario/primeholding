/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        prime: {
          gold: '#C9A227',
          'gold-light': '#E5C85C',
          'gold-dark': '#9A7B1C',
        },
        dark: {
          bg: '#1E1E1E',
          card: '#2D2D2D',
          input: '#252525',
          border: '#3B3B3B',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B1B1B1',
          muted: '#7E7E7E',
        }
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
      },
      borderRadius: {
        'card': '8px',
        'input': '4px',
      },
      transitionDuration: {
        'default': '200ms',
      }
    },
  },
  plugins: [],
}
