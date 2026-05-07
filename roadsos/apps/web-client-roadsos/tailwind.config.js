/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      colors: {
        background: "#0A0D14",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        emergency: {
          red: "#EF4444",
          blue: "#3B82F6",
          dark: "#0A0D14",
          card: "#1C1C1E",
          border: "rgba(255, 255, 255, 0.1)",
        },
        muted: {
          DEFAULT: "#8E8E93",
          foreground: "#8E8E93",
        },
      },
      backgroundImage: {
        'emergency-gradient': 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        'dark-gradient': 'linear-gradient(180deg, rgba(10, 13, 20, 0) 0%, #0A0D14 100%)',
      },
      boxShadow: {
        'neon-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'neon-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'sos-btn': '0 10px 40px rgba(239, 68, 68, 0.6)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'dash': {
          'to': { strokeDashoffset: '-20' }
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'dash': 'dash 1s linear infinite',
      }
    },
  },
  plugins: [],
}
