"use client"

import { useState, useEffect } from 'react'
import GlassCard from "@/components/ui/GlassCard"
import { CreditCard, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react"

interface PaymentStatusProps {
  userEmail?: string
}

export default function PaymentStatusWidget({ userEmail }: PaymentStatusProps) {
  const [payment, setPayment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    fetchPaymentStatus(controller.signal)
    return () => controller.abort()
  }, [userEmail])

  async function fetchPaymentStatus(signal: AbortSignal) {
    setLoading(true)
    setPayment(null)
    setError('')
    try {
      const response = await fetch('/api/payment/status', { cache: 'no-store', signal })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Status pembayaran tidak tersedia')
      if (!signal.aborted) setPayment(data)
    } catch (error) {
      if (!signal.aborted) setError(error instanceof Error ? error.message : 'Status pembayaran tidak tersedia')
    } finally {
      if (!signal.aborted) setLoading(false)
    }
  }

  if (loading) {
    return (
      <GlassCard variant="light" glow="indigo">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
      </GlassCard>
    )
  }

  if (error) return <GlassCard variant="light" glow="amber"><p className="p-6 text-amber-300">{error}</p></GlassCard>

  if (payment?.status === 'paid') {
    return (
      <GlassCard variant="light" glow="emerald">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Pembayaran Berjaya</h3>
              <p className="text-sm text-white/60">Dibayar pada {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString('ms-MY') : '-'}</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-white/60">
              <span>Pakej</span>
              <span className="text-white">All-In-1 Event</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Amaun</span>
              <span className="text-white">RM{Number(payment.amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span>Status</span>
              <span className="text-emerald-400 font-medium">Dibayar ✓</span>
            </div>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard variant="light" glow={payment?.status === 'failed' ? 'rose' : 'amber'}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl ${payment?.status === 'failed' ? 'bg-rose-500/20' : 'bg-amber-500/20'}`}>
            {payment?.status === 'failed' ? (
              <XCircle className="w-6 h-6 text-rose-400" />
            ) : (
              <Clock className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">Pembayaran Belum Selesai</h3>
            <p className="text-sm text-white/60">
              {!payment ? 'Tiada rekod pembayaran' : payment.status === 'pending' ? 'Menunggu pengesahan pembayaran' : payment.status === 'refunded' ? 'Bayaran telah dipulangkan' : 'Pembayaran tidak berjaya'}
            </p>
          </div>
        </div>

        {!payment && (
          <p className="text-white/60 text-sm mb-4">
            Anda belum mempunyai rekod pembayaran. Daftar sekarang untuk akses penuh platform.
          </p>
        )}

        <a
          href="/payment/checkout"
          className="block w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-center hover:from-indigo-600 hover:to-purple-600 transition-all"
        >
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="w-4 h-4" />
            Bayar RM159 Sekarang
          </div>
        </a>
      </div>
    </GlassCard>
  )
}
