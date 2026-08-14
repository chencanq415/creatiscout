import tailwindcssAnimate from "tailwindcss-animate";
import type { Config } from "tailwindcss";

// Tokens are authoritative from /Users/GZTD-03-01198/Documents/07_dev/brainstorm/CreatiScout/design.md §11
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "Helvetica Neue",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        // Backgrounds
        page: "#FAFBFC", // Canvas
        surface: "#FFFFFF", // Surface (cards / panels)
        "surface-warm": "#F7F8FA", // Soft Surface (table headers, sub-sections)

        // Brand Pink — primary CTA, active state, approval
        brand: "#F82F72",
        "brand-hover": "#E91F64",
        "soft-pink": "#FFF0F5",

        // Text
        ink: "#101828",
        navy: "#172033",
        slate: "#667085",
        muted: "#98A2B3",

        // Borders
        border: "#E6E9EF",
        "border-strong": "#D9DEE8",
        "border-row": "#EDF0F5",

        // Signals
        teal: "#5CC5BE",
        "soft-teal": "#D8F4EF",
        "teal-text": "#0F8B6F",
        blue: "#3B82F6",
        "soft-blue": "#EEF5FF",
        "blue-text": "#1E63D2",
        amber: "#F59E0B",
        "soft-amber": "#FFF3E4",
        "amber-text": "#A66505",
        lavender: "#8B5CF6",
        "soft-lavender": "#F3ECFF",
        "lavender-text": "#5B30C2",

        // Legacy aliases (kept to avoid mass rewrites — point to new scheme)
        "brand-strong": "#F82F72",
        "brand-soft": "#FF6DA0",
        olive: "#5CC5BE",
        "soft-olive": "#D8F4EF",
        "olive-text": "#0F8B6F",
        "emerald-soft": "#D8F4EF", // Live/On shift uses teal
        "emerald-text": "#0F8B6F",

        // Heatmap (employee work) — use teal scale
        "heat-0": "#F2F4F7",
        "heat-1": "#D8F4EF",
        "heat-2": "#A8E0DA",
        "heat-3": "#7FCEC6",
        "heat-4": "#5CC5BE",
      },
      borderRadius: {
        // B2B radius taxonomy:
        // 8px  → inputs, buttons, small controls, chips
        // 10px → cards (KPI / list row / content card), tables
        // 12px → main panels, drawers, hero sections, large containers
        control: "8px",
        card: "10px",
        panel: "12px",
        md: "8px",
        lg: "8px",
        xl: "10px",
        "2xl": "12px",
        "3xl": "12px",
      },
      boxShadow: {
        panel: "0 8px 24px rgba(16, 24, 40, 0.04)",
        floating: "0 24px 80px rgba(16, 24, 40, 0.16)",
        cta: "0 1px 2px rgba(248, 47, 114, 0.20)",
        card: "0 1px 2px rgba(16, 24, 40, 0.04)",
        elev: "0 4px 12px rgba(16, 24, 40, 0.05)",
        float: "0 12px 32px rgba(16, 24, 40, 0.08)",
        soft: "0 1px 2px rgba(16, 24, 40, 0.04)",
        drawer: "-16px 0 40px rgba(16, 24, 40, 0.10)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
