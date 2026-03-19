import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#060907",
          900: "#0b120e",
          800: "#121a16",
          700: "#1a2520"
        },
        line: "#28352e",
        mist: "#b2beb6",
        glow: "#8ea996",
        signal: "#abc0ae",
        ember: "#f6ae67"
      },
      boxShadow: {
        panel:
          "0 0 0 1px rgba(196, 216, 202, 0.08), 0 14px 50px rgba(3, 9, 6, 0.44), inset 0 1px 0 rgba(255,255,255,0.03)",
        glow: "0 0 0 1px rgba(142,169,150,0.12), 0 0 32px rgba(142,169,150,0.12)"
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(155, 177, 163, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(155, 177, 163, 0.05) 1px, transparent 1px)"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"]
      },
      maxWidth: {
        "8xl": "90rem"
      }
    }
  },
  plugins: []
};

export default config;
