/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#ffffff',
          1: '#fafafa',
          2: '#f5f5f5',
          3: '#ebebeb',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          secondary: '#555555',
          tertiary: '#999999',
          faint: '#cccccc',
        },
        accent: {
          DEFAULT: '#00dc82',
          dark: '#00b86b',
          light: '#e8faf2',
          glow: 'rgba(0, 220, 130, 0.15)',
        },
        rose: '#ff4f81',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'mega': ['clamp(4rem, 12vw, 10rem)', { lineHeight: '0.9', letterSpacing: '-0.05em', fontWeight: '900' }],
        'huge': ['clamp(2.5rem, 7vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.04em', fontWeight: '900' }],
        'big': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.035em', fontWeight: '800' }],
        'display-lg': ['clamp(1.75rem, 4vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(0,0,0,0.04)',
        'medium': '0 4px 30px rgba(0,0,0,0.06)',
        'heavy': '0 8px 40px rgba(0,0,0,0.1)',
        'glow': '0 0 60px rgba(0, 220, 130, 0.2)',
        'glow-sm': '0 0 30px rgba(0, 220, 130, 0.15)',
        'inner-glow': 'inset 0 0 30px rgba(0, 220, 130, 0.05)',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-slow': 'marquee 50s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'slide-up': 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.6s ease-out',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'slide-up': {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(0, 220, 130, 0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(0, 220, 130, 0.05) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(0, 0, 0, 0.02) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
