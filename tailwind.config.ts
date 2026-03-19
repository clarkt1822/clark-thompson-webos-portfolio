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
          950: "#04070b",
          900: "#081019",
          800: "#101b28",
          700: "#162332"
        },
        line: "#213246",
        mist: "#9fb4c9",
        glow: "#58c6ff",
        signal: "#7ef0c3",
        ember: "#f6ae67"
      },
      boxShadow: {
        panel:
          "0 0 0 1px rgba(161, 193, 228, 0.08), 0 14px 50px rgba(3, 9, 17, 0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
        glow: "0 0 0 1px rgba(88,198,255,0.12), 0 0 32px rgba(88,198,255,0.16)"
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(120, 153, 186, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120, 153, 186, 0.06) 1px, transparent 1px)"
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
