"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import GlassCard from '@/components/ui/GlassCard'
import GoogleDrivePaywall from '@/components/widgets/GoogleDrivePaywall'
import PrintableQR from '@/components/widgets/PrintableQR'
import MediaModeration from '@/components/widgets/MediaModeration'
import GalleryCustomization from '@/components/widgets/GalleryCustomization'
import WeddingFeaturesWidget from '@/components/widgets/WeddingFeaturesWidget'
import WeddingChecklistWidget from '@/components/widgets/WeddingChecklistWidget'
import ModulesWidget from '@/components/widgets/ModulesWidget'
import { Monitor, Sparkles } from 'lucide-react'

interface EditableEvent { slug: string; title: string; event_date: string; venue_name: string; venue_address: string; description: string; is_active: boolean }
export default function EditEventPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const [event, setEvent] = useState<EditableEvent | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/events/${eventId}`, { cache: 'no-store', signal: controller.signal }).then(async response => {
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      const date = new Date(data.event.event_date)
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      setEvent({ slug: data.event.slug, title: data.event.title, event_date: date.toISOString().slice(0, 16), venue_name: data.event.venue_name || '', venue_address: data.event.venue_address || '', description: data.event.description || '', is_active: data.event.is_active })
      setIsPremium(data.event.isPremium === true)
    }).catch(err => { if (!controller.signal.aborted) setError(err.message) })
    return () => controller.abort()
  }, [eventId])
  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!event) return
    setSaving(true); setError(''); setSaved(false)
    try {
      const response = await fetch(`/api/events/${eventId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...event, event_date: new Date(event.event_date).toISOString() }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setSaved(true)
    } catch (err) { setError(err instanceof Error ? err.message : 'Gagal menyimpan') }
    finally { setSaving(false) }
  }
  return <main className="min-h-screen mesh-gradient px-4 py-8 max-w-3xl mx-auto space-y-6">
    <Link href="/dashboard" className="text-white/60">← Dashboard</Link><h1 className="text-3xl font-bold text-white">Edit Acara</h1>
    {error && <p role="alert" className="text-rose-300">{error}</p>}
    {saved && <p role="status" className="text-emerald-300">Perubahan telah disimpan.</p>}
    {!event && !error && <p className="text-white/60">Memuatkan acara...</p>}
    {event && <>
      <GlassCard variant="light"><form onSubmit={save} className="space-y-5">
        {([['title', 'Tajuk', 'text'], ['event_date', 'Tarikh dan masa tempatan', 'datetime-local'], ['venue_name', 'Nama lokasi', 'text'], ['venue_address', 'Alamat', 'text'], ['description', 'Penerangan', 'text']] as const).map(([key, label, type]) => <label key={key} className="block text-sm text-white/80">{label}<input required={key === 'title' || key === 'event_date'} type={type} value={event[key]} onChange={e => setEvent({ ...event, [key]: e.target.value })} className="block w-full mt-2 p-3 rounded-xl bg-white/10 border border-white/20 text-white" /></label>)}
        <label className="flex items-center gap-2 text-white"><input type="checkbox" checked={event.is_active} onChange={e => setEvent({ ...event, is_active: e.target.checked })} /> Acara aktif (boleh dilihat tetamu)</label>
        <button disabled={saving} className="w-full p-3 rounded-xl bg-emerald-500 text-white font-semibold disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
      </form></GlassCard>
      {isPremium && (
        <PrintableQR
          eventSlug={event.slug}
          eventTitle={event.title}
          eventDate={new Date(event.event_date).toLocaleDateString("ms-MY", { dateStyle: "full" })}
          venueName={event.venue_name}
        />
      )}
      {isPremium && (
        <GlassCard variant="dark" glow="indigo" className="text-center py-6">
          <h3 className="text-xl font-bold text-white mb-2">Paparan Dewan Langsung</h3>
          <p className="text-white/60 text-sm mb-4">Tayangkan galeri foto & video secara langsung di TV atau projektor semasa majlis.</p>
          <Link
            href={`/e/${event.slug}/live`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
          >
            <Monitor className="w-5 h-5" />
            Buka Paparan Dewan
          </Link>
        </GlassCard>
      )}
      {isPremium && <MediaModeration eventId={eventId} />}
      <ModulesWidget eventId={eventId} />
      {isPremium ? (
        <>
          <GalleryCustomization eventId={eventId} />
          <WeddingFeaturesWidget eventId={eventId} />
          <WeddingChecklistWidget eventId={eventId} />
          <GoogleDrivePaywall eventId={eventId} />
        </>
      ) : (
        <GlassCard variant="dark" glow="amber" className="text-center py-8">
          <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">Buka Lebih Banyak Ciri Premium</h3>
          <p className="text-white/60 text-sm mb-5 max-w-md mx-auto">
            Naik taraf ke Premium untuk akses: <strong>QR Boleh Cetak</strong>, <strong>Customization Galeri</strong>, <strong>Ciri Majlis Tambahan</strong> (wishlist, aturcara, lagu, video), <strong>Senarai Semak Kahwin</strong>, <strong>Google Drive Auto-save</strong> & banyak lagi.
          </p>
          <Link
            href="/payment/checkout"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            Naik Taraf ke Premium — RM159
          </Link>
        </GlassCard>
      )}
    </>}
  </main>
}