/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        playwrite: ['"Playwrite MX Guides"', 'cursive'],
        zen: ['"Zen Dots"', 'sans-serif'],
        geostar: ['"Geostar Fill"', 'sans-serif'],
        silkscreen: ['"Silkscreen"', 'sans-serif']
      },
      animation: {
        gradient: "gradientMove 5s ease infinite",
        gridMove: "gridMove 20s linear infinite",
      },
      keyframes: {
        gradientMove: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        gridMove: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(40px, 40px)" },
        },
      },
      backgroundImage: {
        'grid': `
          linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid': '100px 100px',
      },
    },
  },
  plugins: [],
}