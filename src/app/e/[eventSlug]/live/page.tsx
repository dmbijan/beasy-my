"use client"

import React, { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Image as ImageIcon, Film, Volume2, ArrowLeft, Loader2 } from "lucide-react"

interface MediaItem {
  id: string
  name: string
  mimeType: string
  kind: "photo" | "video" | "audio"
  link: string
  thumbnail?: string
}

export default function LiveHallPage() {
  const params = useParams()
  const eventSlug = params?.eventSlug as string
  const [eventId, setEventId] = useState<string | null>(null)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Resolve eventId from slug via public event endpoint.
  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/events?slug=${encodeURIComponent(eventSlug)}`, { signal: controller.signal, cache: "no-store" })
      .then(r => r.json())
      .then(data => { if (data.event?.id) setEventId(data.event.id); else setError("Acara tidak dijumpai.") })
      .catch(() => { if (!controller.signal.aborted) setError("Gagal memuatkan acara.") })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [eventSlug])

  // Fetch media once eventId is known (requires host login).
  useEffect(() => {
    if (!eventId) return
    const controller = new AbortController()
    fetch(`/api/media/list?eventId=${eventId}`, { signal: controller.signal, cache: "no-store" })
      .then(async r => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || "Gagal memuatkan media.")
        setMedia(data.media || [])
      })
      .catch(err => { if (!controller.signal.aborted) setError(err.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [eventId])

  // Auto-rotate photos every 5 seconds.
  useEffect(() => {
    if (timer.current) clearInterval(timer.current)
    if (!playing || media.length === 0) return
    timer.current = setInterval(() => {
      setIndex(prev => (prev + 1) % media.length)
    }, 5000)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [playing, media.length])

  const photos = media.filter(m => m.kind === "photo")
  const current = media[index]

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur border-b border-white/10">
        <Link href={`/e/${eventSlug}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white transition">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Kembali</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </span>
          <button
            onClick={() => setPlaying(p => !p)}
            className="p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
            aria-label={playing ? "Jeda" : "Main"}
          >
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main display */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {loading && (
          <div className="flex items-center gap-3 text-white/60">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Memuatkan galeri...</span>
          </div>
        )}

        {!loading && error && (
          <div className="text-center">
            <p className="text-white/70 text-lg mb-4">{error}</p>
            <p className="text-white/40 text-sm">Login sebagai tuan rumah untuk melihat paparan dewan langsung.</p>
          </div>
        )}

        {!loading && !error && media.length === 0 && (
          <div className="text-center">
            <ImageIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Tiada media lagi.</p>
            <p className="text-white/40 text-sm">Foto dan video yang dimuat naik tetamu akan muncul di sini secara langsung.</p>
          </div>
        )}

        {!loading && !error && media.length > 0 && current && (
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-5xl"
            >
              {current.kind === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.link} alt={current.name} className="w-full h-[70vh] object-contain rounded-2xl mx-auto" />
              ) : current.kind === "video" ? (
                <video src={current.link} controls autoPlay muted className="w-full h-[70vh] object-contain rounded-2xl mx-auto" />
              ) : (
                <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                  <Volume2 className="w-16 h-16 text-white/50" />
                  <audio src={current.link} controls autoPlay className="w-full max-w-md" />
                </div>
              )}
              <div className="text-center mt-4">
                <p className="text-white/70 text-sm">{current.name}</p>
                <p className="text-white/40 text-xs">{index + 1} / {media.length}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Bottom thumbnails (photos only) */}
      {photos.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto py-2">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                onClick={() => { setIndex(media.indexOf(photo)); setPlaying(false) }}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${media.indexOf(photo) === index ? "border-white" : "border-transparent opacity-50 hover:opacity-100"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.thumbnail || photo.link} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
