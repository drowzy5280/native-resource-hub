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
        // Modern lighter earth-tone palette
        clay: {
          DEFAULT: '#D4816A', // Lighter terracotta
          light: '#E6A491',
          dark: '#B8654F',
        },
        desert: {
          DEFAULT: '#E8CDA7', // Soft sand
          light: '#F2DFC2',
          dark: '#D4B887',
        },
        pine: {
          DEFAULT: '#7A9B7E', // Soft sage green
          light: '#9BB49E',
          dark: '#5F7D63',
        },
        stone: { // Replacing midnight with warm stone gray
          DEFAULT: '#6B6B6B', // Warm medium gray
          light: '#8A8A8A',
          dark: '#4A4A4A',
        },
        gold: {
          DEFAULT: '#E8B86D', // Softer gold
          light: '#F0CB8E',
          dark: '#D1A050',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F5F1EA',
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
        'soft': '0 2px 8px rgba(107, 107, 107, 0.06)',
        'soft-lg': '0 4px 16px rgba(107, 107, 107, 0.08)',
      },
    },
  },
  plugins: [],
}
export default config
