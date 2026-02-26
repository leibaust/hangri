/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"IBM Plex Mono"', '"Courier New"', 'monospace'],
      },
      colors: {
        parchment: '#F5F0E8',
        surface: '#EDE8DE',
        ink: '#1A1714',
        muted: '#8C8278',
        rule: '#C8C0B4',
        olive: '#4A5240',
        sienna: '#8B3A2A',
        amber: '#C17F3E',
      },
      borderRadius: {
        DEFAULT: '0',
        none: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '0',
      },
      fontSize: {
        display: ['72px', { lineHeight: '1', letterSpacing: '0.05em' }],
        h1: ['40px', { lineHeight: '1.1', letterSpacing: '0.04em' }],
        h2: ['28px', { lineHeight: '1.15', letterSpacing: '0.04em' }],
        h3: ['20px', { lineHeight: '1.2', letterSpacing: '0.03em' }],
        body: ['15px', { lineHeight: '1.5' }],
        label: ['12px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
        micro: ['10px', { lineHeight: '1.4', letterSpacing: '0.01em' }],
      },
      spacing: {
        'grid': '8px',
      },
    },
  },
  plugins: [],
}
