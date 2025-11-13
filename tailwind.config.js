/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'dark-bg': '#0f172a',
        'dark-bg-secondary': '#1e293b',
        'dark-bg-tertiary': '#334155',
        'dark-text': '#f1f5f9',
        'dark-text-secondary': '#cbd5e1',
        'dark-text-muted': '#94a3b8',
        
        // Light theme colors
        'light-bg': '#f9fafb',
        'light-bg-secondary': '#f3f4f6',
        'light-bg-tertiary': '#e5e7eb',
        'light-text': '#1f2937',
        'light-text-secondary': '#4b5563',
        'light-text-muted': '#6b7280',
      },
      fontSize: {
        'clamp-sm': 'clamp(0.75rem, 1.2vw, 0.85rem)',
        'clamp-base': 'clamp(0.9rem, 1.5vw, 1rem)',
        'clamp-lg': 'clamp(1.1rem, 2vw, 1.5rem)',
        'clamp-xl': 'clamp(1.3rem, 2.5vw, 2rem)',
        'clamp-2xl': 'clamp(1.5rem, 3vw, 2.5rem)',
      },
      spacing: {
        'clamp-xs': 'clamp(0.5rem, 1vw, 1rem)',
        'clamp-sm': 'clamp(0.75rem, 1.5vw, 1.5rem)',
        'clamp-base': 'clamp(1rem, 2vw, 1.5rem)',
        'clamp-lg': 'clamp(1.5rem, 3vw, 2.5rem)',
      },
      boxShadow: {
        'theme-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'theme-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'theme-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
