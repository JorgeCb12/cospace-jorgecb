import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#F8F9FA",
        ink: "#18181B",
        olive: {
          50: "#F4F5EE",
          100: "#E8EADF",
          500: "#697153",
          600: "#555D42",
          700: "#454B35",
        },
        terracotta: {
          50: "#FBF4F0",
          500: "#A56A56",
          600: "#8F5948",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Geist", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.04em",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        float: "0 12px 40px rgba(24, 24, 27, 0.08)",
      },
    },
  },
};

export default config;
