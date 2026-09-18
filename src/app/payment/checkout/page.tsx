"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import GlassCard from "@/components/ui/GlassCard"
import { CreditCard, Shield, Zap, CheckCircle } from "lucide-react"

const PRODUCT_PRICE = 159
const PRODUCT_NAME = 'Beasy.my All-In-1 Event Package'

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const { data: session, status: sessionStatus } = useSession()
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Gagal mencipta bil')
      }

      if (typeof data.billUrl !== 'string' || !data.paymentId) throw new Error('Rujukan pembayaran tidak sah')
      const paymentUrl = new URL(data.billUrl)
      if (paymentUrl.protocol !== 'https:' || !['toyyibpay.com', 'dev.toyyibpay.com'].includes(paymentUrl.hostname)) throw new Error('URL pembayaran tidak sah')
      // Redirect only after the server confirms durable order storage.
      window.location.href = data.billUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        {/* Product Summary */}
        <GlassCard variant="dark" glow="indigo">
          <div className="p-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{PRODUCT_NAME}</h1>
            <p className="text-white/60 text-sm mb-6">Platform event digital serba lengkap</p>

            <div className="space-y-3 mb-6">
              {[
                'Event Portal Custom',
                'RSVP & QR Management',
                'Photo Wall & Audio Guestbook',
                'Google Drive Integration',
                'Analytics Dashboard',
                'PWA Mobile App',
                'Lifetime Updates',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-white/80 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/60">Harga</span>
                <span className="text-3xl font-bold text-white">RM{PRODUCT_PRICE}</span>
              </div>
              <p className="text-white/40 text-xs line-through">RM{PRODUCT_PRICE * 3} (nilai sebenar)</p>
            </div>
          </div>
        </GlassCard>

        {/* Payment Form */}
        <GlassCard variant="light" glow="rose">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Maklumat Pembayaran</h2>
            <p className="text-sm text-slate-600 mb-4">Log masuk diperlukan. Pembelian premium 1 tahun dikaitkan kepada akaun yang sedang log masuk; nama dan e-mel akaun digunakan untuk bil.</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Penuh</label>
                <input
                  type="text"
                  required
                  value={session?.user?.name || session?.user?.email || ''}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ahmad bin Ali"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={session?.user?.email || ''}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 backdrop-blur focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="ahmad@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading || sessionStatus !== 'authenticated'}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Bayar RM{PRODUCT_PRICE} Sekarang
                  </>
                )}
              </button>
            </form>
            {sessionStatus === 'unauthenticated' && <a href="/auth/signin?callbackUrl=%2Fpayment%2Fcheckout" className="block mt-4 text-indigo-700 underline">Log masuk untuk membayar</a>}

            <div className="mt-6 flex items-center justify-center gap-4 text-white/60 text-xs">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>Aktif selepas pengesahan</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
