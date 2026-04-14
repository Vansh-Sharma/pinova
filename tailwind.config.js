/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0F172A",
          card: "#1E293B",
          accent: "#6366F1",
        },
      },
      borderRadius: {
        brand: "20px",
      },
      boxShadow: {
        soft: "0 16px 30px -20px rgba(15, 23, 42, 0.85)",
        glow: "0 0 0 1px rgba(99, 102, 241, 0.45), 0 0 24px rgba(99, 102, 241, 0.26)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.92" },
          "50%": { transform: "scale(1.06)", opacity: "1" },
        },
        "float-soft": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.1s ease-in-out infinite",
        "float-soft": "float-soft 2.6s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
