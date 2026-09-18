"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Mic, Square, Cloud, Loader2 } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import { resolveGuestUploadSlug, uploadGuestFile } from '@/lib/guest-upload'

interface AudioGuestbookProps { eventId?: string; eventSlug?: string }

export default function AudioGuestbook({ eventId, eventSlug }: AudioGuestbookProps) {
  const [recording, setRecording] = useState(false)
  const [starting, setStarting] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
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
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') throw new Error('Rakaman tidak disokong pelayar ini. Gunakan pelayar moden dengan HTTPS.')
      const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'].find(type => MediaRecorder.isTypeSupported(type))
      if (!mime) throw new Error('Tiada format rakaman audio yang disokong pelayar ini.')
      const media = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!mounted.current) { media.getTracks().forEach(track => track.stop()); return }
      stream.current = media
      const current = new MediaRecorder(media, { mimeType: mime })
      recorder.current = current
      const chunks: Blob[] = []
      if (url.current) URL.revokeObjectURL(url.current)
      url.current = null
      blob.current = null
      setAudioUrl(null)
      current.ondataavailable = e => { if (e.data.size) chunks.push(e.data) }
      current.onstop = () => {
        if (timer.current) clearInterval(timer.current)
        media.getTracks().forEach(track => track.stop())
        if (!mounted.current) return
        setRecording(false)
        const result = new Blob(chunks, { type: current.mimeType })
        if (!result.size) { setError('Rakaman kosong. Sila cuba lagi.'); return }
        blob.current = result
        url.current = URL.createObjectURL(result)
        setAudioUrl(url.current)
      }
      current.onerror = () => { stopRecording(); setError('Rakaman gagal. Sila cuba lagi.') }
      current.start(1000)
      setRecording(true)
      setSeconds(0)
      let elapsed = 0
      timer.current = setInterval(() => {
        elapsed += 1
        setSeconds(elapsed)
        if (elapsed >= 180) stopRecording()
      }, 1000)
    } catch (err) {
      stream.current?.getTracks().forEach(track => track.stop())
      if (mounted.current) setError(err instanceof Error ? err.message : 'Gagal mengakses mikrofon.')
    } finally {
      busy.current = false
      if (mounted.current) setStarting(false)
    }
  }

  async function uploadRecording() {
    if (!blob.current || busy.current || recording) return
    busy.current = true
    setLoading(true)
    setError(null)
    setUploaded(false)
    try {
      const mime = blob.current.type.split(';')[0]
      const extension = mime === 'audio/mp4' ? 'm4a' : mime === 'audio/ogg' ? 'ogg' : 'webm'
      const file = new File([blob.current], `ucapan.${extension}`, { type: mime })
      await uploadGuestFile(file, 'audio', eventId, eventSlug)
      if (mounted.current) setUploaded(true)
    } catch (err) {
      if (mounted.current) setError(err instanceof Error ? err.message : 'Gagal menyimpan audio.')
    } finally {
      busy.current = false
      if (mounted.current) setLoading(false)
    }
  }

  return (
    <GlassCard variant="light" glow="indigo" className="space-y-5">
      <div className="text-center">
        <Mic className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white">Audio Guestbook</h3>
        <p className="text-sm text-white/60 mt-2">Rakam ucapan (maksimum 3 minit), kemudian tekan Simpan ke Drive.</p>
      </div>
      <button onClick={recording ? stopRecording : startRecording} disabled={starting || loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 text-white disabled:opacity-50">
        {recording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        {starting ? 'Membuka mikrofon...' : recording ? `Hentikan rakaman (${seconds}s)` : 'Rakam Ucapan'}
      </button>
      {audioUrl && !recording && <div className="space-y-3">
        <audio src={audioUrl} controls className="w-full" />
        <button onClick={uploadRecording} disabled={loading || uploaded}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/20 text-emerald-300 disabled:opacity-50">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Cloud className="w-5 h-5" />}
          {loading ? 'Memuat naik...' : uploaded ? 'Telah disimpan' : 'Simpan ke Drive'}
        </button>
      </div>}
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      {uploaded && <p role="status" className="text-sm text-emerald-300">Audio berjaya disimpan ke Google Drive.</p>}
      <p className="text-xs text-white/50">Rakaman kekal pada peranti sehingga muat naik disahkan. Sambungan Drive tuan rumah diperlukan.</p>
    </GlassCard>
  )
}
