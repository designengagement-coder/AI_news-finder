import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101820",
        mist: "#EEF2EB",
        saffron: "#E5A823",
        coral: "#E56B6F",
        spruce: "#1E3D37",
        slate: "#5B6870"
      },
      boxShadow: {
        panel: "0 20px 45px -30px rgba(16, 24, 32, 0.35)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at top left, rgba(229,168,35,0.14), transparent 30%), radial-gradient(circle at top right, rgba(30,61,55,0.12), transparent 28%), linear-gradient(180deg, rgba(238,242,235,0.98), rgba(248,249,246,0.9))"
      }
    }
  },
  plugins: []
};

export default config;
