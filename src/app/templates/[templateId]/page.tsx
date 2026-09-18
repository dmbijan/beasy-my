"use client"

import React, { useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import GlassCard from "@/components/ui/GlassCard"
import { templates, templateById } from "@/lib/templates"
import { themePageGradient, accentWithAlpha } from "@/lib/theme-styles"
import { motifKindForCategory, MotifOverlay } from "@/components/ui/TemplateMotif"
import { ArrowLeft, Sparkles, Heart, Calendar, MapPin, Check } from "lucide-react"

export default function TemplateDetailPage() {
  const params = useParams()
  const templateId = params?.templateId as string

  const template = useMemo(() => templateById(templateId), [templateId])

  if (!template) {
    return (
      <div className="min-h-screen mesh-gradient flex items-center justify-center p-6">
        <GlassCard variant="light" className="text-center space-y-4 max-w-lg">
          <h1 className="text-2xl font-bold text-white">Template tidak dijumpai</h1>
          <Link href="/templates" className="inline-flex items-center gap-2 text-emerald-300">
            <ArrowLeft className="w-4 h-4" /> Kembali ke katalog
          </Link>
        </GlassCard>
      </div>
    )
  }

  const previewDate = new Date("2026-12-27T15:00:00")
  const idx = templates.findIndex(t => t.id === template.id)
  const prev = templates[(idx - 1 + templates.length) % templates.length]
  const next = templates[(idx + 1) % templates.length]

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden" style={{ background: themePageGradient(template.theme) }}>
      <MotifOverlay kind={motifKindForCategory(template.category)} accent={template.accentColor2} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Back + nav */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/templates" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Semua Template</span>
          </Link>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-white/70">
            {idx + 1} / {templates.length}
          </span>
        </div>

        {/* Full preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard variant="light" className="overflow-hidden">
            {/* Hero preview */}
            <div className={`relative aspect-[4/5] sm:aspect-[4/4] bg-gradient-to-br ${template.gradient} flex items-center justify-center overflow-hidden`}>
              <MotifOverlay kind={motifKindForCategory(template.category)} accent={template.accentColor2} />
              <div className="relative z-10 text-center px-6">
                <p className="text-white/80 text-[11px] tracking-[0.35em] uppercase mb-3">You're Invited</p>
                <p className="text-white text-3xl font-bold mb-2">Aisyah & Daniel</p>
                <p className="text-white/80 text-sm mb-1">{previewDate.toLocaleDateString("ms-MY", { dateStyle: "full" })}</p>
                <p className="text-white/60 text-xs mb-4">Dewan Seri Kenangan, Kuala Lumpur</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 text-white text-[10px] font-semibold">
                  <Heart className="w-3 h-3" /> Wedding
                </div>
              </div>
            </div>

            {/* Template meta */}
            <div className="p-6 space-y-5">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-1">{template.name}</h1>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: accentWithAlpha(template.accentColor, 0.2), color: template.accentColor, border: `1px solid ${accentWithAlpha(template.accentColor, 0.35)}` }}
                >
                  {template.category}
                </span>
              </div>

              {/* Colour swatches */}
              <div className="flex items-center justify-center gap-3">
                <div className="text-center">
                  <span className="w-10 h-10 rounded-full border-2 border-white/20 block mx-auto" style={{ backgroundColor: template.accentColor }} />
                  <span className="text-[10px] text-white/50 mt-1 block">Aksen</span>
                </div>
                <div className="text-center">
                  <span className="w-10 h-10 rounded-full border-2 border-white/20 block mx-auto" style={{ backgroundColor: template.accentColor2 }} />
                  <span className="text-[10px] text-white/50 mt-1 block">Aksen 2</span>
                </div>
                <div className="text-center">
                  <span className="w-10 h-10 rounded-full border-2 border-white/20 block mx-auto" style={{ background: `linear-gradient(to bottom right, ${template.accentColor}, ${template.accentColor2})` }} />
                  <span className="text-[10px] text-white/50 mt-1 block">Gradient</span>
                </div>
              </div>

              <p className="text-white/60 text-sm text-center">
                Tema: <span className="text-white/80 capitalize">{template.theme}</span>
                {template.suggested && <span className="ml-2 text-amber-300 text-xs">★ Suggested</span>}
              </p>

              {/* CTA */}
              <Link
                href="/dashboard/create"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg"
                style={{ background: `linear-gradient(135deg, ${template.accentColor}, ${template.accentColor2})` }}
              >
                <Sparkles className="w-5 h-5" />
                Guna Template Ini
              </Link>
            </div>
          </GlassCard>

          {/* Prev / Next */}
          <div className="flex items-center justify-between mt-6 gap-3">
            <Link
              href={`/templates/${prev.id}`}
              className="flex-1 text-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition text-sm"
            >
              ← {prev.name}
            </Link>
            <Link
              href={`/templates/${next.id}`}
              className="flex-1 text-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition text-sm"
            >
              {next.name} →
            </Link>
          </div>

          {/* Feature checklist */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {["RSVP Online", "Galeri Foto", "Audio Guestbook", "Angpao Digital"].map(f => (
              <div key={f} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm">
                <Check className="w-4 h-4 text-emerald-400" /> {f}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
