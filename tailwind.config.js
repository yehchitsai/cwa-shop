const typography = require('@tailwindcss/typography')
const aspectRatio = require('@tailwindcss/aspect-ratio')
const contentVisibility = require('tailwindcss-content-visibility')
const daisyui = require('daisyui')

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  corePlugins: {
    aspectRatio: false
  },
  theme: {
    extend: {
      height: {
        'screen-fill': '-webkit-fill-available'
      }
    }
  },
  plugins: [
    typography,
    aspectRatio,
    contentVisibility,
    daisyui
  ],
  daisyui: {
    styled: true,
    themes: ['light'],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: ''
  }
}
