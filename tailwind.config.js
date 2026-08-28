/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Anybody", "DM Sans", "sans-serif"],
        mono: ["Space Mono", "monospace"],
        "space-mono": ["Space Mono", "monospace"],
        anybody: ["Anybody", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "2px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          raised: "var(--surface-raised)",
          hover: "var(--surface-hover)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Greptile Signature Colors
        greptile: {
          green: "#28e99f",
          dark: "#0c0c11",
          slate: "#3d3b4f",
          border: "#5553684d",
          fog: "#eeeeee",
          silver: "#d6d6d6",
        },
        neon: "#daff01",
        lime: "#ecffa3",
        seafoam: "#c5ffd6",
        lavender: "#ffcffe",
        magenta: "#ffacfe",
        coral: "#ff7f59",
        bloom: "#ff6d6d",
        sky: "#71adff",
        blue: "#5882ff",
        violet: "#756cf5",
        slate: {
          DEFAULT: "#3d3b4f",
          50: "#f6f6f8",
          100: "#ececf0",
          200: "#d6d5de",
          300: "#b5b3c3",
          400: "#8e8ba4",
          500: "#706d8a",
          600: "#585671",
          700: "#48465d",
          800: "#3d3b4f",
          900: "#22212d",
          950: "#13121b",
        },
        fog: "#eeeeee",
        silver: "#d6d6d6",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
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
        "pulse-glow": {
          "0%, 100%": {
            filter: "drop-shadow(0 0 8px rgba(40,233,159,0.6)) drop-shadow(0 0 20px rgba(40,233,159,0.2))",
          },
          "50%": {
            filter: "drop-shadow(0 0 14px rgba(40,233,159,0.9)) drop-shadow(0 0 30px rgba(40,233,159,0.4))",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 3s infinite ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
