const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./_includes/**/*.html', './_layouts/**/*.html', './_pages/**/*.html'],
  theme: {
    extend: {
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
