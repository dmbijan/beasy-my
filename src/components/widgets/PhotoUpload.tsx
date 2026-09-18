"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Camera, Upload, Frame } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { uploadGuestFile } from '@/lib/guest-upload'
import { storyTemplates } from '@/lib/gallery-customization'
import StoryFrame from '@/components/widgets/StoryFrame'

interface PhotoUploadProps { eventId?: string; eventSlug?: string; plan?: string; storyTemplateIds?: string[] }

const CAMERA_FILTERS = [
  { id: 'none', label: 'Asal', css: 'none' },
  { id: 'vintage', label: 'Vintage', css: 'sepia(0.4) contrast(0.9) brightness(1.05)' },
  { id: 'bw', label: 'B&W', css: 'grayscale(1)' },
  { id: 'warm', label: 'Warm', css: 'sepia(0.2) saturate(1.2) brightness(1.05)' },
  { id: 'cool', label: 'Cool', css: 'saturate(0.85) hue-rotate(15deg)' },
  { id: 'vivid', label: 'Vivid', css: 'saturate(1.5) contrast(1.1)' },
]

export default function PhotoUpload({ eventId, eventSlug, plan = 'free', storyTemplateIds }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<{ url: string; filter: string; frameId: string | null }[]>([])
  const urls = useRef<string[]>([])
  const busy = useRef(false)
  const input = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('none')
  const [frameId, setFrameId] = useState<string | null>(null)
  const isFree = plan === 'free'

  // Only show frames the host has enabled (or all if not specified).
  const availableFrames = storyTemplateIds && storyTemplateIds.length > 0
    ? storyTemplates.filter(t => storyTemplateIds.includes(t.id))
    : storyTemplates

  const activeFrame = storyTemplates.find(t => t.id === frameId)

  useEffect(() => () => { urls.current.forEach(URL.revokeObjectURL); urls.current = [] }, [])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || busy.current) return
    busy.current = true
    setUploading(true)
    setUploaded(false)
    setError(null)
    try {
      await uploadGuestFile(file, 'photo', eventId, eventSlug)
      const preview = URL.createObjectURL(file)
      urls.current.push(preview)
      setPhotos(previous => [{ url: preview, filter, frameId }, ...previous])
      setUploaded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat naik gambar.')
    } finally {
      busy.current = false
      setUploading(false)
    }
  }

  return (
    <GlassCard variant="light" glow="rose" className="space-y-5">
      <div className="text-center">
        <Camera className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white">Kongsi Foto Majlis</h3>
        <p className="text-sm text-white/60 mt-2">Foto dihantar ke Google Drive tuan rumah jika sambungan tersedia.</p>
      </div>

      {/* Guest camera filters */}
      <div>
        <p className="text-xs text-white/50 mb-2 text-center">Filter Kamera</p>
        <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
          {CAMERA_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === f.id ? 'bg-rose-500/30 border border-rose-500/50 text-rose-300' : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Story template frames */}
      <div>
        <p className="text-xs text-white/50 mb-2 text-center flex items-center justify-center gap-1">
          <Frame className="w-3 h-3" /> Story Frame
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFrameId(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              frameId === null ? 'bg-rose-500/30 border border-rose-500/50 text-rose-300' : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
            }`}
          >
            Tiada
          </button>
          {availableFrames.map(f => (
            <button
              key={f.id}
              onClick={() => setFrameId(f.id)}
              className={`shrink-0 flex flex-col items-center px-2 py-1.5 rounded-xl text-xs transition-all border ${
                frameId === f.id ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <span className="text-lg">{f.emoji}</span>
              <span className="text-[10px]">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" aria-label="Pilih foto majlis" />
      <button onClick={() => input.current?.click()} disabled={uploading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white disabled:opacity-50">
        {uploading ? <Upload className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
        {uploading ? 'Memuat naik...' : 'Pilih / Ambil Foto'}
      </button>
      <p className="text-xs text-white/50 text-center">JPEG, PNG atau WebP · Maksimum 10MB</p>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      {uploaded && <p role="status" className="text-sm text-emerald-300">Foto berjaya dimuat naik ke Drive.</p>}
      {photos.length > 0 && <>
        <p className="text-xs text-white/60">Pratonton foto yang anda muat naik dalam sesi ini (bukan galeri semua tetamu).</p>
        <div className="grid grid-cols-3 gap-2">{photos.map((photo) => {
          const frame = storyTemplates.find(t => t.id === photo.frameId)
          return (
            <div key={photo.url} className="relative aspect-square overflow-hidden rounded-xl">
              <img src={photo.url} alt="Foto yang berjaya dimuat naik" className="w-full h-full object-cover" style={{ filter: photo.filter }} />
              {frame && (
                <StoryFrame frameId={frame.id} className="absolute inset-0 w-full h-full pointer-events-none" />
              )}
              {isFree && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/70 text-[10px] font-semibold tracking-wider px-1 py-0.5 rounded bg-black/30 backdrop-blur-sm">Beasy.my</span>
                </div>
              )}
            </div>
          )
        })}</div>
        {isFree && <p className="text-xs text-white/40 text-center">Watermark Beasy.my akan dikeluarkan pada pelan Premium.</p>}
      </>}
    </GlassCard>
  )
}
