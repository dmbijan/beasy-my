"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import Link from "next/link"
import GlassCard from "@/components/ui/GlassCard"
import LiquidGlassDock from "@/components/ui/LiquidGlassDock"
import CountdownTimer from "@/components/widgets/CountdownTimer"
import RSVPForm from "@/components/forms/RSVPForm"
import LiquidFAB from "@/components/ui/LiquidFAB"
import PhotoUpload from "@/components/widgets/PhotoUpload"
import WishForm from "@/components/widgets/WishForm"
import AudioGuestbook from "@/components/widgets/AudioGuestbook"
import VideoGuestbook from "@/components/widgets/VideoGuestbook"
import Photobooth from "@/components/widgets/Photobooth"
import QRScanner from "@/components/widgets/QRScanner"
import { toEventView } from "@/lib/event-view"
import { themePageGradient, accentWithAlpha } from "@/lib/theme-styles"
import { motifKindForCategory, MotifOverlay } from "@/components/ui/TemplateMotif"
import { templateByAccentColor } from "@/lib/templates"
import { 
  MapPin, 
  Calendar, 
  Utensils, 
  Camera, 
  Mic, 
  Heart, 
  Music, 
  QrCode,
  Users,
  CreditCard,
  Sparkles,
  Download,
  Navigation,
  Video,
  Images,
} from "lucide-react"

