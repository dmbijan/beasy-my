"use client"

import React, { useEffect, useState } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import { ShieldCheck, Check, X, Image as ImageIcon, Film, Mic, Loader2 } from 'lucide-react'

interface ModerationItem {
  id: string
  drive_file_id: string
  file_name: string
  mime_type: string
  status: 'pending' | 'approved' | 'rejected'
  uploader_name?: string
  created_at: string
}

interface MediaModerationProps { eventId: string }

export default function MediaModeration({ eventId }: MediaModerationProps) {
  const [media, setMedia] = useState<ModerationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    setError('')
    fetch(`/api/media/moderation?eventId=${eventId}`, { cache: 'no-store' })
      .then(async response => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        setMedia(data.media)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [eventId])

  const updateStatus = async (mediaId: string, status: 'approved' | 'rejected') => {
    setUpdatingId(mediaId)
    setError('')
    try {
      const response = await fetch('/api/media/moderation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, mediaId, status }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setMedia(prev => prev.map(m => m.id === mediaId ? { ...m, status } : m))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengemaskini')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = filter === 'all' ? media : media.filter(m => m.status === filter)
  const kindIcon = (mime: string) => mime.startsWith('image/') ? ImageIcon : mime.startsWith('video/') ? Film : Mic

  return (
    <GlassCard variant="dark" glow="emerald" className="space-y-4">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-400" />
        <h3 className="text-lg font-bold text-white">Moderasi Media</h3>
      </div>
      <p className="text-sm text-white/60">Semak dan luluskan foto/video/audio sebelum ia dipaparkan dalam galeri.</p>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filter === f ? 'bg-emerald-500/30 border border-emerald-500/50 text-emerald-300' : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
            }`}
          >
            {f === 'all' ? 'Semua' : f === 'pending' ? 'Menunggu' : f === 'approved' ? 'Diluluskan' : 'Ditolak'}
          </button>
        ))}
      </div>

      {loading ? <p className="text-white/60 text-sm">Memuatkan media...</p>
        : error ? <p role="alert" className="text-rose-300 text-sm">{error}</p>
        : !filtered.length ? <p className="text-white/60 text-sm">Tiada media dalam kategori ini.</p>
        : <div className="space-y-2 max-h-96 overflow-y-auto">
            {filtered.map(item => {
              const Icon = kindIcon(item.mime_type)
              return (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="p-2 rounded-lg bg-white/10">
                    <Icon className="w-5 h-5 text-white/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{item.file_name}</p>
                    <p className="text-xs text-white/50">{item.uploader_name || 'Tetamu'} · {new Date(item.created_at).toLocaleString('ms-MY')}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : item.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {item.status === 'approved' ? 'Lulus' : item.status === 'rejected' ? 'Tolak' : 'Menunggu'}
                  </span>
                  {item.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus(item.id, 'approved')}
                      disabled={updatingId === item.id}
                      className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-all disabled:opacity-50"
                      aria-label="Luluskan"
                    >
                      {updatingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    </button>
                  )}
                  {item.status !== 'rejected' && (
                    <button
                      onClick={() => updateStatus(item.id, 'rejected')}
                      disabled={updatingId === item.id}
                      className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-all disabled:opacity-50"
                      aria-label="Tolak"
                    >
                      {updatingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              )
            })}
          </div>}
    </GlassCard>
  )
}
