"use client";

import { useEffect, useState } from "react";
import { FontContext, FontValue, fonts } from "@/contexts/font-context";

// localStorage থেকে initial value
function getInitialFont(): FontValue {
  if (typeof window === "undefined") return fonts[0].value;
  return (localStorage.getItem("app-font") as FontValue) ?? fonts[0].value;
}

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = useState<FontValue>(getInitialFont);

  const setFont = (newFont: FontValue) => {
    localStorage.setItem("app-font", newFont);
    setFontState(newFont);
  };

  // DOM sync effect
  useEffect(() => {
    document.body.style.fontFamily = font;
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}
