"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import GlassCard from '@/components/ui/GlassCard'
import {
  LayoutDashboard, Calendar, Users, CreditCard, Image as ImageIcon,
  Loader2, ShieldCheck, ExternalLink, CheckCircle2, XCircle, Ban, UserPlus,
} from 'lucide-react'

type Section = 'overview' | 'events' | 'users' | 'payments' | 'media'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [section, setSection] = useState<Section>('overview')
  const [overview, setOverview] = useState<Record<string, number> | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [forbidden, setForbidden] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createMsg, setCreateMsg] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user) { setLoading(false); setForbidden(true); return }
    const controller = new AbortController()
    const fetchSection = async (s: Section) => {
      setLoading(true); setError('')
      try {
        const response = await fetch(`/api/admin?section=${s}`, { cache: 'no-store', signal: controller.signal })
        if (response.status === 403) { setForbidden(true); return }
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        if (s === 'overview') setOverview(data)
        if (s === 'events') setEvents(data.events || [])
        if (s === 'users') setUsers(data.users || [])
        if (s === 'payments') setPayments(data.payments || [])
        if (s === 'media') setMedia(data.media || [])
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : 'Gagal memuatkan')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    fetchSection(section)
    return () => controller.abort()
  }, [section, session, status])

  if (status === 'loading') {
    return <main className="min-h-screen mesh-gradient flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-400" /></main>
  }

  if (forbidden || !session?.user) {
    return <main className="min-h-screen mesh-gradient flex items-center justify-center p-6">
      <GlassCard variant="light" className="text-center space-y-4 max-w-lg">
        <Ban className="w-12 h-12 text-rose-400 mx-auto" />
        <h1 className="text-2xl font-bold text-white">Akses Ditolak</h1>
        <p className="text-white/60">Anda bukan admin. Hubungi pemilik platform untuk akses.</p>
        <Link href="/dashboard" className="inline-block text-emerald-300">Kembali ke Dashboard →</Link>
      </GlassCard>
    </main>
  }

  const tabs: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'media', label: 'Media', icon: <ImageIcon className="w-4 h-4" /> },
  ]

  const fmt = (s?: string) => s ? new Date(s).toLocaleString('ms-MY') : '—'

  const createUser = async () => {
    setCreating(true); setCreateMsg('')
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, fullName: newName }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setCreateMsg(`✅ User ${data.user.email} berjaya didaftarkan.`)
      setNewEmail(''); setNewName('')
      setSection('users')
    } catch (err) {
      setCreateMsg(`❌ ${err instanceof Error ? err.message : 'Gagal daftar'}`)
    } finally {
      setCreating(false)
    }
  }

  return (
    <main className="min-h-screen mesh-gradient px-4 py-8 pb-16 max-w-6xl mx-auto space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-indigo-400" /> Panel Admin
          </h1>
          <p className="text-white/60 mt-1">Pengurusan platform Beasy.my</p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
          {session.user.email}
        </span>
      </header>

      {/* Tabs */}
      <nav className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setSection(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${section === t.id ? 'bg-indigo-500/30 border border-indigo-500/50 text-white' : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </nav>

      {/* Daftar User Baru */}
      <GlassCard variant="light" className="space-y-3">
        <h2 className="text-white font-semibold flex items-center gap-2"><UserPlus className="w-5 h-5 text-emerald-400" /> Daftar User Baru</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            placeholder="emel@contoh.com"
            type="email"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
          />
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Nama penuh (opsional)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
          />
          <button
            onClick={createUser}
            disabled={creating || !newEmail}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Daftar
          </button>
        </div>
        {createMsg && <p className="text-sm text-white/80">{createMsg}</p>}
      </GlassCard>

      {error && <p role="alert" className="text-rose-300 text-sm">{error}</p>}
      {loading && <div className="flex items-center gap-2 text-white/60 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Memuatkan...</div>}

      {/* Overview */}
      {!loading && section === 'overview' && overview && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ['Users', overview.users, Users],
            ['Events', overview.events, Calendar],
            ['Events Aktif', overview.activeEvents, CheckCircle2],
            ['Payments', overview.payments, CreditCard],
            ['Paid', overview.paidPayments, CheckCircle2],
            ['Media', overview.media, ImageIcon],
            ['RSVP', overview.rsvps, Users],
          ].map(([label, value, Icon]: any) => (
            <GlassCard key={label} variant="light" className="text-center">
              <Icon className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
              <p className="text-white/60 text-sm">{label}</p>
              <p className="text-3xl text-white font-bold mt-1">{value ?? 0}</p>
            </GlassCard>
          ))}
        </section>
      )}

      {/* Events */}
      {!loading && section === 'events' && (
        <div className="space-y-3">
          {events.map(e => (
            <GlassCard key={e.id} variant="light" className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{e.title}</p>
                <p className="text-white/50 text-xs">{e.slug} • {e.event_type} • {fmt(e.event_date)}</p>
                <p className="text-white/40 text-[10px]">plan: {e.plan} • host: {e.host_id ? e.host_id.slice(0, 8) : 'belum diklaim'}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${e.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50'}`}>{e.is_active ? 'Aktif' : 'Tidak aktif'}</span>
                <a href={`/e/${e.slug}`} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:text-indigo-200"><ExternalLink className="w-4 h-4" /></a>
              </div>
            </GlassCard>
          ))}
          {events.length === 0 && <p className="text-white/40 text-sm">Tiada events.</p>}
        </div>
      )}

      {/* Users */}
      {!loading && section === 'users' && (
        <div className="space-y-3">
          {users.map(u => (
            <GlassCard key={u.id} variant="light" className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{u.full_name || '—'}</p>
                <p className="text-white/50 text-xs">{u.email}</p>
                <p className="text-white/40 text-[10px]">{u.id} • daftar {fmt(u.created_at)}</p>
              </div>
            </GlassCard>
          ))}
          {users.length === 0 && <p className="text-white/40 text-sm">Tiada users.</p>}
        </div>
      )}

      {/* Payments */}
      {!loading && section === 'payments' && (
        <div className="space-y-3">
          {payments.map(p => (
            <GlassCard key={p.id} variant="light" className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-white font-medium">RM{Number(p.amount).toFixed(2)}</p>
                <p className="text-white/50 text-xs">{p.currency} • bill: {p.toyyibpay_bill_code || '—'}</p>
                <p className="text-white/40 text-[10px]">host: {p.host_id ? p.host_id.slice(0, 8) : '—'} • {fmt(p.created_at)}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-medium shrink-0 ${p.status === 'paid' ? 'bg-emerald-500/20 text-emerald-300' : p.status === 'failed' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>{p.status}</span>
            </GlassCard>
          ))}
          {payments.length === 0 && <p className="text-white/40 text-sm">Tiada payments.</p>}
        </div>
      )}

      {/* Media */}
      {!loading && section === 'media' && (
        <div className="space-y-3">
          {media.map(m => (
            <GlassCard key={m.id} variant="light" className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-white font-medium">{m.media_type} • {m.uploader_name || 'anonim'}</p>
                <p className="text-white/50 text-xs">event: {m.event_id ? m.event_id.slice(0, 8) : '—'} • {fmt(m.created_at)}</p>
              </div>
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium shrink-0 ${m.is_approved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {m.is_approved ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {m.is_approved ? 'Approved' : 'Pending'}
              </span>
            </GlassCard>
          ))}
          {media.length === 0 && <p className="text-white/40 text-sm">Tiada media.</p>}
        </div>
      )}
    </main>
  )
}
