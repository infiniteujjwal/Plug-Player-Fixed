import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./contexts/**/*.{js,ts,jsx,tsx,mdx}",
    "./portals/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          '50': '#fffde7',
          '100': '#fffac0',
          '200': '#fff176',
          '300': '#ffe54c',
          '400': '#ffda22',
          '500': '#FFCC01', // Base Yellow
          '600': '#e6b800',
          '700': '#b48f00',
          '800': '#8c7000',
          '900': '#6b5500',
          '950': '#453800',
        },
      }
    },
  },
  plugins: [],
};
export default config;
