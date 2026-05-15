"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTransition } from "react";
import ToggleButton from "@/components/ui/ToggleButton";

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "bn" : "en";

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-foreground/10 transition text-sm">
      <span>English</span>
      {/* <button
        onClick={toggleLanguage}
        disabled={isPending}
        className="relative p-0.5  w-12 bg-primary/10 border border-primary/30 rounded-full flex items-center  hover:bg-primary/20 cursor-pointer"
      >
        <span
          className={`size-5 bg-primary rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${locale === "en" ? "translate-x-0" : "translate-x-5.5"}`}
        />
      </button> */}

      <ToggleButton
        disabled={isPending}
        isActive={locale === "en"}
        onClick={toggleLanguage}
      />
      <span>Bangla</span>
    </div>
  );
}
