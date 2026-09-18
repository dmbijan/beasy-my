"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Send, User, MessageSquare, Sparkles } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"

interface Wish {
  id: string
  name: string
  message: string
  time: string
}

interface WishFormProps {
  eventId?: string
  onSuccess?: (data: any) => void
}

export default function WishForm({ eventId, onSuccess }: WishFormProps) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [wishes, setWishes] = useState<Wish[]>([])

  // Fetch wishes when component mounts
  React.useEffect(() => {
    if (eventId) {
      fetchWishes()
    }
  }, [eventId])

  async function fetchWishes() {
    try {
      const response = await fetch(`/api/wishes?eventId=${eventId}`)
      const data = await response.json()
      if (data.wishes) {
        setWishes(data.wishes.map((w: any) => ({
          id: w.id,
          name: w.guest_name,
          message: w.message,
          time: new Date(w.created_at).toLocaleDateString('ms-MY')
        })))
      }
    } catch (error) {
      console.error('Failed to fetch wishes:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          eventId, 
          guestName: name, 
          message 
        }),
      })

      if (!response.ok) {
        throw new Error('Gagal menghantar ucapan')
      }

      const data = await response.json()
      
      const newWish: Wish = {
        id: data.wish.id,
        name: name.trim(),
        message: message.trim(),
        time: "Baru sahaja",
      }
      
      setWishes([newWish, ...wishes])
      setSubmitted(true)
      setName("")
      setMessage("")
      onSuccess?.(newWish)
      
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      console.error("Failed to submit wish:", error)
      alert(error instanceof Error ? error.message : 'Gagal menghantar ucapan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard variant="light" glow="rose">
      <div className="text-center mb-6">
        <Heart className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">Ucapan & Doa</h3>
        <p className="text-sm text-white/60">{wishes.length} ucapan telah dihantar</p>
      </div>

      {/* Wishes List */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
        <AnimatePresence>
          {wishes.map((wish, index) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{wish.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-white truncate">{wish.name}</p>
                    <span className="text-xs text-white/40 flex-shrink-0">{wish.time}</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">"{wish.message}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-white/10" />
        <Sparkles className="w-4 h-4 text-amber-400" />
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Submit Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Nama Anda
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama anda"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/50 transition"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Ucapan & Doa
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-white/40" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis ucapan dan doa anda di sini..."
              rows={4}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/50 transition resize-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
            loading
              ? "bg-rose-500/30 cursor-not-allowed"
              : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
          }`}
        >
          {loading ? (
            <span>Menghantar...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Hantar Ucapan</span>
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-center"
          >
            <p className="text-emerald-300 font-medium">✓ Ucapan berjaya dihantar!</p>
            <p className="text-sm text-emerald-300/60">Terima kasih atas doa dan ucapan anda</p>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}
