// @ts-check

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          light: '#DBEAFE',
          dark: '#1D4ED8',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          dark: '#1E293B',
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#0F172A',
        },
        success: {
          DEFAULT: '#16A34A',
          light: '#F0FDF4',
        },
        error: {
          DEFAULT: '#DC2626',
          light: '#FEF2F2',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FFFBEB',
        },
      },
      fontFamily: {
        'inter-regular': ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
      },
      borderRadius: {
        '4xl': '32px',
      },
      spacing: {
        '18': '72px',
        '88': '352px',
      },
    },
  },
  plugins: [],
};
