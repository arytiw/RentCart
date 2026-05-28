/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern brand palette - preserves RentCart identity
        brand: {
          DEFAULT: '#FF6A00',
          50: '#FFF4EC',
          100: '#FFE6D3',
          200: '#FFC79E',
          300: '#FFA666',
          400: '#FF8533',
          500: '#FF6A00',
          600: '#E55A00',
          700: '#B84800',
          800: '#8A3600',
          900: '#5C2400',
        },
        cream: {
          DEFAULT: '#FDFBF7',
          50: '#FFFEFB',
          100: '#FDFBF7',
          200: '#F7F3EA',
          300: '#EFE8D8',
        },
        ink: {
          DEFAULT: '#0B0B0F',
          50: '#F7F7F8',
          100: '#EDEDEF',
          200: '#D5D5DA',
          300: '#A8A8B2',
          400: '#7C7C88',
          500: '#54545E',
          600: '#3A3A42',
          700: '#26262C',
          800: '#16161B',
          900: '#0B0B0F',
        },
        // Backwards-compat alias used throughout the codebase
        alibaba: {
          orange: '#FF6A00',
          'orange-dark': '#E55A00',
          'orange-light': '#FF8533',
          black: '#0B0B0F',
          white: '#FFFFFF',
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          }
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter2: '-0.025em',
      },
      borderRadius: {
        'xl2': '1.25rem',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(11,11,15,0.04), 0 4px 16px -4px rgba(11,11,15,0.06)',
        'softer': '0 1px 2px rgba(11,11,15,0.03), 0 2px 8px -2px rgba(11,11,15,0.04)',
        'card': '0 1px 2px rgba(11,11,15,0.04), 0 8px 24px -8px rgba(11,11,15,0.08)',
        'lift': '0 4px 8px -2px rgba(11,11,15,0.06), 0 16px 32px -8px rgba(11,11,15,0.12)',
        'glow': '0 8px 24px -8px rgba(255,106,0,0.45)',
        'ring-brand': '0 0 0 4px rgba(255,106,0,0.18)',
      },
      backgroundImage: {
        'grid-cream':
          'linear-gradient(to right, rgba(11,11,15,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,11,15,0.045) 1px, transparent 1px)',
        'dot-cream':
          'radial-gradient(circle at 1px 1px, rgba(11,11,15,0.08) 1px, transparent 0)',
        'radial-brand':
          'radial-gradient(60% 60% at 50% 0%, rgba(255,106,0,0.10) 0%, rgba(255,106,0,0) 70%)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 350ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 250ms ease-out both',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-soft': 'pulse-soft 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