export default function EventPortalPage() {
  const params = useParams()
  const eventSlug = params?.eventSlug as string
  
  const [activeModule, setActiveModule] = useState<string>("home")
  const [showUpload, setShowUpload] = useState(false)
  const [angpaoView, setAngpaoView] = useState<"account" | "qr">("account")
  const [copySuccess, setCopySuccess] = useState(false)
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [fabAction, setFabAction] = useState<string | null>(null)
  const [eventData, setEventData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [guestToken, setGuestToken] = useState<string | null>(null)
  const [preFillName, setPreFillName] = useState<string | null>(null)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Published events come only from the server, never browser-local drafts.
  useEffect(() => {
    const controller = new AbortController()
    const fetchEvent = async () => {
      if (!eventSlug) return
      setLoading(true)
      setLoadError(null)
      setEventData(null)
      setActiveModule('home')
      const params = new URLSearchParams(window.location.search)
      const gToken = params.get('g')
      if (gToken) {
        setGuestToken(gToken)
        try {
          const decodedName = atob(gToken)
          if (decodedName && decodedName.length > 0) {
            setPreFillName(decodedName)
          }
        } catch { /* An invitation name is optional, not authentication. */ }
      }
      try {
        const response = await fetch(`/api/events?slug=${encodeURIComponent(eventSlug)}`, { signal: controller.signal, cache: 'no-store' })
        const data = await response.json()
        if (!response.ok || !data.event) throw new Error(data.error || 'Gagal memuatkan acara')
        if (!controller.signal.aborted) setEventData(toEventView(data.event))
      } catch (err) {
        if (!controller.signal.aborted) setLoadError(err instanceof Error ? err.message : 'Gagal memuatkan acara')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    fetchEvent()
    return () => controller.abort()
  }, [eventSlug])

  const dockItems = [
    { icon: <HomeIcon className="w-5 h-5" />, label: "Utama", onClick: () => setActiveModule("home"), active: activeModule === "home" },
    { icon: <MapPin className="w-5 h-5" />, label: "Lokasi", onClick: () => setActiveModule("location"), active: activeModule === "location" },
    ...(eventData?.modules.rsvp ? [{ icon: <QrCode className="w-5 h-5" />, label: "RSVP", onClick: () => setActiveModule("rsvp"), active: activeModule === "rsvp" }] : []),
    ...(eventData?.modules.photoWall ? [{ icon: <Camera className="w-5 h-5" />, label: "Foto", onClick: () => setActiveModule("photowall"), active: activeModule === "photowall" }] : []),
    ...(eventData?.modules.photoWall ? [{ icon: <Images className="w-5 h-5" />, label: "Booth", onClick: () => setActiveModule("photobooth"), active: activeModule === "photobooth" }] : []),
    ...(eventData?.modules.audioGuestbook ? [{ icon: <Mic className="w-5 h-5" />, label: "Audio", onClick: () => setActiveModule("audioguestbook"), active: activeModule === "audioguestbook" }] : []),
    ...(eventData?.modules.videoGuestbook ? [{ icon: <Video className="w-5 h-5" />, label: "Video", onClick: () => setActiveModule("videoguestbook"), active: activeModule === "videoguestbook" }] : []),
    ...(eventData?.modules.wishes ? [{ icon: <Heart className="w-5 h-5" />, label: "Ucapan", onClick: () => setActiveModule("wishes"), active: activeModule === "wishes" }] : []),
    ...(eventData?.isOwner ? [{ icon: <Users className="w-5 h-5" />, label: "Check-in", onClick: () => setActiveModule("checkin"), active: activeModule === "checkin" }] : []),
  ]

  const handleFABAction = (action: string) => {
    const module = { photo: 'photoWall', audio: 'audioGuestbook', video: 'videoGuestbook', wishes: 'wishes', qr: 'rsvp' }[action]
    if (!module || !eventData?.modules[module]) {
      alert('Modul ini tidak diaktifkan oleh tuan rumah.')
      return
    }
    setFabAction(action)
    if (action === "photo") setActiveModule("photowall")
    else if (action === "audio") setActiveModule("audioguestbook")
    else if (action === "video") setActiveModule("videoguestbook")
    else if (action === "wishes") setActiveModule("wishes")
    else if (action === "qr") setActiveModule("rsvp")
  }

  const handleClaimEvent = async () => {
    setClaiming(true)
    try {
      const session = await fetch('/api/auth/session').then(r => r.json())
      if (!session?.user?.id) {
        window.location.href = `/auth/signin?redirect=${encodeURIComponent(window.location.pathname)}`
        return
      }
      if (!eventData.isOwner) {
        const response = await fetch('/api/events/claim', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventSlug }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Gagal menuntut acara')
      }
      window.location.href = `/dashboard/${eventData.id}/edit`
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Gagal mengurus acara')
    } finally {
      setClaiming(false)
    }
  }

  function HomeIcon(props: any) {
    return (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    )
  }

  if (!loading && (loadError || !eventData)) {
    return <main className="min-h-screen mesh-gradient flex items-center justify-center p-6">
      <GlassCard variant="light" className="text-center space-y-4 max-w-lg">
        <h1 className="text-2xl font-bold text-white">Acara tidak tersedia</h1>
        <p role="alert" className="text-white/70">{loadError || 'Acara tidak dijumpai.'}</p>
        <p className="text-sm text-white/50">Semak pautan dengan tuan rumah. Draf yang hanya disimpan pada peranti bukan acara yang telah diterbitkan.</p>
        <Link href="/" className="inline-block text-emerald-300">Kembali ke Beasy</Link>
      </GlassCard>
    </main>
  }

  if (loading || !eventData) {
    return (
      <div className="min-h-screen mesh-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-white/80 font-medium">Memuatkan acara...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-32 relative overflow-hidden" style={{ background: themePageGradient(eventData.theme) }}>
      {/* Decorative motif overlay derived from the selected template's category */}
      {(() => {
        const tpl = templateByAccentColor(eventData.accentColor)
        return <MotifOverlay kind={motifKindForCategory(tpl?.category || '')} accent={tpl?.accentColor2 || eventData.accentColor} />
      })()}
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative px-4 pt-8 pb-6"
      >
        <GlassCard variant="light" className="mb-6">
          <div className="text-center">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3"
              style={{ backgroundColor: accentWithAlpha(eventData.accentColor, 0.2), border: `1px solid ${accentWithAlpha(eventData.accentColor, 0.35)}`, color: accentWithAlpha(eventData.accentColor, 1) }}
            >
              <Sparkles className="w-3 h-3" />
              {(eventData.eventType || 'other').charAt(0).toUpperCase() + (eventData.eventType || 'other').slice(1)}
            </span>

            {/* Couple identity (Galeri Kawen-style) */}
            {eventData.customization?.monogram && (
              <div
                className="text-4xl font-bold bg-clip-text text-transparent mb-2"
                style={{ backgroundImage: `linear-gradient(to right, ${eventData.accentColor}, #fcd34d)` }}
              >
                {eventData.customization.monogram}
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{eventData.title}</h1>

            {(eventData.customization?.groom || eventData.customization?.bride) && (
              <p className="text-lg text-white/80 mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>
                {[eventData.customization.groom, eventData.customization.bride].filter(Boolean).join(' & ')}
              </p>
            )}

            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{eventData.eventDate.toLocaleDateString("ms-MY", { dateStyle: "full" })}</span>
              <span className="mx-2">•</span>
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[200px]">{eventData.venueName || "Lokasi tidak ditetapkan"}</span>
            </div>

            {eventData.customization?.hashtag && (
              <p className="text-sm mt-2" style={{ color: eventData.accentColor }}>{eventData.customization.hashtag}</p>
            )}

            {eventData.customization?.welcomeMessage && (
              <p className="text-white/70 text-sm mt-3 max-w-md mx-auto">{eventData.customization.welcomeMessage}</p>
            )}
          </div>
        </GlassCard>

        {/* Countdown Timer */}
        <CountdownTimer
          targetDate={eventData.eventDate}
          showDays={true}
          label="Hitung Mundur"
          className="mt-4"
        />

        {/* Export RSVP Button (visible for hosts) */}
        {eventData.isOwner && <div className="flex justify-center mt-4">
          <button
            onClick={async () => {
              if (!confirm('Export semua data RSVP ke Google Sheets?')) return
              try {
                const response = await fetch('/api/rsvps/export', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ eventId: eventData.id }),
                })
                const data = await response.json()
                if (response.ok && data.spreadsheetUrl) {
                  window.open(data.spreadsheetUrl, '_blank')
                  alert(`✅ Berjaya export ${data.totalRSVPs} RSVP!`)
                } else {
                  alert(data.error || 'Gagal export')
                }
              } catch (error) {
                console.error('Export error:', error)
                alert('Ralat semasa export')
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export RSVP ke Google Sheets
          </button>
        </div>}

        {/* Management is available only to the owner or claim-cookie holder. */}
        {(eventData.isOwner || eventData.canClaim) && (
          <div className="px-4 pt-6 pb-4">
            <GlassCard variant="light" glow="emerald" className="text-center py-6">
              <div className="flex flex-col items-center gap-3 max-w-md mx-auto">
                <p className="text-white/70 text-base">Ciri asas percuma. Login untuk edit atau setup semula acara!</p>
                <button
                  onClick={handleClaimEvent}
                  disabled={claiming}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-base font-medium hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {claiming ? 'Memproses...' : '🔐 Login untuk Edit Acara'}
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </motion.div>

      {/* Module Content */}
      <div className="px-4 space-y-6">
        <AnimatePresence mode="wait">
          {activeModule === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Location Quick Access */}
              {eventData.venueName && (
                <GlassCard
                  variant="light"
                  glow="indigo"
                  className="cursor-pointer"
                  onClick={() => setActiveModule("location")}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-indigo-500/20">
                      <MapPin className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">Lokasi Majlis</h3>
                      <p className="text-sm text-white/60">{eventData.venueName}</p>
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-white/40" />
                  </div>
                </GlassCard>
              )}

              {/* Menu */}
              {eventData.modules.menu && (
                <GlassCard variant="light" glow="amber">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-amber-500/20">
                      <Utensils className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Senarai Menu</h3>
                      <p className="text-sm text-white/60">Hidangan istimewa majlis</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["Nasi Lemak Dimsum", "Ayam Panggang", "Sotong Goreng", "Ice Kacang"].map((menu) => (
                      <div key={menu} className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-sm text-white/80">{menu}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Digital Angpao */}
              {eventData.modules.angpao && (
                <GlassCard variant="light" glow="emerald">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-emerald-500/20">
                      <CreditCard className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Digital Angpao</h3>
                      <p className="text-sm text-white/60">Sumbangan digital untuk pengantin</p>
                    </div>
                  </div>

                  {/* Toggle: Account / QR */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setAngpaoView("account")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        angpaoView === "account"
                          ? "bg-emerald-500/30 border border-emerald-500/50 text-emerald-300"
                          : "bg-white/5 border border-white/10 text-white/50 hover:text-white/80"
                      }`}
                    >
                      🏦 Nombor Akaun
                    </button>
                    <button
                      onClick={() => setAngpaoView("qr")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        angpaoView === "qr"
                          ? "bg-emerald-500/30 border border-emerald-500/50 text-emerald-300"
                          : "bg-white/5 border border-white/10 text-white/50 hover:text-white/80"
                      }`}
                    >
                      📱 QR DuitNow
                    </button>
                  </div>

                  {/* Account View */}
                  {angpaoView === "account" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm text-white/60">{eventData.angpao.bankName}</p>
                          <p className="text-lg font-mono font-bold text-white">
                            {eventData.angpao.accountNumber}
                          </p>
                          <p className="text-sm text-white/60">{eventData.angpao.accountName}</p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(eventData.angpao.accountNumber)
                            setCopySuccess(true)
                            setTimeout(() => setCopySuccess(false), 2000)
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            copySuccess
                              ? "bg-emerald-500/30 border border-emerald-500/50 text-emerald-300"
                              : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30"
                          }`}
                        >
                          {copySuccess ? "✓ Disalin" : "Salin"}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* QR View */}
                  {angpaoView === "qr" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <div className="w-48 h-48 rounded-2xl bg-white flex items-center justify-center p-3 shadow-lg">
                        <div className="text-center">
                          <div className="w-36 h-36 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mb-2">
                            <QrCode className="w-20 h-20 text-white" />
                          </div>
                          <p className="text-xs text-white/50">QR DuitNow</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-white/60">Scan untuk transfer</p>
                        <p className="text-sm font-medium text-white">
                          {eventData.angpao.duitnowNumber}
                        </p>
                        <p className="text-xs text-white/50">{eventData.angpao.duitnowName}</p>
                      </div>
                      <button onClick={() => alert("✅ QR image sedang dimuat turun! (Demo)") } className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 transition-all text-sm font-medium">
                        <Download className="w-4 h-4" />
                        <span>Muat Turun QR</span>
                      </button>
                    </motion.div>
                  )}
                </GlassCard>
              )}
            </motion.div>
          )}

          {activeModule === "rsvp" && eventData.modules.rsvp && (
            <motion.div
              key="rsvp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <RSVPForm 
                eventId={eventData.id}
                onSuccess={(data) => console.log(data)}
                guestToken={guestToken}
                preFillName={preFillName}
              />
            </motion.div>
          )}

          {activeModule === "checkin" && eventData.isOwner && (
            <motion.div
              key="checkin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <QRScanner 
                eventId={eventData.id}
                onCheckInSuccess={(guestName) => console.log('Checked in:', guestName)}
              />
            </motion.div>
          )}

          {activeModule === "location" && (
            <motion.div
              key="location"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GlassCard variant="light" glow="indigo">
                <div className="text-center mb-6">
                  <MapPin className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">{eventData.venueName}</h3>
                  <p className="text-sm text-white/60 mb-4">{eventData.venueAddress}</p>
                </div>
                <div className="space-y-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.venueAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium"
                  >
                    <MapPin className="w-5 h-5" />
                    Buka di Google Maps
                  </a>
                  <a
                    href={`https://waze.com/ul?q=${encodeURIComponent(eventData.venueAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 font-medium"
                  >
                    <Navigation className="w-5 h-5" />
                    Buka di Waze
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeModule === "photowall" && eventData.modules.photoWall && (
            <motion.div
              key="photowall"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PhotoUpload eventId={eventData.id} eventSlug={eventSlug} plan={eventData.plan} storyTemplateIds={eventData.customization?.storyTemplateIds} />
            </motion.div>
          )}

          {activeModule === "photobooth" && eventData.modules.photoWall && (
            <motion.div
              key="photobooth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Photobooth eventId={eventData.id} eventSlug={eventSlug} />
            </motion.div>
          )}

          {activeModule === "wishes" && eventData.modules.wishes && (
            <motion.div
              key="wishes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <WishForm eventId={eventData.id} />
            </motion.div>
          )}

          {activeModule === "audioguestbook" && eventData.modules.audioGuestbook && (
            <motion.div
              key="audioguestbook"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AudioGuestbook eventId={eventData.id} eventSlug={eventSlug} />
            </motion.div>
          )}

          {activeModule === "videoguestbook" && eventData.modules.videoGuestbook && (
            <motion.div
              key="videoguestbook"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VideoGuestbook eventId={eventData.id} eventSlug={eventSlug} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Bottom Dock */}
      <LiquidGlassDock
        items={dockItems}
        onFABAction={handleFABAction}
        fabIcon={<PlusIcon className="w-6 h-6" />}
      />

      {/* Beasy Branding Footer */}
      <div className="px-4 pb-8 pt-6">
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Beasy.my</span>
            </div>
            <p className="text-white/50 text-xs">Platform Acara Digital #1 Malaysia</p>
            <Link href="https://beasy.my" target="_blank" rel="noopener noreferrer">
              <button className="mt-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium hover:bg-emerald-500/30 transition-all">
                Cipta Acara Anda → beasy.my
              </button>
            </Link>
          </div>
          <p className="text-white/30 text-xs mt-3">Dikuasakan oleh Beasy.my • {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}

function ArrowRightIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function PlusIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
