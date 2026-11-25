"use client";

import { useTranslation } from "@/lib/i18n-context";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === "es" ? "en" : "es")}
      className="group relative flex h-11 w-11 items-center justify-center rounded-full text-zinc-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-100/80 hover:text-ink active:scale-95"
      aria-label={language === "es" ? "Cambiar a inglés" : "Switch to Spanish"}
    >
      <Globe className="h-4 w-4" strokeWidth={1.8} />
      <span className="absolute -bottom-5 rounded-md bg-ink px-1.5 py-0.5 text-[9px] font-black text-white opacity-0 transition-opacity group-hover:opacity-100">
        {language.toUpperCase()}
      </span>
    </button>
  );
}
