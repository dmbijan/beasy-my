"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import GlassCard from "@/components/ui/GlassCard"
import { templates, templateCategories, type TemplateCategory } from "@/lib/templates"
import { motifKindForCategory, MotifOverlay } from "@/components/ui/TemplateMotif"
import { Sparkles, ArrowLeft, Palette } from "lucide-react"

export default function TemplatesPage() {
  const [category, setCategory] = useState<TemplateCategory | "All">("All")

  const filtered = category === "All" ? templates : templates.filter(t => t.category === category)

  return (
    <div className="min-h-screen mesh-gradient relative overflow-hidden pb-32">
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Kembali</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70">
            <Sparkles className="w-4 h-4 text-amber-400" />
            {templates.length} Reka Bentuk
          </div>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 text-glow">
            Semua Template Beasy<span className="text-rose-400">.my</span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Pilih reka bentuk untuk kad jemputan, galeri foto dan QR. Pratonton penuh dengan kandungan contoh.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setCategory("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === "All" ? "bg-white/20 border border-white/40 text-white" : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
            }`}
          >
            All
          </button>
          {templateCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat ? "bg-white/20 border border-white/40 text-white" : "bg-white/5 border border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Link href={`/templates/${template.id}`} className="block">
                <GlassCard variant="light" glow="default" className="overflow-hidden group cursor-pointer">
                {/* Preview */}
                <div className={`aspect-[4/3] bg-gradient-to-br ${template.gradient} relative flex items-center justify-center overflow-hidden`}>
                  <MotifOverlay kind={motifKindForCategory(template.category)} accent={template.accentColor2} />
                  <div className="relative z-10 text-center px-4">
                    <p className="text-white/80 text-xs tracking-[0.3em] uppercase mb-2">You're Invited</p>
                    <p className="text-white text-xl font-bold mb-1">Aisyah & Daniel</p>
                    <p className="text-white/70 text-xs">27 December 2026</p>
                  </div>
                  {template.suggested && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/40 text-white text-[10px] font-semibold">
                      Suggested
                    </span>
                  )}
                  <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>

                {/* Meta */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold">{template.name}</h3>
                    <span className="text-xs text-white/50">{template.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: template.accentColor }} />
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: template.accentColor2 }} />
                    <span className="ml-auto text-xs text-white/40">{template.theme}</span>
                  </div>
                </div>
              </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <GlassCard variant="dark" glow="indigo" className="text-center py-10 px-6">
            <Palette className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-3">Suka reka bentuk ini?</h2>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Cipta acara anda dan pilih template semasa setup. Semua template termasuk dalam pakej RM159.
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-500 text-white font-semibold hover:from-rose-600 hover:to-indigo-600 transition-all shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Cipta Acara
            </Link>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
