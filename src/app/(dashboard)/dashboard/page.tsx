"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Calendar, Plus, Users, Camera, Settings, BarChart3 } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import type { DashboardEvent } from '@/lib/dashboard-types'

export default function HostDashboard() {
  const { data: session, status } = useSession()
  const [events, setEvents] = useState<DashboardEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    setEvents([])
    setError('')
    if (status === 'loading') return
    if (!session?.user?.id) { setLoading(false); return }
    setLoading(true)
    fetch('/api/dashboard', { cache: 'no-store', signal: controller.signal }).then(async response => {
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setEvents(data.events)
    }).catch(err => { if (!controller.signal.aborted) setError(err.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [status, session?.user?.id])

  return <main className="min-h-screen mesh-gradient px-4 py-8 pb-28 max-w-6xl mx-auto space-y-6">
    <header className="flex flex-wrap justify-between items-center gap-4">
      <div><h1 className="text-3xl font-bold text-white">Dashboard Host</h1><p className="text-white/60 mt-2">Urus acara, tetamu dan kenangan anda.</p></div>
      <nav className="flex gap-3 text-white/80">
        <Link href="/dashboard/reports" aria-label="Laporan"><BarChart3 /></Link>
        <Link href="/dashboard/settings" aria-label="Tetapan"><Settings /></Link>
      </nav>
    </header>
    <Link href="/dashboard/create" className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-emerald-500 text-white font-semibold"><Plus size={20} /> Cipta Acara Baru</Link>
    {loading || status === 'loading' ? <p role="status" className="text-white/60">Memuatkan dashboard...</p>
      : !session?.user?.id ? <GlassCard variant="light"><p className="text-white mb-3">Log masuk untuk melihat acara milik anda.</p><Link href="/auth/signin" className="text-emerald-300">Log masuk →</Link></GlassCard>
      : error ? <p role="alert" className="text-rose-300">{error}</p> : <>
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ['Acara', events.length], ['RSVP', events.reduce((n, e) => n + e.rsvp_count, 0)],
            ['Check-in', events.reduce((n, e) => n + e.checked_in_count, 0)], ['Media', events.reduce((n, e) => n + e.media_count, 0)],
          ].map(([label, value]) => <GlassCard key={label} variant="light"><p className="text-white/60 text-sm">{label}</p><p className="text-3xl text-white font-bold mt-2">{value}</p></GlassCard>)}
        </section>
        {!events.length && <GlassCard variant="light" className="text-center py-12"><Calendar className="mx-auto text-emerald-300 mb-4" size={40} /><h2 className="text-xl font-bold text-white">Acara pertama anda bermula di sini</h2><p className="text-white/60 mt-2">Acara tanpa pemilik perlu dituntut melalui pelayar yang menciptanya.</p></GlassCard>}
        <section className="grid md:grid-cols-2 gap-4">{events.map(event => <GlassCard key={event.id} variant="light" className="space-y-4">
          <div className="flex justify-between gap-3"><h2 className="text-xl font-bold text-white">{event.title}</h2><span className="text-xs text-emerald-300">{event.is_active ? 'Aktif' : 'Tidak aktif'}</span></div>
          <p className="text-white/60 text-sm">{new Date(event.event_date).toLocaleString('ms-MY')}</p>
          <div className="flex gap-4 text-sm text-white/70"><span className="flex gap-1"><Users size={18} /> {event.rsvp_count} RSVP</span><span className="flex gap-1"><Camera size={18} /> {event.media_count} media</span></div>
          <div className="flex flex-wrap gap-3 text-sm"><Link className="text-emerald-300" href={`/e/${event.slug}`}>Lihat portal</Link><Link className="text-indigo-300" href={`/dashboard/${event.id}/edit`}>Edit acara</Link><Link className="text-white/80" href={`/dashboard/${event.id}/qr-checkin`}>Check-in</Link></div>
        </GlassCard>)}</section>
      </>}
  </main>
}