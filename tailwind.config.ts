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
        // Additional colors for better contrast (WCAG AA compliant)
        text: {
          DEFAULT: '#2D2926', // Darker warm brown for main text (improved)
          secondary: '#4A4540', // Darker medium warm gray (improved)
          muted: '#6B6560', // Darker muted text for better contrast (was #8A837C)
        },
        // Status colors (earth-tone palette)
        status: {
          interested: '#D9A566', // Gold
          researching: '#C67B5C', // Clay
          preparing: '#B88642', // Dark gold
          submitted: '#6B9270', // Pine
          accepted: '#4A6F4F', // Dark pine/success
          rejected: '#A05739', // Dark clay
          withdrawn: '#8A837C', // Stone light
        },
        // Alert colors (maintaining earth-tone aesthetic)
        alert: {
          urgent: '#A33F2D', // Rust/urgent red-brown
          warning: '#D9A566', // Warm gold
          info: '#6B9270', // Pine
          success: '#4A6F4F', // Dark pine
          error: '#A05739', // Dark clay
        },
        // Semantic colors for various states
        success: {
          DEFAULT: '#4A6F4F', // Dark pine
          light: '#A5C4A8',
          dark: '#3A5A3F',
        },
        warning: {
          DEFAULT: '#D9A566', // Warm gold
          light: '#F0D4A6',
          dark: '#B88642',
        },
        error: {
          DEFAULT: '#A05739', // Dark clay
          light: '#C67B5C',
          dark: '#8B4529',
        },
        info: {
          DEFAULT: '#6B9270', // Pine
          light: '#A5C4A8',
          dark: '#4A6F4F',
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
