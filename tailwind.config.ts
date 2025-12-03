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
        // Light, modern earth-tone palette with excellent contrast
        clay: {
          DEFAULT: '#C67B5C', // Warm terracotta
          light: '#E8B4A0',
          dark: '#A05739',
        },
        desert: {
          DEFAULT: '#F4E4D1', // Soft cream/sand
          light: '#FDFBF7',
          dark: '#E8D1B5',
        },
        pine: {
          DEFAULT: '#6B9270', // Soft sage green
          light: '#A5C4A8',
          dark: '#4A6F4F',
        },
        stone: {
          DEFAULT: '#5A5550', // Deep warm gray for text
          light: '#8A837C',
          dark: '#3D3933',
        },
        gold: {
          DEFAULT: '#D9A566', // Warm gold
          light: '#F0D4A6',
          dark: '#B88642',
        },
        cream: {
          DEFAULT: '#FFFDF9', // Very light warm white
          dark: '#F9F5F0',
        },
        // Additional colors for better contrast
        text: {
          DEFAULT: '#3D3933', // Dark warm brown for main text
          secondary: '#5A5550', // Medium warm gray for secondary text
          muted: '#8A837C', // Light warm gray for muted text
        },
      },
      fontFamily: {
        heading: ['Work Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'earth': '12px',
        'earth-lg': '20px',
        'earth-xl': '28px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(90, 85, 80, 0.08)',
        'soft-lg': '0 4px 16px rgba(90, 85, 80, 0.12)',
        'card': '0 1px 3px rgba(90, 85, 80, 0.1)',
      },
    },
  },
  plugins: [],
}
export default config
