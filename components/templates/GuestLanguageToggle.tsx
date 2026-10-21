"use client";

import React from "react";
import { Lang } from "@/types/card";

export interface GuestLanguageToggleProps {
  currentLang: Lang;
  onToggle: (lang: Lang) => void;
  theme?: "wedding" | "birthday" | "ghar";
}

export default function GuestLanguageToggle({
  currentLang,
  onToggle,
  theme = "wedding",
}: GuestLanguageToggleProps) {
  const isEn = currentLang === "en";

  const containerTheme =
    theme === "birthday"
      ? "bg-stone-900/85 border-white/20 text-white"
      : theme === "ghar"
      ? "bg-red-950/85 border-amber-400/40 text-amber-100"
      : "bg-[#2b0d16]/85 border-[#c9a24b]/40 text-[#fbf3e4]";

  const activeTheme =
    theme === "birthday"
      ? "bg-amber-400 text-stone-900 font-bold"
      : theme === "ghar"
      ? "bg-amber-400 text-stone-900 font-bold"
      : "bg-[#c9a24b] text-[#2b0d16] font-bold";

  return (
    <div
      className={`fixed top-4 left-4 z-[999] flex items-center p-1 rounded-full border shadow-xl backdrop-blur-md text-xs font-semibold ${containerTheme}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => onToggle("en")}
        className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
          isEn ? activeTheme : "opacity-75 hover:opacity-100"
        }`}
        aria-pressed={isEn}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => onToggle("hi")}
        className={`px-2.5 py-1 rounded-full transition-all text-[11px] ${
          !isEn ? activeTheme : "opacity-75 hover:opacity-100"
        }`}
        aria-pressed={!isEn}
      >
        हिन्दी
      </button>
    </div>
  );
}
