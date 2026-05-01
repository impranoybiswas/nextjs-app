"use client";

import { useEffect, useState } from "react";
import { FontContext, FontValue, fonts } from "@/contexts/font-context";

function applyFontToDOM(key: FontValue) {
  document.body.style.fontFamily = key;
}

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = useState<FontValue>(() => {
    if (typeof window === "undefined") return fonts[0].value;
    return (localStorage.getItem("app-font") as FontValue) ?? fonts[0].value;
  });

  useEffect(() => {
    applyFontToDOM(font);
  }, [font]);

  const setFont = (newFont: FontValue) => {
    localStorage.setItem("app-font", newFont);
    setFontState(newFont);
  };

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}
