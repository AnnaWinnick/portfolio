/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-accentYellow',
    'bg-accentBlue',
    'bg-accentOffWhite',
    'bg-accentPink',
    'bg-accentOrange',
    'bg-accentOlive',
  ],
  theme: {
    extend: {
      colors: {
        accentYellow: '#FFF855',
        accentBlue: '#92DAFF',
        accentOffWhite: '#ECEBE0',
        accentPink: '#F9BCCB',
        accentOrange: '#FF562C',
        accentOlive: '#B7B12A',
      },
      fontFamily: {
        heading: ['DM Serif Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        section: '1rem', // rounded-xl
        button: '1rem',
      },
    },
  },
  plugins: [],
}
