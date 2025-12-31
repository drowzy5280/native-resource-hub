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
      // Consistent spacing scale (based on 4px grid)
      spacing: {
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        '3.5': '14px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        '11': '44px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '18': '72px',
        '20': '80px',
        '24': '96px',
        '28': '112px',
        '32': '128px',
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
        // Focus ring shadow for better visibility
        'focus': '0 0 0 3px rgba(107, 146, 112, 0.4)', // Pine color with opacity
        'focus-error': '0 0 0 3px rgba(160, 87, 57, 0.4)', // Clay/error color
      },
      // Animation for skeleton loading and micro-interactions
      animation: {
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-subtle': 'bounceSubtle 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        skeleton: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
      },
      // Typography scale
      fontSize: {
        // Mobile-optimized base size
        'mobile-base': ['17px', { lineHeight: '1.6' }],
      },
      // Min height for touch targets (44px)
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
}
export default config
