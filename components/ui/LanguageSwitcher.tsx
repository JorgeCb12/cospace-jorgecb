"use client";

import { useTranslation } from "@/lib/i18n-context";

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <button
      onClick={() => setLanguage(language === "es" ? "en" : "es")}
      className="text-sm font-medium border border-gray-300 rounded px-3 py-1 bg-white hover:bg-gray-50 transition-colors"
    >
      {language === "es" ? "🇪🇸 ES" : "🇺🇸 EN"}
    </button>
  );
}
