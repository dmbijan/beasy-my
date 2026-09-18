"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import GlassCard from "@/components/ui/GlassCard"
import { 
  QrCode, 
  Camera, 
  CheckCircle, 
  XCircle, 
  Loader2,
  ScanLine
} from "lucide-react"
import { cn } from "@/lib/utils"

interface QRScannerProps {
  eventId: string
  onCheckInSuccess?: (guestName: string) => void
  className?: string
}

type QRDetector = { detect: (source: HTMLVideoElement) => Promise<{ rawValue: string }[]> }
type QRDetectorConstructor = {
  new(options: { formats: string[] }): QRDetector
  getSupportedFormats?: () => Promise<string[]>
}

export default function QRScanner({ eventId, onCheckInSuccess, className }: QRScannerProps) {
  const [scanning, setScanning] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [result, setResult] = useState<{ success: boolean; guestName?: string; message: string } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const scanGeneration = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const busyRef = useRef(false)
  const mountedRef = useRef(true)
  const [starting, setStarting] = useState(false)
  const [manualCode, setManualCode] = useState('')

  // Stop camera
  const stopCamera = useCallback(() => {
    scanGeneration.current += 1
    if (timerRef.current) clearTimeout(timerRef.current)
    streamRef.current?.getTracks().forEach(track => track.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    if (mountedRef.current) { setScanning(false); setStarting(false) }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      stopCamera()
    }
  }, [stopCamera])

  useEffect(() => { stopCamera(); setResult(null); setManualCode('') }, [eventId, stopCamera])

  // Process QR code check-in
  const handleScanQR = async (qrCodeHash: string) => {
    qrCodeHash = qrCodeHash.trim()
    if (!qrCodeHash || busyRef.current) return
    stopCamera()
    if (!/^[A-Za-z0-9_-]{10,200}$/.test(qrCodeHash)) {
      setResult({ success: false, message: 'Kod QR tidak sah. Gunakan kod daripada pengesahan RSVP.' })
      return
    }
    busyRef.current = true
    setCheckingIn(true)
    setResult(null)

    try {
      const response = await fetch('/api/rsvps/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          qrCodeHash,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.success !== true) {
        throw new Error(data.error || 'Check-in gagal')
      }

      if (!mountedRef.current) return
      setResult({
        success: true,
        guestName: data.guestName,
        message: data.message,
      })

      onCheckInSuccess?.(data.guestName)
    } catch (error) {
      if (mountedRef.current) setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Ralat semasa check-in',
      })
    } finally {
      busyRef.current = false
      if (mountedRef.current) setCheckingIn(false)
    }
  }

  const startCamera = async () => {
    if (starting || busyRef.current) return
    stopCamera()
    const generation = scanGeneration.current
    setStarting(true)
    setResult(null)
    try {
      const Detector = (globalThis as typeof globalThis & { BarcodeDetector?: QRDetectorConstructor }).BarcodeDetector
      if (!Detector || (Detector.getSupportedFormats && !(await Detector.getSupportedFormats()).includes('qr_code'))) {
        throw new Error('Imbasan QR kamera tidak disokong pelayar ini. Gunakan kod manual di bawah.')
      }
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Kamera tidak tersedia. Gunakan HTTPS atau kod manual.')
      const detector = new Detector({ formats: ['qr_code'] })
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (!mountedRef.current || generation !== scanGeneration.current) { stream.getTracks().forEach(track => track.stop()); return }
      streamRef.current = stream
      const video = videoRef.current
      if (!video) throw new Error('Paparan kamera tidak tersedia. Gunakan kod manual.')
      video.srcObject = stream
      await video.play()
      if (generation !== scanGeneration.current) return
      setScanning(true)
      setStarting(false)
      const decode = async () => {
        if (generation !== scanGeneration.current || !mountedRef.current) return
        try {
          if (video.readyState >= 2) {
            const codes = await detector.detect(video)
            if (generation !== scanGeneration.current) return
            const code = codes.find(item => item.rawValue)?.rawValue
            if (code) { await handleScanQR(code); return }
          }
          timerRef.current = setTimeout(decode, 250)
        } catch {
          stopCamera()
          if (mountedRef.current) setResult({ success: false, message: 'Penyahkod QR gagal. Gunakan kod manual di bawah.' })
        }
      }
      void decode()
    } catch (err) {
      if (generation !== scanGeneration.current || !mountedRef.current) return
      stopCamera()
      setResult({ success: false, message: err instanceof Error ? err.message : 'Gagal mengakses kamera. Gunakan kod manual.' })
    }
  }

  return (
    <GlassCard variant="light" glow="emerald" className={cn("space-y-6", className)}>
      <div className="text-center">
        <QrCode className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">QR Check-in</h3>
        <p className="text-white/60 text-sm">
          Scan kod QR tetamu untuk mengesahkan kehadiran
        </p>
      </div>

      {/* Camera View */}
      <div className="relative rounded-2xl overflow-hidden bg-black/50 aspect-video flex items-center justify-center">
        <video ref={videoRef} autoPlay playsInline muted className={cn("w-full h-full object-cover", !scanning && "hidden")} />
        {!scanning && !result && (
          <button
            onClick={startCamera}
            disabled={starting || checkingIn}
            className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
          >
            <Camera className="w-8 h-8 text-white/60" />
            <span className="text-sm font-medium text-white/80">{starting ? 'Membuka kamera...' : checkingIn ? 'Memproses check-in...' : 'Mula Scan QR'}</span>
          </button>
        )}

        {scanning && (
          <>
            {/* Scanning overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-black/40" />
              <motion.div
                className="absolute left-4 right-4 h-0.5 bg-emerald-400/80 shadow-glass"
                animate={{ top: ["10%", "90%", "10%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-400/60 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-400/60 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-400/60 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-400/60 rounded-br-lg" />
            </div>
            
            {/* Stop button */}
            <button
              onClick={stopCamera}
              className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-red-500/80 text-white text-sm font-medium hover:bg-red-500 transition-all"
            >
              Berhenti Scan
            </button>
          </>
        )}

        {result && (
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            {result.success ? (
              <CheckCircle className="w-16 h-16 text-emerald-400" />
            ) : (
              <XCircle className="w-16 h-16 text-rose-400" />
            )}
            <div>
              <p className={`text-lg font-bold ${result.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.success ? 'Check-in Berjaya! ✅' : 'Check-in Gagal ❌'}
              </p>
              {result.guestName && (
                <p className="text-white/80 mt-1">{result.guestName}</p>
              )}
              <p className="text-white/60 text-sm mt-2">{result.message}</p>
            </div>
            <button
              onClick={() => {
                setResult(null)
                startCamera()
              }}
              className="px-6 py-2 rounded-xl bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/40 transition-all"
            >
              Scan Lagi
            </button>
          </div>
        )}
      </div>

      {/* Manual fallback remains usable when BarcodeDetector is unavailable. */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white/80">
          Kod manual daripada pengesahan RSVP (peka huruf besar/kecil):
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void handleScanQR(manualCode) } }}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            maxLength={200}
            aria-label="Kod manual RSVP"
            placeholder="Tampal token QR tetamu"
            className="flex-1 px-4 py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
          />
          <button
            onClick={() => handleScanQR(manualCode)}
            disabled={checkingIn || !manualCode.trim()}
            className="px-6 py-3 rounded-xl bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 font-medium hover:bg-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {checkingIn ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ScanLine className="w-5 h-5" />
            )}
            {checkingIn ? 'Memproses...' : 'Check-in'}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-white/10">
        <a
          href={`/api/rsvps/checkin?eventId=${eventId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 font-medium hover:bg-blue-500/30 transition-all text-sm"
        >
          <CheckCircle className="w-5 h-5" />
          Lihat Senarai Yang Sudah Check-in
        </a>
      </div>
    </GlassCard>
  )
}
