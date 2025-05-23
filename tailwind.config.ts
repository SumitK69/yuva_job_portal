
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        // Custom Yuva Load Service colors
        indigo_dye: {
          DEFAULT: '#2F4866',
          100: '#090e14',
          200: '#131c29',
          300: '#1c2b3d',
          400: '#253951',
          500: '#2f4866',
          600: '#456a97',
          700: '#6a8ebb',
          800: '#9cb4d1',
          900: '#cdd9e8'
        },
        gamboge: { 
          DEFAULT: '#E79A1E', 
          100: '#2f1f05', 
          200: '#5d3e09', 
          300: '#8c5d0e', 
          400: '#ba7c12', 
          500: '#e79a1e', 
          600: '#ecac45', 
          700: '#f1be6c', 
          800: '#f5d194', 
          900: '#faebd2' 
        },
        harvest_gold: { 
          DEFAULT: '#CC963B',
          100: '#291e0c', 
          200: '#523c17', 
          300: '#7c5a23', 
          400: '#a5782e', 
          500: '#cc963b', 
          600: '#d6ab5e', 
          700: '#debf82', 
          800: '#e9d5a5', 
          900: '#f4eada' 
        },
        gunmetal: { 
          DEFAULT: '#31363F',
          100: '#0a0b0d', 
          200: '#14161a', 
          300: '#1e2126', 
          400: '#282c33', 
          500: '#31363f', 
          600: '#545c6b', 
          700: '#768197', 
          800: '#a3acbc', 
          900: '#d1d5de' 
        },
        isabelline: { 
          DEFAULT: '#F5F2ED',
          100: '#322f27', 
          200: '#635e4e', 
          300: '#958e76', 
          400: '#bcb7a5', 
          500: '#dedad0', 
          600: '#e8e3db', 
          700: '#f0ece6', 
          800: '#f5f2ed', 
          900: '#faf8f6' 
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
