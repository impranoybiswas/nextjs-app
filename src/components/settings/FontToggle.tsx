"use client";
import { fonts, useFont } from "@/contexts/font-context";

export default function FontToggle() {
  const { font, setFont } = useFont();
  return (
    <div className="flex flex-wrap gap-4">
      {fonts.map((f) => (
        <button
          key={f.value}
          onClick={() => {
            setFont(f.value);
          }}
          className={`flex items-center justify-between px-4 py-3 rounded-lg border transition text-sm ${
            font === f.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-foreground/10 hover:bg-foreground/5"
          }`}
        >
          <span style={{ fontFamily: f.value }}>{f.name}</span>
          {font === f.value && <span className="text-xs text-primary">✓</span>}
        </button>
      ))}
    </div>
  );
}
