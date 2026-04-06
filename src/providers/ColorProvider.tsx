"use client";

import { useEffect, useState } from "react";
import { ColorContext, ColorKey, colors } from "@/contexts/color-context";

function getInitialColor(): ColorKey {
  if (typeof window === "undefined") return "default";
  return (localStorage.getItem("app-color-key") as ColorKey) ?? "default";
}

// Pure DOM updater
function applyColorToDOM(key: ColorKey) {
  const found = colors.find((c) => c.key === key);
  if (!found) return;

  document.documentElement.style.setProperty("--primary", found.primary);

  document.documentElement.style.setProperty("--secondary", found.secondary);

  document.documentElement.style.setProperty("--accent", found.accent);
}

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [colorKey, setColorState] = useState<ColorKey>(getInitialColor);

  useEffect(() => {
    applyColorToDOM(colorKey);
  }, [colorKey]);

  const setColorName = (key: ColorKey) => {
    localStorage.setItem("app-color-key", key);
    setColorState(key);
  };

  return (
    <ColorContext.Provider value={{ colorName: colorKey, setColorName }}>
      {children}
    </ColorContext.Provider>
  );
}
