"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import QRScanner from '@/components/widgets/QRScanner'
import GlassCard from '@/components/ui/GlassCard'

interface Checkin { id: string; guest_name: string; checked_in: boolean; checked_in_at: string }
export default function QRCheckinPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  async function refresh() {
    try {
      const response = await fetch(`/api/rsvps?eventId=${encodeURIComponent(eventId)}`, { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setCheckins(data.rsvps.filter((rsvp: Checkin) => rsvp.checked_in).sort((a: Checkin, b: Checkin) => Date.parse(b.checked_in_at) - Date.parse(a.checked_in_at)))
      setReady(true)
      setError('')
    } catch (err) { setError(err instanceof Error ? err.message : 'Gagal memuatkan check-in') }
  }
  useEffect(() => { setReady(false); void refresh() }, [eventId])
  return <main className="min-h-screen mesh-gradient px-4 py-8 max-w-3xl mx-auto space-y-6">
    <Link href="/dashboard" className="text-white/60">← Dashboard</Link>
    <h1 className="text-3xl font-bold text-white">Check-in Tetamu</h1>
    {error && <p role="alert" className="text-rose-300">{error}</p>}
    {ready && <>
      <QRScanner eventId={eventId} onCheckInSuccess={() => { void refresh() }} />
      <GlassCard variant="light"><h2 className="text-lg font-bold text-white">{checkins.length} rekod check-in</h2><ul className="space-y-3 mt-4">{checkins.slice(0, 20).map(guest => <li key={guest.id} className="flex justify-between gap-3 text-white/70 text-sm"><span>{guest.guest_name}</span><time>{new Date(guest.checked_in_at).toLocaleString('ms-MY')}</time></li>)}</ul></GlassCard>
    </>}
  </main>
}