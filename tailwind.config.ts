import type { Config } from "tailwindcss";

const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
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
      colors: {
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-1": {
          "0%, 100%": { opacity: "0" },
          "5%, 80%": { opacity: "1" },
          "85%": { opacity: "0" },
        },
        "fade-in-2": {
          "0%, 15%, 100%": { opacity: "0" },
          "20%, 80%": { opacity: "1" },
          "85%": { opacity: "0" },
        },
        "fade-in-3": {
          "0%, 30%, 100%": { opacity: "0" },
          "35%, 80%": { opacity: "1" },
          "85%": { opacity: "0" },
        },
        float: {
          "0%": {
            transform: "translate(0, 0) scale(1)",
          },
          "33%": {
            transform: "translate(10px, -30px) scale(1.05)",
          },
          "66%": {
            transform: "translate(-10px, -15px) scale(1.02)",
          },
          "100%": {
            transform: "translate(0, 0) scale(1)",
          },
        },
        "float-slow": {
          "0%": {
            transform: "translate(0, 0) rotate(0deg)",
          },
          "33%": {
            transform: "translate(-15px, -25px) rotate(5deg)",
          },
          "66%": {
            transform: "translate(15px, -15px) rotate(-3deg)",
          },
          "100%": {
            transform: "translate(0, 0) rotate(0deg)",
          },
        },
        "float-slower": {
          "0%": {
            transform: "translate(0, 0) rotate(0deg)",
          },
          "50%": {
            transform: "translate(15px, -25px) rotate(-5deg)",
          },
          "100%": {
            transform: "translate(0, 0) rotate(0deg)",
          },
        },
        twinkle: {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.3",
            transform: "scale(0.7)",
          },
        },
        "nebula-pulse": {
          "0%, 100%": {
            opacity: "0.5",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.1)",
          },
        },
        "nebula-drift": {
          "0%": {
            transform: "translate(0, 0) rotate(0deg)",
          },
          "33%": {
            transform: "translate(-40px, 40px) rotate(2deg)",
          },
          "66%": {
            transform: "translate(40px, -40px) rotate(-2deg)",
          },
          "100%": {
            transform: "translate(0, 0) rotate(0deg)",
          },
        },
        bounce: {
          "0%, 100%": {
            transform: "translateY(0) translateX(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "25%": {
            transform: "translateY(-15px) translateX(10px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
          "75%": {
            transform: "translateY(-5px) translateX(-10px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        "bounce-delayed": {
          "0%, 30%, 100%": {
            transform: "translateY(0) translateX(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "55%": {
            transform: "translateY(-12px) translateX(8px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
          "85%": {
            transform: "translateY(-4px) translateX(-8px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        "bounce-more-delayed": {
          "0%, 60%, 100%": {
            transform: "translateY(0) translateX(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "85%": {
            transform: "translateY(-10px) translateX(6px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        "scroll-bounce": {
          "0%, 100%": {
            transform: "translateY(0)",
            opacity: "0.8",
          },
          "50%": {
            transform: "translateY(6px)",
            opacity: "0.5",
          },
        },
        "mouse-wheel": {
          "0%, 100%": {
            opacity: "0",
            transform: "translateY(0)",
          },
          "50%": {
            opacity: "1",
            transform: "translateY(8px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-1": "fade-in-1 6s ease-in-out infinite",
        "fade-in-2": "fade-in-2 6s ease-in-out infinite",
        "fade-in-3": "fade-in-3 6s ease-in-out infinite",
        float: "float 8s ease-in-out infinite",
        "float-slow": "float-slow 12s ease-in-out infinite",
        "float-slower": "float-slower 16s ease-in-out infinite",
        twinkle: "twinkle 6s ease-in-out infinite",
        "nebula-pulse": "nebula-pulse 8s ease-in-out infinite",
        "nebula-drift": "nebula-drift 8s ease-in-out infinite",
        bounce: "bounce 4s ease-in-out infinite",
        "bounce-delayed": "bounce-delayed 4s ease-in-out infinite",
        "bounce-more-delayed": "bounce-more-delayed 4s ease-in-out infinite",
        "scroll-bounce": "scroll-bounce 2s ease-in-out infinite",
        "mouse-wheel": "mouse-wheel 1.5s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
