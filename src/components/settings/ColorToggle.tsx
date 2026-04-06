"use client";

import { colors, useColor } from "@/contexts/color-context";

export default function ColorToggle() {
  const { colorName, setColorName } = useColor();
  return (
    <div className="flex flex-wrap gap-4">
      {colors.map((c) => {
        const isActive = colorName === c.key;
        return (
          <button
            key={c.key}
            onClick={() => {
              setColorName(c.key);
            }}
            className={`flex flex-col gap-2 p-3 rounded-lg border transition text-left ${
              isActive
                ? "border-primary bg-primary/10"
                : "border-foreground/10 hover:bg-foreground/5"
            }`}
          >
            {/* Color swatches */}
            <div className="flex gap-1">
              {c.palette.map((color: string) => (
                <span
                  key={color}
                  className="w-5 h-5 rounded-full border border-foreground/10"
                  style={{ background: color }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{c.name}</span>
              {isActive && <span className="text-xs text-primary">✓</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
