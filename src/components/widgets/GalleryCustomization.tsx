"use client"

import React, { useEffect, useState } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import {
  themeColours, guestFonts, storyTemplates, guestLayouts,
  type GalleryCustomization,
} from '@/lib/gallery-customization'
import { User, MessageSquare, Layout, Palette, Type, Image as ImageIcon, Layers } from 'lucide-react'

interface GalleryCustomizationProps {
  eventId: string
}

export default function GalleryCustomizationWidget({ eventId }: GalleryCustomizationProps) {
  const [customization, setCustomization] = useState<GalleryCustomization>({
    groom: '', bride: '', monogram: '', hashtag: '', welcomeMessage: '',
    guestLanguage: 'ms', guestLayout: 'polaroid-wall', themeColourId: 'blush',
    guestFontId: 'dancing-script', keepsakeBackground: '', storyTemplateIds: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/events/${eventId}`, { cache: 'no-store' })
      .then(async response => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        const existing = (data.event.theme_config?.customization) || {}
        setCustomization(prev => ({ ...prev, ...existing }))
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [eventId])

  const set = <K extends keyof GalleryCustomization>(key: K, value: GalleryCustomization[K]) =>
    setCustomization(prev => ({ ...prev, [key]: value }))

  const toggleStoryTemplate = (id: string) => {
    setCustomization(prev => ({
      ...prev,
      storyTemplateIds: prev.storyTemplateIds.includes(id)
        ? prev.storyTemplateIds.filter(t => t !== id)
        : [...prev.storyTemplateIds, id],
    }))
  }

  const save = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const response = await fetch(`/api/events/${eventId}/customization`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customization),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-white/60 text-sm">Memuatkan customization...</p>

  return (
    <GlassCard variant="dark" glow="rose" className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><Layers className="w-5 h-5 text-rose-400" /> Customization Galeri</h3>

      {error && <p role="alert" className="text-rose-300 text-sm">{error}</p>}
      {saved && <p role="status" className="text-emerald-300 text-sm">Customization disimpan.</p>}

      {/* Couple identity */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold flex items-center gap-2"><User className="w-4 h-4" /> Identiti Pasangan</h4>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm text-white/70">Pengantin Lelaki (Groom)
            <input value={customization.groom} onChange={e => set('groom', e.target.value)} className="block w-full mt-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white" placeholder="Ahmad" />
          </label>
          <label className="block text-sm text-white/70">Pengantin Perempuan (Bride)
            <input value={customization.bride} onChange={e => set('bride', e.target.value)} className="block w-full mt-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white" placeholder="Siti" />
          </label>
          <label className="block text-sm text-white/70">Monogram
            <input value={customization.monogram} onChange={e => set('monogram', e.target.value)} maxLength={10} className="block w-full mt-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white" placeholder="A&S" />
          </label>
          <label className="block text-sm text-white/70">Hashtag
            <input value={customization.hashtag} onChange={e => set('hashtag', e.target.value)} className="block w-full mt-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white" placeholder="#kawinAS" />
          </label>
        </div>
      </div>

      {/* Welcome message */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Welcome Message</h4>
        <textarea value={customization.welcomeMessage} onChange={e => set('welcomeMessage', e.target.value)} rows={3} className="block w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white" placeholder="Terima kasih datang majlis kami ❤️" />
      </div>

      {/* Guest language */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold">Bahasa Tetamu</h4>
        <div className="flex gap-2">
          {(['ms', 'en'] as const).map(lang => (
            <button key={lang} onClick={() => set('guestLanguage', lang)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${customization.guestLanguage === lang ? 'bg-rose-500/30 border border-rose-500/50 text-rose-300' : 'bg-white/5 border border-white/10 text-white/60'}`}>
              {lang === 'ms' ? 'Bahasa Melayu' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Guest layout */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold flex items-center gap-2"><Layout className="w-4 h-4" /> Guest Layout</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guestLayouts.map(layout => (
            <button key={layout.id} onClick={() => set('guestLayout', layout.id)}
              className={`text-left p-3 rounded-xl border transition-all ${customization.guestLayout === layout.id ? 'bg-rose-500/20 border-rose-500/50' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
              <p className="text-white font-medium">{layout.name}</p>
              <p className="text-xs text-white/50 mt-1">{layout.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Theme colour */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold flex items-center gap-2"><Palette className="w-4 h-4" /> Theme Colour</h4>
        <div className="flex gap-2 flex-wrap">
          {themeColours.map(colour => (
            <button key={colour.id} onClick={() => set('themeColourId', colour.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${customization.themeColourId === colour.id ? 'bg-white/20 border border-white/40 text-white' : 'bg-white/5 border border-white/10 text-white/60'}`}>
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colour.primary }} />
              {colour.name}
            </button>
          ))}
        </div>
      </div>

      {/* Guest message font */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold flex items-center gap-2"><Type className="w-4 h-4" /> Guest Message Font</h4>
        <div className="grid grid-cols-2 gap-2">
          {guestFonts.map(font => (
            <button key={font.id} onClick={() => set('guestFontId', font.id)}
              className={`p-2 rounded-lg border text-left transition-all ${customization.guestFontId === font.id ? 'bg-rose-500/20 border-rose-500/50' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
              <span className="block text-white text-sm" style={{ fontFamily: font.fontFamily }}>Wishing you forever</span>
              <span className="block text-xs text-white/50 mt-0.5">{font.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Keepsake background */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Keepsake Background</h4>
        <p className="text-xs text-white/50">Foto ini digunakan sebagai latar kad kenang-kenangan & animasi polaroid di welcome page.</p>
        <input value={customization.keepsakeBackground} onChange={e => set('keepsakeBackground', e.target.value)} className="block w-full p-2 rounded-lg bg-white/10 border border-white/20 text-white" placeholder="URL gambar (data URI atau http)" />
      </div>

      {/* Story templates */}
      <div className="space-y-3">
        <h4 className="text-white font-semibold flex items-center gap-2"><Layers className="w-4 h-4" /> Story Templates ({customization.storyTemplateIds.length} dipilih)</h4>
        <p className="text-xs text-white/50">Pilih bingkai/frame yang tetamu boleh gunakan pada foto mereka.</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {storyTemplates.map(template => (
            <button key={template.id} onClick={() => toggleStoryTemplate(template.id)}
              className={`p-2 rounded-xl border text-center transition-all ${customization.storyTemplateIds.includes(template.id) ? 'bg-rose-500/20 border-rose-500/50' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
              <span className="text-2xl block">{template.emoji}</span>
              <span className="text-xs text-white/70 block mt-1">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold disabled:opacity-50">
        {saving ? 'Menyimpan...' : 'Simpan Customization'}
      </button>
    </GlassCard>
  )
}
