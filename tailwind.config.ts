import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        suzarchi: {
          sidebar: "#113524",
          sidebarHover: "#18442f",
          sidebarActive: "#1b4d35",
          primary: "#14482F",
          teal: "#1E8A7A",
          tealLight: "#E6F4F1",
          tealHover: "#177265",
          accent: "#22C55E",
          bg: "#F2F5F3",
          card: "#FFFFFF",
          border: "#E2E8E4",
          textDark: "#18241D",
          textMuted: "#6B7D73",
        },
      },
    },
  },
  plugins: [],
};
export default config;
