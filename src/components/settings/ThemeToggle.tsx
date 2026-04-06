"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-foreground/10 transition text-sm">
      <span>Light</span>
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="relative p-0.5  w-12 bg-primary/10 border border-primary/30 rounded-full flex items-center  hover:bg-primary/20 cursor-pointer "
      >
        <span className="size-5 bg-primary rounded-full translate-x-0 dark:translate-x-5.5 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]" />
      </button>
      <span>Dark</span>
    </div>
  );
}
