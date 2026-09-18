"use client"

import React, { useState, useRef, useEffect } from "react"
import GlassCard from "@/components/ui/GlassCard"
import { Bot, Send, X, MessageCircle } from "lucide-react"

interface ChatAIProps {
  event: {
    title: string
    eventDate: Date
    venueName: string
    venueAddress: string
    dressCode?: string
    description?: string
    customization?: { groom?: string; bride?: string; welcomeMessage?: string }
  }
}

interface Message { role: 'ai' | 'guest'; text: string }

// Rule-based chatbot that answers guest questions from event data (no external API).
function buildAnswer(question: string, e: ChatAIProps['event']): string {
  const q = question.toLowerCase()
  const dateStr = e.eventDate.toLocaleDateString('ms-MY', { dateStyle: 'full', timeStyle: 'short' })
  const venue = e.venueName || 'belum ditetapkan'
  const address = e.venueAddress || ''
  const dress = e.dressCode || 'tiada ketetapan khas'

  if (/(tarikh|bila|date|when)/.test(q)) return `Majlis ${e.title} akan diadakan pada ${dateStr}.`
  if (/(lokasi|mana|venue|location|alamat|address)/.test(q)) return `Lokasi majlis: ${venue}${address ? ` (${address})` : ''}.`
  if (/(pakaian|dress|pakai|baju)/.test(q)) return `Etika pakaian: ${dress}.`
  if (/(assalam|salam|hai|hello|hi|helo)/.test(q) && q.length < 20) return `Waalaikumsalam! Saya Chat AI untuk majlis ${e.title}. Tanya saya tentang tarikh, lokasi atau pakaian.`
  if (/(rsvp|hadir|confirm|kehadiran)/.test(q)) return 'Sila gunakan butang RSVP untuk sahkan kehadiran anda.'
  if (/(wishlist|hadiah|gift)/.test(q)) return 'Semak bahagian Wishlist Hadiah untuk senarai hadiah yang diidamkan pasangan.'
  if (/(lagu|muzik|song|music)/.test(q)) return 'Anda boleh mencadangkan lagu di bahagian Song Request.'
  if (/(angpao|duit|wang|money|salam kaut|bank)/.test(q)) return 'Maklumat angpao / duit salam boleh didapati di bahagian Angpao kad ini.'
  if (/(ucapan|doa|wish)/.test(q)) return 'Tinggalkan ucapan dan doa anda di bahagian Ucapan.'
  return `Untuk maklumat lanjut tentang ${e.title}, anda boleh tanya saya tentang tarikh, lokasi, pakaian, atau hubungi tuan rumah.`
}

export default function ChatAI({ event }: ChatAIProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, typing, open])

  const send = async (text?: string) => {
    const value = (text ?? input).trim()
    if (!value) return
    const guestMsg: Message = { role: 'guest', text: value }
    setMessages(prev => [...prev, guestMsg])
    setInput('')
    setTyping(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: value, event: { title: event.title, eventDate: event.eventDate.toISOString(), venueName: event.venueName, venueAddress: event.venueAddress, dressCode: event.dressCode, description: event.description } }),
      })
      const data = await response.json()
      const reply = data?.reply || buildAnswer(value, event)
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: buildAnswer(value, event) }])
    } finally {
      setTyping(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
        aria-label="Chat AI"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-40 right-4 z-40 w-[calc(100vw-2rem)] max-w-sm">
          <GlassCard variant="dark" glow="indigo" className="overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 flex items-center gap-2 border-b border-white/10">
              <Bot className="w-5 h-5 text-indigo-300" />
              <div>
                <p className="text-white font-semibold text-sm">Chat AI</p>
                <p className="text-white/50 text-[10px]">Tanya tentang majlis ini</p>
              </div>
            </div>
            <div ref={scrollRef} className="h-64 overflow-y-auto p-3 space-y-2">
              {messages.length === 0 && (
                <div className="text-center text-white/40 text-xs py-6">
                  Salam! Saya Chat AI. Tanya saya tentang tarikh, lokasi atau pakaian majlis.
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'guest' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.role === 'guest' ? 'bg-indigo-500 text-white rounded-br-sm' : 'bg-white/10 text-white/90 rounded-bl-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && <div className="text-white/40 text-xs">Chat AI menaip...</div>}
            </div>
            <div className="p-2 border-t border-white/10 flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Tanya soalan..."
                className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
              />
              <button onClick={() => send()} className="p-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  )
}
