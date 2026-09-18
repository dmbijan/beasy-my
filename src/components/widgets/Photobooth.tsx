"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Camera, Square, Loader2, Download } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'

interface PhotoboothProps {
  eventId?: string
  eventSlug?: string
  onCapture?: (strips: string[]) => void
}

// Photobooth 3-shot strip — guests take 3 photos in a row, rendered as a
// classic vertical photo strip (Galeri Kawen "Raja Sehari" style).

export default function Photobooth({ eventId, eventSlug, onCapture }: PhotoboothProps) {
  const [shots, setShots] = useState<string[]>([])
  const [capturing, setCapturing] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const shotIndexRef = useRef(0)
  const busyRef = useRef(false)
  const mountedRef = useRef(true)

  const TOTAL_SHOTS = 3

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  async function startCamera() {
    if (busyRef.current) return
    busyRef.current = true
    setError(null)
    setShots([])
    setDone(false)
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Kamera tidak disokong pelayar ini.')
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (!mountedRef.current) { stream.getTracks().forEach(t => t.stop()); return }
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => {})
      }
      shotIndexRef.current = 0
      startCountdown()
    } catch (err) {
      if (mountedRef.current) setError(err instanceof Error ? err.message : 'Gagal membuka kamera.')
    } finally {
      busyRef.current = false
    }
  }

  function startCountdown() {
    let value = 3
    setCountdown(value)
    const interval = setInterval(() => {
      value -= 1
      if (!mountedRef.current) { clearInterval(interval); return }
      if (value <= 0) {
        clearInterval(interval)
        setCountdown(null)
        captureShot()
      } else {
        setCountdown(value)
      }
    }, 1000)
  }

  function captureShot() {
    const video = videoRef.current
    if (!video || !streamRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 480
    canvas.height = video.videoHeight || 640
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setShots(prev => [...prev, dataUrl])
    shotIndexRef.current += 1

    if (shotIndexRef.current < TOTAL_SHOTS) {
      // brief pause between shots, then next countdown
      setTimeout(() => {
        if (mountedRef.current) startCountdown()
      }, 800)
    } else {
      // done
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null
      if (videoRef.current) videoRef.current.srcObject = null
      setDone(true)
      if (onCapture) onCapture(shots)
    }
  }

  const downloadStrip = () => {
    if (!shots.length) return
    // Render strip to a canvas (vertical concatenation)
    const stripCanvas = document.createElement('canvas')
    const img = new Image()
    img.onload = () => {
      const width = 400
      const height = Math.round((img.height / img.width) * width) * TOTAL_SHOTS
      stripCanvas.width = width
      stripCanvas.height = height
      const ctx = stripCanvas.getContext('2d')
      if (!ctx) return
      const shotHeight = height / TOTAL_SHOTS
      for (let i = 0; i < TOTAL_SHOTS; i++) {
        const shotImg = new Image()
        shotImg.onload = () => {
          ctx.drawImage(shotImg, 0, i * shotHeight, width, shotHeight)
          if (i === TOTAL_SHOTS - 1) {
            const url = stripCanvas.toDataURL('image/jpeg', 0.9)
            const a = document.createElement('a')
            a.href = url
            a.download = `photobooth-${Date.now()}.jpg`
            a.click()
          }
        }
        shotImg.src = shots[i]
      }
    }
    img.src = shots[0]
  }

  return (
    <GlassCard variant="light" glow="violet" className="space-y-5">
      <div className="text-center">
        <Camera className="w-12 h-12 text-violet-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white">Photobooth 3-Shot</h3>
        <p className="text-sm text-white/60 mt-2">Ambil 3 gambar berturut-turut untuk strip foto klasik.</p>
      </div>

      {/* Camera preview */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black/40 border border-violet-500/30">
        <video ref={videoRef} muted playsInline className="w-full h-full object-cover" />
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="text-6xl font-bold text-white">{countdown}</span>
          </div>
        )}
        {shots.length > 0 && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-violet-500/80 text-white text-xs font-semibold">
            {shots.length}/{TOTAL_SHOTS}
          </div>
        )}
      </div>

      {!streamRef.current && !done && (
        <button onClick={startCamera} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium">
          <Camera className="w-5 h-5" />
          Mulakan Photobooth
        </button>
      )}

      {capturing && <Loader2 className="w-5 h-5 animate-spin mx-auto text-white/60" />}

      {/* Photo strip result */}
      {done && shots.length === TOTAL_SHOTS && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white flex flex-col gap-2 max-w-[240px] mx-auto">
            {shots.map((shot, i) => (
              <img key={i} src={shot} alt={`Shot ${i + 1}`} className="w-full object-cover rounded-sm" />
            ))}
            <p className="text-center text-slate-600 text-xs font-mono mt-1">beasy.my photobooth</p>
          </div>
          <div className="flex gap-2">
            <button onClick={downloadStrip} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-300 hover:bg-violet-500/30 transition-all text-sm font-medium">
              <Download className="w-4 h-4" />
              Muat Turun Strip
            </button>
            <button onClick={() => { setShots([]); setDone(false); startCamera() }} className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white transition-all text-sm font-medium">
              Ambil Semula
            </button>
          </div>
        </div>
      )}

      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
    </GlassCard>
  )
}
