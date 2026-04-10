import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#20150D",
        surface: "rgba(255,250,235,0.78)",
        "bg-alt": "#EFE0B2",
        slate: "#5F4D37",
        muted: "#7C684D",
        border: "rgba(94,72,35,0.14)",
        "border-strong": "rgba(94,72,35,0.24)",
        accent: "#8C5A12",
        "accent-hover": "#72480C",
        "accent-light": "#EAD4A1",
        "accent-dark": "#5F3B09",
        breaking: "#DC2626",
        success: "#16A34A",
        warning: "#D97706"
      },
      boxShadow: {
        panel: "0 1px 2px rgba(63,43,15,0.08), 0 10px 24px rgba(63,43,15,0.05)",
        hover: "0 10px 24px rgba(63,43,15,0.12)"
      }
    }
  },
  plugins: []
};

export default config;
