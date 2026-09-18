"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import GlassCard from "@/components/ui/GlassCard"
import { CheckCircle, ArrowRight, Home } from "lucide-react"

// Separate component that uses useSearchParams (must be wrapped in Suspense)
function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [billCode, setBillCode] = useState('')
  const [checking, setChecking] = useState(true)
  const [isPaid, setIsPaid] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const orderId = searchParams.get('orderId')
    const ref = searchParams.get('billcode') || searchParams.get('billCode')
    setIsPaid(false)
    setChecking(true)
    if (orderId) {
      setBillCode(orderId)
      checkPaymentStatus(`orderId=${encodeURIComponent(orderId)}`, controller.signal)
      return () => controller.abort()
    }
    if (ref) {
      setBillCode(ref)
      checkPaymentStatus(`billCode=${encodeURIComponent(ref)}`, controller.signal)
    } else {
      setBillCode('')
      setChecking(false)
    }
    return () => controller.abort()
  }, [searchParams])

  async function checkPaymentStatus(code: string, signal: AbortSignal) {
    try {
      const response = await fetch(`/api/payment/status?${code}`, { cache: 'no-store', signal })
      const data = await response.json()
      if (!signal.aborted && response.ok && data?.status === 'paid') {
        setIsPaid(true)
      }
    } catch (error) {
      console.error('Failed to check payment status:', error)
    } finally {
      if (!signal.aborted) setChecking(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center p-4">
      <GlassCard variant="dark" glow="emerald">
        <div className="p-8 max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            {isPaid ? <CheckCircle className="w-12 h-12 text-emerald-400" /> : <span className="text-3xl text-amber-300">…</span>}
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">{isPaid ? 'Pembayaran Berjaya!' : checking ? 'Menyemak Pembayaran' : 'Pembayaran Belum Disahkan'}</h1>
          <p className="text-white/60 mb-6">{isPaid ? 'Pembayaran telah disahkan oleh pelayan.' : 'Log masuk dengan akaun pembeli dan semak semula. Jika wang telah ditolak, jangan bayar sekali lagi sementara pengesahan diproses.'}</p>
          {!checking && !isPaid && <button onClick={() => window.location.reload()} className="text-amber-300 mb-4">Semak semula</button>}

          {billCode && (
            <div className="mb-6 p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/40 text-xs mb-1">Reference ID</p>
              <p className="text-white font-mono text-sm">{billCode}</p>
            </div>
          )}

          {checking && (
            <p className="text-white/60 text-sm mb-4">Semak status pembayaran...</p>
          )}

          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium flex items-center justify-center gap-2 hover:bg-emerald-500/30 transition-all"
            >
              Teruskan ke Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
            >
              <Home className="w-4 h-4" />
              Kembali ke Home
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

// Main component wrapped in Suspense for useSearchParams()
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900" />} >
      <PaymentSuccessContent />
    </Suspense>
  )
}
