"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type Language = "ms" | "en"

// Lightweight bilingual dictionary for the landing page and shared UI.
// Extend this map to cover more components over time.
const translations = {
  ms: {
    "platform.badge": "Platform Event Digital #1 Malaysia",
    "signin": "Sign In",
    "hero.subtitle1": "Everything for your event, in one place.",
    "hero.subtitle2": "Semua yang anda perlukan untuk majlis sempurna.",
    "hero.tryDemo": "Cuba Demo Percuma",
    "hero.install": "Install Now",
    "hero.demoNote": "✨ Demo percuma tanpa login. Cipta acara juga PERCUMA - tanpa login!",
    "demo.title": "Cuba Demo Percuma",
    "demo.subtitle": "Tanpa perlu login. Lihat semua ciri Beasy.my sebelum cipta acara anda.",
    "demo.button": "Cuba Demo Percuma",
    "create.title": "Mahu Cipta Acara Sendiri?",
    "create.subtitle": "Cipta acara anda sekarang - PERCUMA! Hanya perlu login & bayar bila nak connect Google Drive.",
    "create.button": "Cipta Acara Percuma",
    "features.title": "Kenapa Pilih Beasy.my?",
    "features.storage": "Customer Own Storage",
    "features.storageDesc": "Semua fail disimpan terus ke Google Drive pemilik acara. Tiada kos penyimpanan server.",
    "features.install": "Install Now",
    "features.installDesc": "Install ke skrin utama telefon. Berfungsi offline dan pantas seperti aplikasi native.",
    "features.templates": "Lihat Semua Template",
    "drive.title": "Connect to your Google Drive",
    "drive.subtitle": "Connect your Google Drive untuk simpan semua fail acara secara bebas dan selamat.",
    "drive.button": "Connect Google Drive",
    "cta.title": "All-In-1 Event Package",
    "cta.subtitle": "Dapatkan semua fitur Beasy.my dalam satu pakej. Platform event digital serba lengkap untuk setiap majlis anda.",
    "cta.original": "Nilai sebenar",
    "cta.priceLabel": "Harga Promosi:",
    "cta.button": "Daftar Sekarang",
    "cta.lifetime": "Lifetime Access",
    "cta.instant": "Instant Setup",
    "cta.updates": "Free Updates",
  },
  en: {
    "platform.badge": "#1 Malaysia Digital Event Platform",
    "signin": "Sign In",
    "hero.subtitle1": "Everything for your event, in one place.",
    "hero.subtitle2": "Everything you need for a perfect celebration.",
    "hero.tryDemo": "Try Free Demo",
    "hero.install": "Install Now",
    "hero.demoNote": "✨ Free demo, no login. Create your event for FREE too - no login required!",
    "demo.title": "Try Free Demo",
    "demo.subtitle": "No login needed. Explore all Beasy.my features before creating your event.",
    "demo.button": "Try Free Demo",
    "create.title": "Create Your Own Event?",
    "create.subtitle": "Create your event now - FREE! Just login & pay when you want to connect Google Drive.",
    "create.button": "Create Free Event",
    "features.title": "Why Choose Beasy.my?",
    "features.storage": "Customer Own Storage",
    "features.storageDesc": "All files stored directly to the event owner's Google Drive. No server storage costs.",
    "features.install": "Install Now",
    "features.installDesc": "Install to your phone's home screen. Works offline and fast like a native app.",
    "features.templates": "View All Templates",
    "drive.title": "Connect to your Google Drive",
    "drive.subtitle": "Connect your Google Drive to store all event files freely and securely.",
    "drive.button": "Connect Google Drive",
    "cta.title": "All-In-1 Event Package",
    "cta.subtitle": "Get every Beasy.my feature in one package. A complete digital event platform for every occasion.",
    "cta.original": "Actual value",
    "cta.priceLabel": "Promo Price:",
    "cta.button": "Register Now",
    "cta.lifetime": "Lifetime Access",
    "cta.instant": "Instant Setup",
    "cta.updates": "Free Updates",
  },
} as const

type TranslationKey = keyof typeof translations.ms

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "ms",
  setLanguage: () => {},
  t: (key) => translations.ms[key],
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ms")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("beasy_language")
      if (saved === "en" || saved === "ms") setLanguageState(saved)
    } catch { /* localStorage may be unavailable */ }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try { localStorage.setItem("beasy_language", lang) } catch { /* ignore */ }
  }

  const t = (key: TranslationKey) => translations[language][key] || translations.ms[key]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
