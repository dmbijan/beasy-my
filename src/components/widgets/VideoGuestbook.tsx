"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Video, Square, Loader2, RotateCcw } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { resolveGuestUploadSlug, uploadGuestFile } from '@/lib/guest-upload'

interface VideoGuestbookProps { eventId?: string; eventSlug?: string }

const MAX_SECONDS = 120 // 2-minute guest video limit

function formatTime(total: number) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function VideoGuestbook({ eventId, eventSlug }: VideoGuestbookProps) {
  const [recording, setRecording] = useState(false)
  const [starting, setStarting] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recorder = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const blob = useRef<Blob | null>(null)
  const url = useRef<string | null>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const mounted = useRef(true)
  const busy = useRef(false)
  const previewRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      if (timer.current) clearInterval(timer.current)
      if (recorder.current?.state === 'recording') recorder.current.stop()
      stream.current?.getTracks().forEach(track => track.stop())
      if (url.current) URL.revokeObjectURL(url.current)
    }
  }, [])

  // Show live camera preview while recording.
  useEffect(() => {
    if (previewRef.current && stream.current) {
      previewRef.current.srcObject = stream.current
      previewRef.current.play().catch(() => {})
    }
  }, [recording])

  function stopRecording() {
    if (timer.current) clearInterval(timer.current)
    if (recorder.current?.state === 'recording') recorder.current.stop()
  }

  async function startRecording() {
    if (busy.current || recorder.current?.state === 'recording') return
    busy.current = true
    setStarting(true)
    setError(null)
    setUploaded(false)
    try {
      resolveGuestUploadSlug(eventId, eventSlug)
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
        throw new Error('Rakaman tidak disokong pelayar ini. Gunakan pelayar moden dengan HTTPS.')
      }
      const mime = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'].find(type => MediaRecorder.isTypeSupported(type))
      if (!mime) throw new Error('Tiada format rakaman video yang disokong pelayar ini.')
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true })
      if (!mounted.current) { media.getTracks().forEach(track => track.stop()); return }
      stream.current = media
      const current = new MediaRecorder(media, { mimeType: mime })
      recorder.current = current
      const chunks: Blob[] = []
      if (url.current) URL.revokeObjectURL(url.current)
      url.current = null
      blob.current = null
      setVideoUrl(null)
      current.ondataavailable = e => { if (e.data.size) chunks.push(e.data) }
      current.onstop = () => {
        if (timer.current) clearInterval(timer.current)
        media.getTracks().forEach(track => track.stop())
        stream.current = null
        if (!mounted.current) return
        setRecording(false)
        const result = new Blob(chunks, { type: current.mimeType })
        if (!result.size) { setError('Rakaman kosong. Sila cuba lagi.'); return }
        blob.current = result
        url.current = URL.createObjectURL(result)
        setVideoUrl(url.current)
      }
      current.onerror = () => { stopRecording(); setError('Rakaman gagal. Sila cuba lagi.') }
      current.start(1000)
      setRecording(true)
      setSeconds(0)
      let elapsed = 0
      timer.current = setInterval(() => {
        elapsed += 1
        setSeconds(elapsed)
        if (elapsed >= MAX_SECONDS) stopRecording()
      }, 1000)
    } catch (err) {
      stream.current?.getTracks().forEach(track => track.stop())
      stream.current = null
      if (mounted.current) setError(err instanceof Error ? err.message : 'Gagal mengakses kamera.')
    } finally {
      busy.current = false
      if (mounted.current) setStarting(false)
    }
  }

  function discardRecording() {
    if (busy.current) return
    if (url.current) URL.revokeObjectURL(url.current)
    url.current = null
    blob.current = null
    setVideoUrl(null)
    setUploaded(false)
    setError(null)
  }

  async function uploadRecording() {
    if (!blob.current || busy.current || recording) return
    busy.current = true
    setLoading(true)
    setError(null)
    setUploaded(false)
    try {
      const mime = blob.current.type.split(';')[0]
      const extension = mime === 'video/mp4' ? 'mp4' : mime === 'video/quicktime' ? 'mov' : 'webm'
      const file = new File([blob.current], `video.${extension}`, { type: mime })
      await uploadGuestFile(file, 'video', eventId, eventSlug)
      if (mounted.current) setUploaded(true)
    } catch (err) {
      if (mounted.current) setError(err instanceof Error ? err.message : 'Gagal menyimpan video.')
    } finally {
      busy.current = false
      if (mounted.current) setLoading(false)
    }
  }

  return (
    <GlassCard variant="light" glow="violet" className="space-y-5">
      <div className="text-center">
        <Video className="w-12 h-12 text-violet-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white">Video Guestbook</h3>
        <p className="text-sm text-white/60 mt-2">Rakam ucapan video pendek (maksimum 2 minit), kemudian tekan Simpan.</p>
      </div>

      {recording && (
        <div className="space-y-3">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-violet-500/30">
            <video ref={previewRef} muted playsInline className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/80 text-white text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {formatTime(seconds)}
            </div>
          </div>
          <button
            onClick={stopRecording}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-all"
          >
            <Square className="w-5 h-5" />
            Hentikan Rakaman ({formatTime(MAX_SECONDS - seconds)})
          </button>
        </div>
      )}

      {!recording && !videoUrl && (
        <button
          onClick={startRecording}
          disabled={starting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white disabled:opacity-50"
        >
          {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
          {starting ? 'Membuka kamera...' : 'Mulakan Rakaman'}
        </button>
      )}

      {!recording && videoUrl && (
        <div className="space-y-3">
          <video src={videoUrl} controls playsInline className="w-full aspect-video rounded-2xl bg-black/40" />
          <div className="flex gap-2">
            <button
              onClick={uploadRecording}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
              {loading ? 'Menyimpan...' : 'Simpan ke Gallery'}
            </button>
            <button
              onClick={discardRecording}
              disabled={loading}
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <p className="text-xs text-white/50 text-center">Video dihantar ke Google Drive tuan rumah jika sambungan tersedia.</p>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      {uploaded && <p role="status" className="text-sm text-emerald-300">Video berjaya disimpan.</p>}
    </GlassCard>
  )
}
