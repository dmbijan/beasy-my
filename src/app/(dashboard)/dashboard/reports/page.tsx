"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import GlassCard from '@/components/ui/GlassCard'
import type { DashboardEvent } from '@/lib/dashboard-types'

export default function ReportsPage() {
  const [events, setEvents] = useState<DashboardEvent[]>([])
  const [selected, setSelected] = useState('all')
  const [range, setRange] = useState('all')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/dashboard', { cache: 'no-store', signal: controller.signal }).then(async response => {
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setEvents(data.events)
    }).catch(err => { if (!controller.signal.aborted) setError(err.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])
  const filtered = events.filter(event => (selected === 'all' || event.id === selected) &&
    (range === 'all' || Date.parse(event.created_at) >= Date.now() - Number(range) * 86400000))
  const rsvps = filtered.reduce((sum, event) => sum + event.rsvp_count, 0)
  const checked = filtered.reduce((sum, event) => sum + event.checked_in_count, 0)
  return <main className="min-h-screen mesh-gradient px-4 py-8 max-w-6xl mx-auto space-y-6">
    <Link href="/dashboard" className="text-white/60">← Dashboard</Link>
    <h1 className="text-3xl font-bold text-white">Laporan & Analisis</h1>
    {error && <p role="alert" className="text-rose-300">{error}</p>}
    {loading ? <p role="status" className="text-white/60">Memuatkan laporan...</p> : !error && <>
      <GlassCard variant="light" className="flex flex-wrap gap-4">
        <label className="text-white/80">Acara <select className="ml-2 rounded-lg bg-slate-800 p-2" value={selected} onChange={e => setSelected(e.target.value)}><option value="all">Semua acara</option>{events.map(event => <option key={event.id} value={event.id}>{event.title}</option>)}</select></label>
        <label className="text-white/80">Acara dicipta <select className="ml-2 rounded-lg bg-slate-800 p-2" value={range} onChange={e => setRange(e.target.value)}><option value="all">Sepanjang masa</option><option value="7">7 hari lalu</option><option value="30">30 hari lalu</option><option value="90">90 hari lalu</option></select></label>
      </GlassCard>
      <GlassCard variant="light"><p className="text-white">{filtered.length} acara · {rsvps} RSVP · {checked} check-in</p><p className="text-emerald-300 mt-2">Kadar check-in: {rsvps ? Math.round(checked / rsvps * 100) : 0}%</p><p className="text-xs text-white/50 mt-2">Kiraan berdasarkan rekod RSVP, bukan jumlah pax.</p></GlassCard>
      {filtered.map(event => <GlassCard key={event.id} variant="light"><h2 className="text-lg font-bold text-white">{event.title}</h2><p className="text-white/60 mt-2">{event.rsvp_count} RSVP · {event.checked_in_count} check-in · {event.media_count} media</p></GlassCard>)}
      {!filtered.length && <p className="text-white/60">Tiada acara untuk penapis ini.</p>}
    </>}
  </main>
}