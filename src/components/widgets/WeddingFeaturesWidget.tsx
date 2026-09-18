"use client"

import React, { useEffect, useState } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import type { WishlistItem, ItineraryItem } from '@/lib/gallery-customization'
import { Music, Video, Gift, CalendarDays, Bot, FileDown, Plus, Trash2 } from 'lucide-react'

interface WeddingFeaturesWidgetProps {
  eventId: string
}

const emptyWishlist = (): WishlistItem => ({ id: crypto.randomUUID(), name: '', link: '', reserved: false })
const emptyItinerary = (): ItineraryItem => ({ id: crypto.randomUUID(), time: '', title: '', description: '' })

export default function WeddingFeaturesWidget({ eventId }: WeddingFeaturesWidgetProps) {
  const [backgroundMusic, setBackgroundMusic] = useState('')
  const [videoCover, setVideoCover] = useState('')
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([])
  const [chatAiEnabled, setChatAiEnabled] = useState(false)
  const [pdfEnabled, setPdfEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/events/${eventId}`, { cache: 'no-store' })
      .then(async response => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        const c = (data.event.theme_config?.customization) || {}
        setBackgroundMusic(c.backgroundMusic || '')
        setVideoCover(c.videoCover || '')
        setWishlist(c.wishlist || [])
        setItinerary(c.itinerary || [])
        setChatAiEnabled(c.chatAiEnabled || false)
        setPdfEnabled(c.pdfEnabled || false)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [eventId])

  const save = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const response = await fetch(`/api/events/${eventId}/customization`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backgroundMusic, videoCover, wishlist, itinerary, chatAiEnabled, pdfEnabled }),
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

  const updateWishlist = (id: string, patch: Partial<WishlistItem>) =>
    setWishlist(prev => prev.map(w => w.id === id ? { ...w, ...patch } : w))
  const updateItinerary = (id: string, patch: Partial<ItineraryItem>) =>
    setItinerary(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))

  if (loading) return <p className="text-white/60 text-sm">Memuatkan ciri majlis...</p>

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
  const labelCls = "block text-sm font-medium text-white/80 mb-1"

  return (
    <GlassCard variant="dark" glow="indigo" className="space-y-6">
      <h3 className="text-xl font-bold text-white flex items-center gap-2"><Gift className="w-5 h-5 text-indigo-400" /> Ciri Majlis Tambahan</h3>

      {error && <p role="alert" className="text-rose-300 text-sm">{error}</p>}
      {saved && <p role="status" className="text-emerald-300 text-sm">Ciri disimpan.</p>}

      {/* Background Music */}
      <div className="space-y-2">
        <h4 className="text-white font-semibold flex items-center gap-2"><Music className="w-4 h-4 text-indigo-400" /> Lagu Latar (URL MP3)</h4>
        <input className={inputCls} value={backgroundMusic} onChange={e => setBackgroundMusic(e.target.value)} placeholder="https://.../lagu.mp3" />
        <p className="text-white/40 text-xs">Pautan terus ke fail audio (mp3). Tetamu dengar lagu semasa buka kad.</p>
      </div>

      {/* Video Cover */}
      <div className="space-y-2">
        <h4 className="text-white font-semibold flex items-center gap-2"><Video className="w-4 h-4 text-indigo-400" /> Video Cover / Motion Invite (URL)</h4>
        <input className={inputCls} value={videoCover} onChange={e => setVideoCover(e.target.value)} placeholder="https://.../video.mp4" />
        <p className="text-white/40 text-xs">Video pembukaan di atas kad jemputan (mp4).</p>
      </div>

      {/* Chat AI toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
        <div>
          <h4 className="text-white font-semibold flex items-center gap-2"><Bot className="w-4 h-4 text-purple-400" /> Chat AI</h4>
          <p className="text-white/40 text-xs">Bot jawab soalan tetamu (tarikh, lokasi, pakaian).</p>
        </div>
        <button onClick={() => setChatAiEnabled(v => !v)} className={`w-12 h-7 rounded-full transition-colors ${chatAiEnabled ? 'bg-indigo-500' : 'bg-white/10'}`}>
          <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${chatAiEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* PDF toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
        <div>
          <h4 className="text-white font-semibold flex items-center gap-2"><FileDown className="w-4 h-4 text-emerald-400" /> Muat Turun PDF</h4>
          <p className="text-white/40 text-xs">Benarkan tetamu muat turun kad sebagai PDF.</p>
        </div>
        <button onClick={() => setPdfEnabled(v => !v)} className={`w-12 h-7 rounded-full transition-colors ${pdfEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}>
          <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${pdfEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      {/* Wishlist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-semibold flex items-center gap-2"><Gift className="w-4 h-4 text-emerald-400" /> Wishlist Hadiah</h4>
          <button onClick={() => setWishlist(prev => [...prev, emptyWishlist()])} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs hover:bg-emerald-500/30 transition">
            <Plus className="w-3 h-3" /> Tambah
          </button>
        </div>
        {wishlist.map(item => (
          <div key={item.id} className="flex gap-2 items-start">
            <input className={inputCls} value={item.name} onChange={e => updateWishlist(item.id, { name: e.target.value })} placeholder="Nama hadiah" />
            <input className={inputCls} value={item.link} onChange={e => updateWishlist(item.id, { link: e.target.value })} placeholder="Pautan (opsional)" />
            <button onClick={() => setWishlist(prev => prev.filter(w => w.id !== item.id))} className="p-2.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      {/* Itinerary */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-semibold flex items-center gap-2"><CalendarDays className="w-4 h-4 text-indigo-400" /> Aturcara Majlis</h4>
          <button onClick={() => setItinerary(prev => [...prev, emptyItinerary()])} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs hover:bg-indigo-500/30 transition">
            <Plus className="w-3 h-3" /> Tambah
          </button>
        </div>
        {itinerary.map(item => (
          <div key={item.id} className="space-y-1 p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex gap-2">
              <input className={inputCls} value={item.time} onChange={e => updateItinerary(item.id, { time: e.target.value })} placeholder="Masa (cth: 10:00 AM)" />
              <input className={inputCls} value={item.title} onChange={e => updateItinerary(item.id, { title: e.target.value })} placeholder="Acara (cth: Akad Nikah)" />
              <button onClick={() => setItinerary(prev => prev.filter(i => i.id !== item.id))} className="p-2.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition shrink-0"><Trash2 className="w-4 h-4" /></button>
            </div>
            <input className={inputCls} value={item.description} onChange={e => updateItinerary(item.id, { description: e.target.value })} placeholder="Penerangan (opsional)" />
          </div>
        ))}
      </div>

      <button onClick={save} disabled={saving} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:from-indigo-600 hover:to-purple-700 transition disabled:opacity-50">
        {saving ? 'Menyimpan...' : 'Simpan Ciri Majlis'}
      </button>
    </GlassCard>
  )
}
