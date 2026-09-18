"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import GlassCard from "@/components/ui/GlassCard"
import LiquidFAB from "@/components/ui/LiquidFAB"
import LanguageToggle from "@/components/ui/LanguageToggle"
import { useLanguage } from "@/lib/i18n"
import {
  Heart,
  Cake,
  Building2,
  Music,
  GraduationCap,
  Baby,
  Gift,
  PartyPopper,
  ArrowRight,
  Smartphone,
  Cloud,
  Sparkles,
  LogIn,
  Download,
  Palette,
} from "lucide-react"

const eventTypes = [
  {
    icon: Heart,
    label: "Wedding",
    description: "Hari perkahwinan yang tidak dapat dilupakan",
    color: "rose",
    gradient: "from-rose-500/20 to-pink-500/20",
    demoSlug: "demo-perkahwinan-aiman-sarah",
  },
  {
    icon: Cake,
    label: "Birthday",
    description: "Perayaan hari jadi meriah dan ceria",
    color: "amber",
    gradient: "from-amber-500/20 to-orange-500/20",
    demoSlug: "demo-hari-jadi-ali",
  },
  {
    icon: Building2,
    label: "Corporate",
    description: "Acara korporat dan mesyuarat profesional",
    color: "indigo",
    gradient: "from-indigo-500/20 to-blue-500/20",
    demoSlug: "demo-korporat-majlis-bisnes",
  },
  {
    icon: Music,
    label: "Festival",
    description: "Festival muzik dan acara budaya",
    color: "emerald",
    gradient: "from-emerald-500/20 to-teal-500/20",
    demoSlug: "demo-festival-muzik-raya",
  },
  {
    icon: GraduationCap,
    label: "Graduation",
    description: "Konvokesyen dan majlis graduasi",
    color: "indigo",
    gradient: "from-indigo-500/20 to-purple-500/20",
    demoSlug: "demo-konvokesyen-universiti",
  },
  {
    icon: Baby,
    label: "Aqiqah",
    description: "Majlis aqiqah dan penyambutan kelahiran",
    color: "emerald",
    gradient: "from-emerald-500/20 to-green-500/20",
    demoSlug: "demo-aqiqah-anak-alam",
  },
  {
    icon: Gift,
    label: "Anniversary",
    description: "Perayaan ulang tahun yang bermakna",
    color: "pink",
    gradient: "from-pink-500/20 to-rose-500/20",
    demoSlug: "demo-anniversary",
  },
  {
    icon: PartyPopper,
    label: "Party",
    description: "Pesta dan perhimpunan yang menyeronokkan",
    color: "purple",
    gradient: "from-purple-500/20 to-violet-500/20",
    demoSlug: "demo-party",
  },
  {
    icon: Baby,
    label: "Baby Shower",
    description: "Syabas atas kemunculan bayi kecil anda",
    color: "pink",
    gradient: "from-pink-500/20 to-rose-500/20",
    demoSlug: "demo-baby-shower-siti",
  },
]

