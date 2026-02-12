import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aurora (outer frame gradient)
        aurora: { start: "#F7A99F", mid: "#D8A7E3", end: "#9DD3F8" },
        // Lavender Chrome (shell, nav, pipeline)
        chrome: "#B9ACC8",
        "chrome-active": "#7C6A93",
        "chrome-icon": "#6E627C",
        "chrome-border": "#E9E6EE",
        // Deep Forest (report content only)
        forest: "#1B3022",
        sage: "#D4E09B",
        accent: "#F2542D",   // CTAs only
        parchment: "#F9F9F7",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
        shell: "1400px",
      },
      borderRadius: {
        "2xl": "1rem",
        "shell": "28px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      transitionDuration: {
        150: "150ms",
      },
      backgroundImage: {
        aurora: "linear-gradient(90deg, #F7A99F 0%, #D8A7E3 50%, #9DD3F8 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
