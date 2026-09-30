import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F7F9",
        ink: "#16202A",
        muted: "#5B6673",
        line: "#E2E6EB",
        accent: { DEFAULT: "#0E5A4A", soft: "#E4F0EC", ink: "#0A4237" },
      },
      fontFamily: {
        sans: ['ui-sans-serif', '"Segoe UI"', "system-ui", "-apple-system", "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
