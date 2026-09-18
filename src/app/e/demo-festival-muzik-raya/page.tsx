"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"
import Link from "next/link"
import GlassCard from "@/components/ui/GlassCard"
import LiquidGlassDock from "@/components/ui/LiquidGlassDock"
import CountdownTimer from "@/components/widgets/CountdownTimer"
import RSVPForm from "@/components/forms/RSVPForm"
import PhotoUpload from "@/components/widgets/PhotoUpload"
import WishForm from "@/components/widgets/WishForm"
import AudioGuestbook from "@/components/widgets/AudioGuestbook"
import { MapPin, Calendar, Utensils, Camera, Mic, Heart, Music, QrCode, Users, CreditCard, Sparkles, HomeIcon, Music2, Download, Navigation } from "lucide-react"

export default function EventPortalPage() {
  const params = useParams()
  const eventSlug = params?.eventSlug as string
  
  const [activeModule, setActiveModule] = useState<string>("home")
  const [angpaoView, setAngpaoView] = useState<"account" | "qr">("account")
  const [copySuccess, setCopySuccess] = useState(false)
  const [qrImage, setQrImage] = useState<string | null>(null)
  const [countdownTarget, setCountdownTarget] = useState<Date>(new Date())
  const [fabAction, setFabAction] = useState<string | null>(null)

  // Auto-set countdown to 7d 8h 28m 58s from now for live demo feel
  React.useEffect(() => {
    const target = new Date()
    target.setDate(target.getDate() + 7)
    target.setHours(target.getHours() + 8)
    target.setMinutes(target.getMinutes() + 28)
    target.setSeconds(target.getSeconds() + 58)
    setCountdownTarget(target)
  }, [])

  const eventData = {
    title: "Festival Muzik Raya",
    eventType: "festival",
    eventDate: new Date("2025-12-25T18:00:00"),
    venueName: "Dataran Merdeka",
    venueAddress: "50050 Kuala Lumpur",
    mapsLink: "https://maps.google.com/?q=Dataran+Merdeka",
    modules: {
      rsvp: true, seating: true, menu: true, photoWall: true,
      audioGuestbook: true, videoGuestbook: false, wishes: true,
      songRequest: true, liveWall: true, angpao: false,
    },
    angpao: {
      type: "both", accountNumber: "1234-5678-9012", bankName: "Bank Islam",
      accountName: "Festival Muzik Raya", duitnowNumber: "012-3456789",
      duitnowName: "Festival Muzik Raya", qrImageUrl: "/duitnow-qr-sample.svg",
    },
  }

  const dockItems = [
    { icon: <HomeIcon className="w-5 h-5" />, label: "Utama", onClick: () => setActiveModule("home"), active: activeModule === "home" },
    { icon: <MapPin className="w-5 h-5" />, label: "Lokasi", onClick: () => setActiveModule("location"), active: activeModule === "location" },
    { icon: <QrCode className="w-5 h-5" />, label: "RSVP", onClick: () => setActiveModule("rsvp"), active: activeModule === "rsvp" },
    { icon: <Camera className="w-5 h-5" />, label: "Foto", onClick: () => setActiveModule("photowall"), active: activeModule === "photowall" },
    { icon: <Music className="w-5 h-5" />, label: "Audio", onClick: () => setActiveModule("audioguestbook"), active: activeModule === "audioguestbook" },
  ]

  const handleFABAction = (action: string) => {
    setFabAction(action)
    if (action === "photo") setActiveModule("photowall")
    else if (action === "audio") setActiveModule("audioguestbook")
    else if (action === "wishes") setActiveModule("wishes")
    else if (action === "qr") setActiveModule("rsvp")
  }

  return (
    <div className="min-h-screen mesh-gradient pb-32">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative px-4 pt-8 pb-6">
        <GlassCard variant="light" className="mb-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-300 mb-3">
              <Music2 className="w-3 h-3" /> Festival
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{eventData.title}</h1>
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{eventData.eventDate.toLocaleDateString("ms-MY", { dateStyle: "full" })}</span>
              <span className="mx-2">•</span>
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[200px]">{eventData.venueName}</span>
            </div>
          </div>
        </GlassCard>
        <CountdownTimer targetDate={countdownTarget} showDays={true} label="Hitung Mundur" className="mt-4" />
        {eventSlug === 'demo-festival-muzik-raya' && (
          <GlassCard variant="light" glow="amber" className="text-center">
            <div className="flex flex-col items-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-400" />
              <p className="text-white/80 font-medium">Ini adalah Demo Sistem Beasy.my</p>
              <p className="text-white/60 text-sm">Anda boleh cuba semua ciri tanpa perlu login.</p>
              <Link href="/dashboard/create"><button className="px-6 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-500 text-white text-sm font-medium hover:from-rose-600 hover:to-indigo-600 transition-all">Cipta Acara Percuma</button></Link>
            </div>
          </GlassCard>
        )}
      </motion.div>

      <div className="px-4 space-y-6">
        <AnimatePresence mode="wait">
          {activeModule === "home" && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              {eventData.modules.seating && (
                <GlassCard variant="light" glow="indigo" className="cursor-pointer" onClick={() => setActiveModule("location")}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-indigo-500/20"><MapPin className="w-6 h-6 text-indigo-400" /></div>
                    <div className="flex-1"><h3 className="font-semibold text-white">Lokasi Majlis</h3><p className="text-sm text-white/60">{eventData.venueName}</p></div>
                    <ArrowRightIcon className="w-5 h-5 text-white/40" />
                  </div>
                </GlassCard>
              )}
              {eventData.modules.menu && (
                <GlassCard variant="light" glow="amber">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-amber-500/20"><Utensils className="w-6 h-6 text-amber-400" /></div>
                    <div><h3 className="font-semibold text-white">Senarai Menu</h3><p className="text-sm text-white/60">Buffet festival</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["Nasi Lemak", "Satay", "Roti Canai", "Minuman"].map((menu) => (
                      <div key={menu} className="p-3 rounded-xl bg-white/5 border border-white/10"><p className="text-sm text-white/80">{menu}</p></div>
                    ))}
                  </div>
                </GlassCard>
              )}
              {eventData.modules.songRequest && (
                <GlassCard variant="light" glow="rose">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-rose-500/20"><Music className="w-6 h-6 text-rose-400" /></div>
                    <div><h3 className="font-semibold text-white">Minta Lagu</h3><p className="text-sm text-white/60">Hantar permintaan lagu untuk pentas</p></div>
                  </div>
                  <div className="space-y-2">
                    {["Lagu 1 - Artist A", "Lagu 2 - Artist B", "Lagu 3 - Artist C"].map((song) => (
                      <div key={song} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <p className="text-sm text-white/80">{song}</p>
                        <span className="text-xs text-emerald-400">✓ Diterima</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
              {eventData.modules.liveWall && (
                <GlassCard variant="light" glow="emerald">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-emerald-500/20"><Users className="w-6 h-6 text-emerald-400" /></div>
                    <div><h3 className="font-semibold text-white">Live Wall</h3><p className="text-sm text-white/60">Papan tanda digital peserta</p></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["Ahmad", "Siti", "Ali", "Nurul", "Hafiz", "Aisyah"].map((name) => (
                      <div key={name} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center"><p className="text-sm font-medium text-white">{name}</p></div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )}
          {activeModule === "rsvp" && <motion.div key="rsvp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><RSVPForm eventId={eventSlug} onSuccess={(data) => console.log(data)} /></motion.div>}
          {activeModule === "location" && (
            <motion.div key="location" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <GlassCard variant="light" glow="indigo">
                <div className="text-center mb-6"><MapPin className="w-12 h-12 text-indigo-400 mx-auto mb-3" /><h3 className="text-xl font-bold text-white mb-2">{eventData.venueName}</h3><p className="text-sm text-white/60 mb-4">{eventData.venueAddress}</p></div>
                <div className="space-y-3">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.venueAddress)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium"><MapPin className="w-5 h-5" />Buka di Google Maps</a>
                  <a href={`https://waze.com/ul?q=${encodeURIComponent(eventData.venueAddress)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 font-medium"><Navigation className="w-5 h-5" />Buka di Waze</a>
                </div>
              </GlassCard>
            </motion.div>
          )}
          {activeModule === "photowall" && (
            <motion.div key="photowall" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <PhotoUpload eventId={eventSlug} />
            </motion.div>
          )}
          {activeModule === "wishes" && (
            <motion.div key="wishes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <WishForm eventId={eventSlug} onSuccess={(data) => console.log(data)} />
            </motion.div>
          )}
          {activeModule === "audioguestbook" && (
            <motion.div key="audioguestbook" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AudioGuestbook eventId={eventSlug} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <LiquidGlassDock items={dockItems} onFABAction={handleFABAction} fabIcon={<PlusIcon className="w-6 h-6" />} />
    </div>
  )
}

function ArrowRightIcon(props: any) { return (<svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>) }
function PlusIcon(props: any) { return (<svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>) }
