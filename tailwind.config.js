/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: ['class', '[data-mode="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      keyframes: {
        animate_height: {
          '0%': {
            'height': "1px"
          },
          '100%': {
            'height': "20px"
          }
        },
        enter_opacity: {
          '0%': {
            "opacity": "0"
          },
          "100%": {
            "opacity": '100'
          }
        },
        enter: {
          '0%': {
            'transform': 'translateY(1rem)' ,
            'opacity': '0'
          },
          '100%': {
            'transform': 'translateY(0px)',
            'opacity': '100'
          }
        }
      },
    animation: {
      "height-grow-and-shrink-1": "animate_height 1.5s linear infinite alternate",
      "height-grow-and-shrink-2": "animate_height 1.2s linear infinite alternate",
      "height-grow-and-shrink-3": "animate_height 0.5s linear infinite alternate",
      "height-grow-and-shrink-4": "animate_height 1.7s linear infinite alternate",
      "height-grow-and-shrink-5": "animate_height 1s linear infinite alternate",
      "enter-div": "enter 0.5s linear",
      "enter-opacity": "enter_opacity 2s ease-out"
    }
    },
  },
  plugins: [],
}
