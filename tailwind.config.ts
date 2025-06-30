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
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["Fredoka One", "cursive"],
        sans: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Festival vibrant color palette
        festival: {
          orange: "hsl(var(--festival-orange))",
          pink: "hsl(var(--festival-pink))",
          yellow: "hsl(var(--festival-yellow))",
          cream: "hsl(var(--festival-cream))",
          beige: "hsl(var(--festival-beige))",
          coral: "hsl(var(--festival-coral))",
          magenta: "hsl(var(--festival-magenta))",
          amber: "hsl(var(--festival-amber))",
          black: "hsl(var(--festival-black))",
        },
        // Keep retro for backward compatibility
        retro: {
          purple: "hsl(var(--festival-pink))",
          teal: "hsl(var(--festival-orange))",
          peach: "hsl(var(--festival-coral))",
          cream: "hsl(var(--festival-cream))",
          lavender: "hsl(var(--festival-beige))",
          orange: "hsl(var(--festival-orange))",
          mint: "hsl(var(--festival-yellow))",
          pink: "hsl(var(--festival-pink))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        '4xl': '0 45px 80px -15px rgba(0, 0, 0, 0.3)',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "bounce-in": {
          "0%": {
            transform: "scale(0.3) rotate(-10deg)",
            opacity: "0",
          },
          "50%": {
            transform: "scale(1.05) rotate(5deg)",
          },
          "70%": {
            transform: "scale(0.9) rotate(-2deg)",
          },
          "100%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "1",
          },
        },
        "wiggle": {
          "0%, 7%": {
            transform: "rotateZ(0)",
          },
          "15%": {
            transform: "rotateZ(-15deg)",
          },
          "20%": {
            transform: "rotateZ(10deg)",
          },
          "25%": {
            transform: "rotateZ(-10deg)",
          },
          "30%": {
            transform: "rotateZ(6deg)",
          },
          "35%": {
            transform: "rotateZ(-4deg)",
          },
          "40%, 100%": {
            transform: "rotateZ(0)",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px) rotate(0deg)",
          },
          "33%": {
            transform: "translateY(-15px) rotate(2deg)",
          },
          "66%": {
            transform: "translateY(-8px) rotate(-2deg)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 30px rgba(255, 107, 53, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 50px rgba(255, 107, 53, 0.7), 0 0 80px rgba(255, 107, 53, 0.5)",
          },
        },
        "rainbow-border": {
          "0%": {
            borderColor: "hsl(var(--retro-purple))",
          },
          "25%": {
            borderColor: "hsl(var(--retro-teal))",
          },
          "50%": {
            borderColor: "hsl(var(--retro-orange))",
          },
          "75%": {
            borderColor: "hsl(var(--retro-peach))",
          },
          "100%": {
            borderColor: "hsl(var(--retro-purple))",
          },
        },
        "gradient-shift": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bounce-in": "bounce-in 0.8s ease-out",
        "wiggle": "wiggle 1.2s ease-in-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "rainbow-border": "rainbow-border 3s linear infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;