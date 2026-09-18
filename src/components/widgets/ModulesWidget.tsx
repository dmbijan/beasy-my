"use client"

import React, { useEffect, useState } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import { Calendar, Users, Utensils, Camera, Mic, Video, Heart, Music, Tv, CreditCard, Sparkles, Loader2, Lock } from 'lucide-react'

interface ModuleState {
  module_type: string
  is_enabled: boolean
}

interface ModulesWidgetProps {
  eventId: string
}

const FREE_MODULES = new Set(['rsvp', 'seating', 'menu'])

const MODULE_META: Record<string, { name: string; description: string; icon: React.ReactNode }> = {
  rsvp: { name: 'RSVP Online', description: 'Sahkan kehadiran & pax', icon: <Calendar className="w-4 h-4" /> },
  seating: { name: 'Pengaturan Meja', description: 'Jadual tempat duduk', icon: <Users className="w-4 h-4" /> },
  menu: { name: 'Senarai Menu', description: 'Hidangan majlis', icon: <Utensils className="w-4 h-4" /> },
  photobooth: { name: 'Photo Wall & Gallery', description: 'Upload & galeri foto tetamu', icon: <Camera className="w-4 h-4" /> },
  audio_guestbook: { name: 'Audio Guestbook', description: 'Ucapan suara tetamu', icon: <Mic className="w-4 h-4" /> },
  video_guestbook: { name: 'Video Guestbook', description: 'Ucapan video tetamu', icon: <Video className="w-4 h-4" /> },
  wishes: { name: 'Wishes & Ucapan', description: 'Guestbook tulisan', icon: <Heart className="w-4 h-4" /> },
  song_request: { name: 'Song Request', description: 'Cadangan lagu tetamu', icon: <Music className="w-4 h-4" /> },
  live_wall: { name: 'Live Wall (Paparan Dewan)', description: 'Paparan langsung di TV/projektor', icon: <Tv className="w-4 h-4" /> },
  angpao: { name: 'Digital Angpao', description: 'Sumbangan digital', icon: <CreditCard className="w-4 h-4" /> },
}

const ORDER = ['rsvp', 'seating', 'menu', 'wishes', 'photobooth', 'audio_guestbook', 'video_guestbook', 'song_request', 'live_wall', 'angpao']

export default function ModulesWidget({ eventId }: ModulesWidgetProps) {
  const [modules, setModules] = useState<ModuleState[]>([])
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      fetch(`/api/events/${eventId}`, { cache: 'no-store', signal: controller.signal }).then(async r => {
        const d = await r.json()
        if (!r.ok) throw new Error(d.error)
        return d.event as { isPremium?: boolean; event_modules?: ModuleState[] }
      }),
    ]).then(([event]) => {
      setIsPremium(event.isPremium === true)
      const sorted = [...(event.event_modules || [])].sort((a, b) => ORDER.indexOf(a.module_type) - ORDER.indexOf(b.module_type))
      setModules(sorted)
    }).catch(err => { if (!controller.signal.aborted) setError(err.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [eventId])

  const toggle = async (module_type: string, currentEnabled: boolean) => {
    const next = !currentEnabled
    setModules(prev => prev.map(m => m.module_type === module_type ? { ...m, is_enabled: next } : m))
    setSaving(true); setError(''); setSavedMsg('')
    try {
      const response = await fetch(`/api/events/${eventId}/modules`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module_type, is_enabled: next }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setSavedMsg(`${MODULE_META[module_type]?.name || module_type} ${next ? 'diaktifkan' : 'dimatikan'}.`)
    } catch (err) {
      // Revert on error.
      setModules(prev => prev.map(m => m.module_type === module_type ? { ...m, is_enabled: currentEnabled } : m))
      setError(err instanceof Error ? err.message : 'Gagal mengemas kini')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-white/60 text-sm">Memuatkan modul...</p>

  return (
    <GlassCard variant="dark" glow="indigo" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-400" /> Modul Acara</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${isPremium ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
          {isPremium ? '💎 Premium' : '🎉 Free'}
        </span>
      </div>

      <p className="text-white/60 text-sm">Aktifkan ciri yang anda perlukan untuk majlis ini. Modul premium memerlukan langganan aktif.</p>

      {error && <p role="alert" className="text-rose-300 text-sm">{error}</p>}
      {savedMsg && <p role="status" className="text-emerald-300 text-sm">{savedMsg}</p>}
      {saving && <p className="text-white/40 text-xs flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Menyimpan...</p>}

      <div className="space-y-2">
        {modules.map(m => {
          const meta = MODULE_META[m.module_type]
          if (!meta) return null
          const isPremiumModule = !FREE_MODULES.has(m.module_type)
          const locked = isPremiumModule && !isPremium && !m.is_enabled
          return (
            <div key={m.module_type} className={`flex items-center gap-3 p-3 rounded-xl border ${m.is_enabled ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/10'} ${locked ? 'opacity-70' : ''}`}>
              <div className="p-2 rounded-lg bg-white/10 shrink-0">
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium text-sm">{meta.name}</p>
                  {isPremiumModule && <Lock className="w-3 h-3 text-amber-400" />}
                </div>
                <p className="text-white/50 text-xs">{meta.description}</p>
              </div>
              <button
                onClick={() => toggle(m.module_type, m.is_enabled)}
                disabled={saving}
                className={`shrink-0 w-12 h-7 rounded-full transition-colors ${m.is_enabled ? 'bg-emerald-500' : 'bg-white/20'} disabled:opacity-50`}
                title={m.is_enabled ? 'Matikan modul' : (locked ? 'Perlu Premium' : 'Aktifkan modul')}
                aria-pressed={m.is_enabled}
              >
                <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${m.is_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          )
        })}
      </div>

      {!isPremium && (
        <div className="pt-3 border-t border-white/10">
          <p className="text-amber-300 text-xs">
            ⚡ Naik taraf ke <strong>Premium RM159</strong> untuk aktifkan modul Audio/Video Guestbook, Song Request, Live Wall, Digital Angpao & Google Drive.
          </p>
        </div>
      )}
    </GlassCard>
  )
}