export default function LandingPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen mesh-gradient relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 left-1/3 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-16 max-w-6xl">
        {/* Header with Badge and Sign In */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/5 border border-white/10 text-sm text-white/70">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {t("platform.badge")}
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link href="/auth/signin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-500 text-white text-sm font-medium hover:from-rose-600 hover:to-indigo-600 transition-all shadow-lg"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">{t("signin")}</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 text-glow">
            Beasy<span className="text-rose-400">.my</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            {t("hero.subtitle1")}
            <br />
            {t("hero.subtitle2")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-500 text-white font-semibold shadow-lg border border-white/20 backdrop-blur-md flex items-center gap-2"
              onClick={() => window.location.href = "/e/demo-perkahwinan-aiman-sarah"}
            >
              {t("hero.tryDemo")}
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 text-white font-semibold shadow-glass flex items-center gap-2"
              onClick={() => {
                const win = window as any
                if (win.installApp) {
                  win.installApp()
                } else {
                  alert('Install this app on your device')
                }
              }}
            >
              <Smartphone className="w-5 h-5" />
              {t("hero.install")}
            </motion.button>
          </div>

          <p className="text-sm text-white/50 text-center">
            {t("hero.demoNote")}
          </p>
        </motion.div>

        {/* Demo Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {t("demo.title")}
            </h2>
            <p className="text-white/60 text-sm">
              {t("demo.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {eventTypes.map((type, index) => (
              <motion.div
                key={type.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <GlassCard
                  variant="light"
                  glow={type.color as any}
                  className="cursor-pointer group"
                  onClick={() => window.location.href = `/e/${type.demoSlug}`}
                >
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${type.gradient} mb-4`}>
                    <type.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{type.label}</h3>
                  <p className="text-sm text-white/60 mb-4">{type.description}</p>
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500/20 to-indigo-500/20 border border-white/20 text-white font-medium hover:from-rose-500/30 hover:to-indigo-500/30 transition-all flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    {t("demo.button")}
                  </button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Create Event Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-16"
        >
          <GlassCard variant="dark" glow="indigo" className="text-center py-8 px-6">
            <h2 className="text-2xl font-bold text-white mb-3">
              {t("create.title")}
            </h2>
            <p className="text-white/60 mb-6 max-w-lg mx-auto">
              {t("create.subtitle")}
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-500 text-white font-semibold hover:from-rose-600 hover:to-indigo-600 transition-all shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              {t("create.button")}
            </Link>
          </GlassCard>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            {t("features.title")}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard variant="dark" glow="indigo" className="text-center">
              <Cloud className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{t("features.storage")}</h3>
              <p className="text-sm text-white/60">
                {t("features.storageDesc")}
              </p>
            </GlassCard>

            <GlassCard variant="dark" glow="emerald" className="text-center">
              <Smartphone className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{t("features.install")}</h3>
              <p className="text-sm text-white/60">
                {t("features.installDesc")}
              </p>
            </GlassCard>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
            >
              <Palette className="w-5 h-5" />
              {t("features.templates")}
            </Link>
          </div>
        </motion.div>

        {/* Why Beasy Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Kenapa Beasy.my?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Sparkles, title: "Real-Time Gallery", desc: "Foto, ucapan, suara & video muncul serta-merta selepas muat naik. Semua tetamu boleh lihat secara langsung." },
              { icon: Smartphone, title: "Tiada Aplikasi Diperlukan", desc: "Tetamu imbas QR, terus rakam atau muat naik dari pelayar. Mudah untuk semua peringkat umur." },
              { icon: Cloud, title: "Privasi Terjamin", desc: "Galeri hanya boleh diakses melalui pautan atau QR anda. Tiada indeks awam." },
              { icon: Heart, title: "Milik Anda", desc: "Semua media disimpan ke Google Drive anda sendiri. Bukan milik platform pihak ketiga." },
            ].map((item) => (
              <GlassCard key={item.title} variant="dark" glow="indigo" className="text-center">
                <item.icon className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-white/60">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Disayangi untuk Setiap Majlis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { quote: "\"Akhirnya ada servis macam ni di Malaysia. Tetamu upload terus tanpa aplikasi - dapat ratusan foto candid dalam sejam.\"", name: "Aina & Haikal", loc: "Kuala Lumpur" },
              { quote: "\"Setup paling mudah. QR di meja tetamu buat semuanya rasa automatik.\"", name: "Nadia & Faizal", loc: "Penang" },
              { quote: "\"Selalu nampak mat saleh je yang buat. Terima kasih Beasy, sangat recommended!\"", name: "Muaz & Lala", loc: "Kuching" },
            ].map((t) => (
              <GlassCard key={t.name} variant="light" glow="rose" className="text-center">
                <p className="text-white/80 text-sm italic mb-4">{t.quote}</p>
                <p className="text-white font-semibold">{t.name}</p>
                <p className="text-white/50 text-xs">{t.loc}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Google Drive Connection */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <GlassCard variant="light" glow="amber" className="max-w-2xl mx-auto text-center py-8 px-6">
            <Cloud className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">
              {t("drive.title")}
            </h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              {t("drive.subtitle")}
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
            >
              <Cloud className="w-5 h-5" />
              {t("drive.button")}
            </Link>
          </GlassCard>
        </motion.div>

        {/* CTA Section - Checkout */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mb-16"
        >
          <GlassCard variant="dark" glow="indigo">
            <div className="text-center py-12 px-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">{t("cta.title")}</h2>
              <p className="text-white/60 max-w-lg mx-auto mb-2">
                {t("cta.subtitle")}
              </p>
              <p className="text-white/40 text-sm line-through mb-6">{t("cta.original")} RM{159 * 3}</p>
              
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-white/60 text-lg">{t("cta.priceLabel")}</span>
                <span className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  RM159
                </span>
              </div>

              <Link
                href="/payment/checkout"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/25"
              >
                {t("cta.button")}
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="flex items-center justify-center gap-6 mt-6 text-white/40 text-xs">
                <span>{t("cta.lifetime")}</span>
                <span>•</span>
                <span>{t("cta.instant")}</span>
                <span>•</span>
                <span>•</span>
                <span>{t("cta.updates")}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* FAQ Section - SEO Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Soalan Lazim (FAQ)
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Apakah itu Beasy.my?",
                a: "Beasy.my adalah platform acara digital Malaysia yang menyediakan jemputan online, galeri foto, audio guestbook, RSVP dan banyak lagi untuk majlis perkahwinan, birthday, korporat dan acara lainnya."
              },
              {
                q: "Bagaimana cara buat jemputan kahwin digital di Beasy.my?",
                a: "Sangat mudah! Daftar akaun, pilih template yang anda suka (88+ pilihan), isi butiran majlis, dan kongsi link jemputan melalui WhatsApp atau QR code. Setup hanya ambil 5 minit sahaja."
              },
              {
                q: "Adakah Beasy.my percuma?",
                a: "Ya! Kami ada versi percuma dengan fitur asas. Untuk fitur premium seperti payment gateway, custom domain, dan analytics lanjutan, kami ada pakej sekali bayar RM159 sahaja."
              },
              {
                q: "Bolehkah saya terima hadiah cash / angpao digital?",
                a: "Ya! Beasy.my integrate dengan ToyyibPay payment gateway untuk menerima angpao digital, sumbangan dan payment untuk majlis anda. Settlement terus ke akaun bank anda."
              },
              {
                q: "Apa yang istimewa tentang galeri foto Beasy.my?",
                a: "Galeri kami menggunakan Google Drive untuk storage — semua foto tetamu upload terus ke Google Drive anda. Tiada app perlu download oleh tetamu, cukup scan QR atau klik link."
              },
              {
                q: "Adakah jemputan digital boleh cari di Google?",
                a: "Ya! Semua jemputan di Beasy.my SEO optimized. Tetamu boleh cari event anda melalui Google, dan jemputan akan muncul dalam carian dengan rich snippets."
              },
            ].map((faq, i) => (
              <GlassCard key={i} variant="dark" glow="indigo" className="p-6">
                <details className="group">
                  <summary className="cursor-pointer font-semibold text-white text-lg mb-2 list-none flex items-center justify-between">
                    {faq.q}
                    <span className="text-rose-400 text-2xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="text-white/60 leading-relaxed pt-2 border-t border-white/10">
                    {faq.a}
                  </p>
                </details>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-white/40 text-xs space-y-2">
          <Link href="/fair-use-policy" className="hover:text-white/70 transition">Polisi Penggunaan Adil</Link>
          <p>© {new Date().getFullYear()} Beasy.my. Semua hak terpelihara.</p>
        </div>
      </div>

      {/* Bottom Spacing for FAB */}
      <div className="h-32" />
    </div>
  )
}
