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
            'transform': 'translateY(1rem)',
            'opacity': '0'
          },
          '100%': {
            'transform': 'translateY(0px)',
            'opacity': '100'
          }
        },
        enter_bottom: {
          '0%': {
            'height': '5%',
          },
          '100%': {
            'height': '100%'
          }
        },
        enter_left: {
          '0%': {
            'width': '15rem'
          },
          '100%': {
            'width': '100%'
          }
        },
        enter_input_underline: {
          '0%': {
            'transform': 'scaleX(0)'
          },
          '100%': {
            'transform': 'scaleX(1)'
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
        "enter-div-1": "enter 0.1s linear",
        "enter-div-2": "enter 0.2s linear",
        "enter-opacity": "enter_opacity 2s ease-out",
        "enter-bottom": "enter_bottom .3s linear alternate",
        "enter-bottom-reverse": "enter_bottom 2s reverse",
        "enter-left": "enter_left .3s ease-in-out alternate",
        "enter-left-1": "enter_left .1s ease-in-out alternate",
        "enter-input": "enter_input_underline 0.25s ease-in-out",
      }
    },
  },
  plugins: [],
}
