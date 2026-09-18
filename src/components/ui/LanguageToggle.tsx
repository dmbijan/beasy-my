"use client"

import React from "react"
import { useLanguage } from "@/lib/i18n"
import { Languages } from "lucide-react"

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      onClick={() => setLanguage(language === "ms" ? "en" : "ms")}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
      aria-label="Tukar bahasa"
      title={language === "ms" ? "Switch to English" : "Tukar ke Bahasa Melayu"}
    >
      <Languages className="w-4 h-4" />
      <span className="uppercase">{language === "ms" ? "BM" : "EN"}</span>
    </button>
  )
}
