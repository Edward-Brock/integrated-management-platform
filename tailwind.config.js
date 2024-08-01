/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Avenir', 'Bahnschrift', 'Tahoma', 'Helvetica Neue', 'Segoe UI', 'Arial', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'WenQuanYi Micro Hei', 'sans-serif', 'Apple Logo', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}
