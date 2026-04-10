import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1F1A15",
        surface: "rgba(244,239,230,0.42)",
        "bg-alt": "rgba(247,241,231,0.72)",
        slate: "#4F453A",
        muted: "#62564A",
        border: "rgba(74,56,34,0.14)",
        "border-strong": "rgba(74,56,34,0.22)",
        accent: "#805E36",
        "accent-hover": "#684A27",
        "accent-light": "rgba(214,193,155,0.68)",
        "accent-dark": "#563B1B",
        breaking: "#DC2626",
        success: "#16A34A",
        warning: "#D97706"
      },
      boxShadow: {
        panel: "0 1px 2px rgba(54,41,25,0.06), 0 10px 24px rgba(54,41,25,0.04)",
        hover: "0 10px 24px rgba(54,41,25,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
