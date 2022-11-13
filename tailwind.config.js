const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./_includes/**/*.html', './_layouts/**/*.html', './_pages/**/*.html'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        primary: {
          "50": "#84acff",
          "100": "#7aa2ff",
          "200": "#7098ff",
          "300": "#668eff",
          "400": "#5c84ff",
          "500": "#527afa",
          "600": "#4870f0",
          "700": "#3e66e6",
          "800": "#345cdc",
          "900": "#2a52d2"
        }
      },
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
        playfairDisplay: "'Playfair Display', serif",
        lora: "'Lora', serif",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
