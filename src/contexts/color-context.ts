"use client";

import { createContext, useContext } from "react";

export const colors = [
  {
    name: "Default",
    key: "default",
    primary: "oklch(0.32 0.03 255)",
    secondary: "oklch(0.98 0.01 255)",
    accent: "oklch(0.65 0.18 255)",
    palette: ["#0f172a", "#334155", "#6366f1"],
  },
  {
    name: "Midnight Ocean", 
    key: "midnight-ocean",
    primary: "oklch(0.45 0.12 240)",
    secondary: "oklch(0.97 0.01 240)",
    accent: "oklch(0.70 0.16 220)",
    palette: ["#1e3a8a", "#2563eb", "#38bdf8"],
  },
  {
    name: "Emerald Glow",
    key: "emerald-glow",
    primary: "oklch(0.50 0.16 160)",
    secondary: "oklch(0.97 0.01 160)",
    accent: "oklch(0.72 0.18 155)",
    palette: ["#065f46", "#10b981", "#34d399"],
  },
  {
    name: "Sunset Coral",
    key: "sunset-coral",
    primary: "oklch(0.58 0.18 25)",
    secondary: "oklch(0.97 0.01 25)",
    accent: "oklch(0.75 0.20 35)",
    palette: ["#ea580c", "#fb7185", "#f97316"],
  },
  {
    name: "Electric Violet",
    key: "electric-violet",
    primary: "oklch(0.52 0.20 300)",
    secondary: "oklch(0.97 0.01 300)",
    accent: "oklch(0.75 0.22 295)",
    palette: ["#6d28d9", "#8b5cf6", "#c084fc"],
  },
  {
    name: "Modern Amber",
    key: "modern-amber",
    primary: "oklch(0.60 0.17 85)",
    secondary: "oklch(0.98 0.01 85)",
    accent: "oklch(0.78 0.18 95)",
    palette: ["#b45309", "#f59e0b", "#fde68a"],
  },
] as const;

export type ColorKey = (typeof colors)[number]["key"];

interface ColorContextType {
  colorName: ColorKey;
  setColorName: (key: ColorKey) => void;
}

export const ColorContext = createContext<ColorContextType>({
  colorName: "default",
  setColorName: () => {},
});

export const useColor = () => useContext(ColorContext);