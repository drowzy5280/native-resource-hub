import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          brown: '#5A4632',
          tan: '#9E7B52',
          cream: '#E9E4DB',
          sand: '#C3B8A1',
          teal: '#33635C',
          rust: '#A33F2D',
        },
      },
      borderRadius: {
        'earth': '12px',
        'earth-lg': '16px',
      },
    },
  },
  plugins: [],
}
export default config
