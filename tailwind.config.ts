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
        // Cultural earth-tone palette
        clay: {
          DEFAULT: '#A6452E',
          light: '#C45F47',
          dark: '#7A2E1E',
        },
        desert: {
          DEFAULT: '#DDBA8E',
          light: '#E8CDA7',
          dark: '#C9A36D',
        },
        pine: {
          DEFAULT: '#2E4F33',
          light: '#3D6743',
          dark: '#1F3422',
        },
        midnight: {
          DEFAULT: '#1E2A44',
          light: '#2D3F5F',
          dark: '#141D2E',
        },
        gold: {
          DEFAULT: '#F3C65D',
          light: '#F6D482',
          dark: '#D9A937',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F0EBE3',
        },
      },
      fontFamily: {
        heading: ['Work Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'earth': '16px',
        'earth-lg': '24px',
        'earth-xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(30, 42, 68, 0.08)',
        'soft-lg': '0 8px 24px rgba(30, 42, 68, 0.12)',
      },
    },
  },
  plugins: [],
}
export default config
