"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Cloud, Zap, CheckCircle, ArrowRight } from 'lucide-react'
import GlassCard from "@/components/ui/GlassCard"

interface GoogleDrivePaywallProps {
  eventId: string
  onConnected?: () => void
}

export default function GoogleDrivePaywall({ eventId, onConnected }: GoogleDrivePaywallProps) {
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const [connected, setConnected] = useState(false)

  async function handleConnect() {
    setChecking(true)
    setError('')

    try {
      // Check if user needs to login or pay
      const response = await fetch('/api/drive/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.requiresAuth) {
          // Redirect to login
          window.location.href = '/auth/signin'
          return
        }
        throw new Error(data.error || 'Gagal menyemak akses')
      }

      if (data.isPremium) {
        if (data.hasDrive) {
          setConnected(true)
          onConnected?.()
        } else {
          await signIn('google', { callbackUrl: window.location.href })
        }
      } else {
        // User needs to upgrade to premium
        // Redirect to payment page
        window.location.href = `/payment/checkout?eventId=${encodeURIComponent(eventId)}`
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setChecking(false)
    }
  }

  return (
    <GlassCard variant="dark" glow="purple">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
          <Cloud className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Google Drive Integration</h3>
        <p className="text-sm text-white/60">Simpan semua gambar & audio ke Google Drive secara automatik</p>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
        {[
          'Auto-save setiap upload',
          'Akses fail dari mana-mana',
          'Backup selamat',
          'Share mudah dengan tetamu',
        ].map((feature) => (
          <div key={feature} className="flex items-center gap-2 text-white/80 text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/60 text-sm">Pelan Premium</span>
          <span className="text-2xl font-bold text-white">RM159</span>
        </div>
        <p className="text-white/40 text-xs">Akses Premium selama satu tahun</p>
      </div>

      {/* Connect Button */}
      <button
        onClick={handleConnect}
        disabled={checking}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
      >
        {checking ? (
          <>
            <Cloud className="w-5 h-5 animate-spin" />
            <span>Memeriksa...</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            <span>{connected ? 'Google Drive telah disambungkan' : 'Sambungkan Google Drive'}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {error && (
        <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
      )}

      {/* Info */}
      <p className="mt-4 text-white/40 text-xs text-center">
        RSVP dan ucapan percuma. Muat naik media memerlukan Premium dan sambungan Drive hos.
      </p>
    </GlassCard>
  )
}
