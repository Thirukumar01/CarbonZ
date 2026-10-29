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
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        forest: {
          50: "#edfcf2",
          100: "#d6f7e1",
          200: "#afedc7",
          300: "#7bdea6",
          400: "#44c680",
          500: "#23ab63",
          600: "#168a4d",
          700: "#146e3f",
          800: "#145734",
          900: "#12482c",
          950: "#052717",
        },
        navy: {
          50: "#f2f5fa",
          100: "#e1e9f4",
          200: "#c7d6eb",
          300: "#9fb9dc",
          400: "#7197cb",
          500: "#507aba",
          600: "#3d61a2",
          700: "#324e84",
          800: "#2d436d",
          900: "#0b1528",
          950: "#060b17",
        },
        accent: {
          cyan: "#0ea5e9",
          cyanLight: "#e0f2fe",
          cyanDark: "#0284c7",
        },
      },
    },
  },
  plugins: [],
};

export default config;

