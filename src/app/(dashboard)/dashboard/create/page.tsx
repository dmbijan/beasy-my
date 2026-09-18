"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import GlassCard from "@/components/ui/GlassCard"
import { templates, isWeddingTemplate } from "@/lib/templates"
import { themeBackground } from "@/lib/theme-styles"
import { motifKindForCategory, MotifOverlay } from "@/components/ui/TemplateMotif"
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Tag, 
  CheckCircle,
  Cloud,
  Zap,
  User,
  Palette,
  Link2,
  Clock,
  Image as ImageIcon,
  MessageSquare,
  Smartphone,
  Globe,
  X,
  ChevronDown,
  ChevronUp,
  CreditCard,
  HardDrive,
  Check,
  Loader2
} from "lucide-react"

export default function CreateEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [isConnectingDrive, setIsConnectingDrive] = useState(false)
  const [driveConnected, setDriveConnected] = useState(false)
  const [hasExistingEvent, setHasExistingEvent] = useState(false)
  const [existingEventSlug, setExistingEventSlug] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    eventType: "wedding",
    eventDate: "",
    description: "",
    venueName: "",
    venueAddress: "",
    mapsLink: "",
    dressCode: "",
    rsvpDeadline: "",
    theme: "glass",
    accentColor: "#f43f5e",
    coverImage: "",
    facebookLink: "",
    instagramLink: "",
    whatsappLink: "",
    websiteLink: "",
    angpaoEnabled: false,
    bankName: "",
    accountNumber: "",
    accountName: "",
    duitNowNumber: "",
    duitNowName: "",
  })

  // Templates shown depend on the selected event type. Wedding-exclusive
  // categories (Motion/Khat/Luxury/Simple/Traditional) only appear for weddings.
  const availableTemplates = formData.eventType === 'wedding'
    ? templates
    : templates.filter(t => !isWeddingTemplate(t))


  const eventTypes = [
    { value: "wedding", label: "Perkahwinan", icon: "💒", description: "Hari perkahwinan yang tidak dapat dilupakan" },
    { value: "birthday", label: "Hari Jadi", icon: "🎂", description: "Perayaan hari jadi meriah dan ceria" },
    { value: "aqiqah", label: "Aqiqah", icon: "👶", description: "Majlis aqiqah dan penyambutan kelahiran" },
    { value: "baby-shower", label: "Baby Shower", icon: "🍼", description: "Syabas atas kemunculan bayi kecil anda" },
    { value: "corporate", label: "Korporat", icon: "🏢", description: "Acara korporat dan mesyuarat profesional" },
    { value: "festival", label: "Festival", icon: "🎵", description: "Festival muzik dan acara budaya" },
    { value: "graduation", label: "Konvokesyen", icon: "🎓", description: "Konvokesyen dan majlis graduasi" },
    { value: "party", label: "Party", icon: "🎉", description: "Pesta dan perhimpunan yang menyeronokkan" },
    { value: "other", label: "Lain-lain", icon: "✨", description: "Acara istimewa anda" },
  ]

  const dressCodes = [
    { value: "formal", label: "Formal", icon: "🤵", description: "Pakaian formal / tuxedo / gown" },
    { value: "semi-formal", label: "Semi-Formal", icon: "👔", description: "Pakaian separa formal" },
    { value: "casual", label: "Casual", icon: "👕", description: "Pakaian kasual" },
    { value: "traditional", label: "Tradisional", icon: "👘", description: "Pakaian tradisional / baju kurung / baju melayu" },
    { value: "themed", label: "Themed", icon: "🎭", description: "Pakaian mengikut tema" },
  ]

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 50)
  }

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({ ...prev, title: value, slug: generateSlug(value) }))
  }

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverImage: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData,
          eventDate: new Date(formData.eventDate).toISOString(),
          rsvpDeadline: formData.rsvpDeadline ? new Date(formData.rsvpDeadline).toISOString() : '',
        }),
      })
      const data = await response.json()
      if (!response.ok || !data.event?.id) throw new Error(data.error || 'Acara belum berjaya diterbitkan.')
      setCreatedEvent({ ...data, slug: data.event.slug })
      setSuccess(true)
      
      setLoading(false)
    } catch (err) {
      console.error("Error creating event:", err)
      alert(err instanceof Error ? err.message : "Gagal mencipta acara. Sila cuba lagi.")
      setLoading(false)
    }
  }

  const handleContinueToDashboard = () => {
    router.push('/dashboard')
  }

  const [success, setSuccess] = useState(false)
  const [createdEvent, setCreatedEvent] = useState<any>(null)
  const [showAngpaoSetup, setShowAngpaoSetup] = useState(false)
  const [showDriveSetup, setShowDriveSetup] = useState(false)
  const totalSteps = 4

  return (
    <div className="min-h-screen mesh-gradient pb-8">
      {/* Header */}
      <div className="px-4 pt-8 pb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Cipta Acara Baru</h1>
            <p className="text-sm text-white/60">✅ PERCUMA — Cipta acara tanpa perlu login!</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                s <= step 
                  ? "bg-emerald-500/30 border border-emerald-500/50 text-emerald-300" 
                  : "bg-white/5 border border-white/10 text-white/30"
              }`}>
                {s < step ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              {s < totalSteps && (
                <div className={`flex-1 h-0.5 rounded-full transition-all ${
                  s < step ? "bg-emerald-500/50" : "bg-white/10"
                }`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-white/40 mt-2">Langkah {step} daripada {totalSteps}</p>
      </div>

      {/* Form */}
      <div className="px-4 space-y-6">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Event Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard variant="light" glow="emerald">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm text-emerald-400">1</span>
                      Butiran Acara
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Event Type */}
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Jenis Acara</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                          {eventTypes.map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, eventType: type.value }))}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                formData.eventType === type.value
                                  ? "bg-emerald-500/20 border-emerald-500/40"
                                  : "bg-white/5 border-white/10 hover:bg-white/10"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">{type.icon}</span>
                                <span className="text-white font-medium text-sm">{type.label}</span>
                              </div>
                              <p className="text-xs text-white/50">{type.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Title */}
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Nama Acara
                        </label>
                        <input
                          id="title"
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="cth: Perkahwinan Ahmad & Siti"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>

                      {/* Slug */}
                      <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-white/80 mb-2">
                          <Tag className="w-4 h-4 inline mr-1" />
                          Pautan Acara (URL)
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-white/40 text-sm whitespace-nowrap">/e/</span>
                          <input
                            id="slug"
                            type="text"
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.replace(/[^a-z0-9-]/g, "") }))}
                            placeholder="perkahwinan-ahmad-siti"
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                          />
                        </div>
                        <p className="text-xs text-white/40 mt-1">Gunakan huruf kecil, nombor, dan hyphen sahaja</p>
                      </div>

                      {/* Event Date */}
                      <div>
                        <label htmlFor="eventDate" className="block text-sm font-medium text-white/80 mb-2">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          Tarikh & Masa Acara
                        </label>
                        <input
                          id="eventDate"
                          type="datetime-local"
                          required
                          value={formData.eventDate}
                          onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-2">
                          <MessageSquare className="w-4 h-4 inline mr-1" />
                          Deskripsi Acara
                        </label>
                        <textarea
                          id="description"
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Tulis deskripsi atau kenangan istimewa acara anda..."
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 resize-none"
                        />
                        <p className="text-xs text-white/40 mt-1">{formData.description.length}/500 karakter</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                    {/* Freemium Info */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-emerald-300 font-semibold text-sm mb-1">🎉 Apa Yang PERCUMA:</p>
                          <ul className="text-xs text-emerald-200/70 space-y-1">
                            <li>✅ Cipta & publish acara</li>
                            <li>✅ RSVP & guest management</li>
                            <li>✅ Custom theme & cover image</li>
                            <li>✅ Social media links</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-300 font-semibold text-sm mb-1">💎 Premium — RM159 One-time Payment:</p>
                          <ul className="text-xs text-amber-200/70 space-y-1">
                            <li>📍 Location & Maps integration</li>
                            <li>💬 Wishes & Ucapan guestbook</li>
                            <li>📸 Photo Upload & Gallery</li>
                            <li>🎙️ Audio Guestbook</li>
                            <li>🧧 Digital Angpao / Sumbangan</li>
                            <li>☁️ Auto-save ke Google Drive</li>
                          </ul>
                          <p className="text-amber-300/60 text-xs mt-2">Bayar sekali sahaja — tidak perlu subscription!</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        disabled={!formData.title || !formData.eventDate}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Seterusnya
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
              </motion.div>
            )}

            {/* Step 2: Venue & Location */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard variant="light" glow="indigo">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm text-indigo-400">2</span>
                      Lokasi & Details
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Venue Name */}
                      <div>
                        <label htmlFor="venueName" className="block text-sm font-medium text-white/80 mb-2">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          Nama Venue
                        </label>
                        <input
                          id="venueName"
                          type="text"
                          value={formData.venueName}
                          onChange={(e) => setFormData(prev => ({ ...prev, venueName: e.target.value }))}
                          placeholder="cth: Grand Ballroom, Hotel Istana"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
                        />
                      </div>

                      {/* Venue Address */}
                      <div>
                        <label htmlFor="venueAddress" className="block text-sm font-medium text-white/80 mb-2">
                          Alamat Lengkap
                        </label>
                        <textarea
                          id="venueAddress"
                          rows={3}
                          value={formData.venueAddress}
                          onChange={(e) => setFormData(prev => ({ ...prev, venueAddress: e.target.value }))}
                          placeholder="cth: Jalan Sultan Ibrahim, 50250 Kuala Lumpur"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 resize-none"
                        />
                      </div>

                      {/* Maps Link */}
                      <div>
                        <label htmlFor="mapsLink" className="block text-sm font-medium text-white/80 mb-2">
                          <Link2 className="w-4 h-4 inline mr-1" />
                          Pautan Google Maps / Waze
                        </label>
                        <input
                          id="mapsLink"
                          type="url"
                          value={formData.mapsLink}
                          onChange={(e) => setFormData(prev => ({ ...prev, mapsLink: e.target.value }))}
                          placeholder="https://maps.google.com/?q=..."
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
                        />
                        <p className="text-xs text-white/40 mt-1">Paste link Google Maps atau Waze untuk venue</p>
                      </div>

                      {/* Dress Code */}
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Dress Code</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {dressCodes.map((dc) => (
                            <button
                              key={dc.value}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, dressCode: dc.value }))}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                formData.dressCode === dc.value
                                  ? "bg-indigo-500/20 border-indigo-500/40"
                                  : "bg-white/5 border-white/10 hover:bg-white/10"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">{dc.icon}</span>
                                <span className="text-white font-medium text-sm">{dc.label}</span>
                              </div>
                              <p className="text-xs text-white/50">{dc.description}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* RSVP Deadline */}
                      <div>
                        <label htmlFor="rsvpDeadline" className="block text-sm font-medium text-white/80 mb-2">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Tarikh Limit RSVP
                        </label>
                        <input
                          id="rsvpDeadline"
                          type="date"
                          value={formData.rsvpDeadline}
                          onChange={(e) => setFormData(prev => ({ ...prev, rsvpDeadline: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-indigo-500/50"
                        />
                        <p className="text-xs text-white/40 mt-1">Tetamu perlu RSVP sebelum tarikh ini</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Navigation */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all"
                  >
                    Seterusnya
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Theme & Customization */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard variant="light" glow="purple">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm text-purple-400">3</span>
                      Tema & Penyesuaian
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Template Selection (Beasy-style) */}
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                          <Palette className="w-4 h-4 inline mr-1" />
                          Pilih Template ({availableTemplates.length})
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
                          {availableTemplates.map((template) => {
                            const isSelected = formData.accentColor.toLowerCase() === template.accentColor.toLowerCase()
                            return (
                              <button
                                key={template.id}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, theme: template.theme, accentColor: template.accentColor }))}
                                className={`p-3 rounded-xl border text-center transition-all ${
                                  isSelected
                                    ? "bg-purple-500/20 border-purple-500/40"
                                    : "bg-white/5 border-white/10 hover:bg-white/10"
                                }`}
                              >
                                <div className={`h-14 rounded-lg bg-gradient-to-br ${template.gradient} mb-2 flex items-center justify-center relative overflow-hidden`}>
                                  <MotifOverlay kind={motifKindForCategory(template.category)} accent={template.accentColor2} />
                                  <span className="relative z-10 text-white/90 text-[10px] font-semibold">You're Invited</span>
                                </div>
                                <span className="text-white font-medium text-xs block">{template.name}</span>
                                <span className="text-white/50 text-[10px] block">{template.category}</span>
                                <div className="flex justify-center gap-1 mt-1.5">
                                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: template.accentColor }} />
                                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: template.accentColor2 }} />
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Custom Accent Color */}
                      <div>
                        <label htmlFor="accentColor" className="block text-sm font-medium text-white/80 mb-2">
                          Warna Aksen (Custom)
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            id="accentColor"
                            type="color"
                            value={formData.accentColor}
                            onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                            className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                          />
                          <input
                            type="text"
                            value={formData.accentColor}
                            onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 font-mono"
                          />
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {["#f43f5e", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#84cc16"].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, accentColor: color }))}
                              className="w-8 h-8 rounded-full border-2 border-white/20 hover:border-white/50 transition-all"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Cover Image */}
                      <div>
                        <label htmlFor="coverImage" className="block text-sm font-medium text-white/80 mb-2">
                          <ImageIcon className="w-4 h-4 inline mr-1" />
                          Imej Liputan (Cover)
                        </label>
                        <div className="flex items-center gap-4">
                          <label className="flex-1 cursor-pointer">
                            <div className={`p-6 rounded-xl border-2 border-dashed text-center transition-all ${
                              formData.coverImage 
                                ? "border-emerald-500/40 bg-emerald-500/10" 
                                : "border-white/20 bg-white/5 hover:bg-white/10"
                            }`}>
                              {formData.coverImage ? (
                                <div className="space-y-2">
                                  <img src={formData.coverImage} alt="Cover" className="w-full h-32 object-cover rounded-lg" />
                                  <p className="text-sm text-emerald-300">✓ Imej dimuat naik</p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <ImageIcon className="w-8 h-8 text-white/30 mx-auto" />
                                  <p className="text-sm text-white/50">Klik untuk muat naik imej</p>
                                  <p className="text-xs text-white/30">PNG, JPG, GIF (max 5MB)</p>
                                </div>
                              )}
                            </div>
                            <input
                              id="coverImage"
                              type="file"
                              accept="image/*"
                              onChange={handleCoverImageUpload}
                              className="hidden"
                            />
                          </label>
                          {formData.coverImage && (
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, coverImage: "" }))}
                              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-rose-300 hover:border-rose-500/30 transition-all"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Live Preview */}
                <GlassCard variant="dark" glow="purple">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    👁️ Pratonton Tema (Live)
                  </h4>
                  <div 
                    className="rounded-2xl p-6 border transition-all duration-300"
                    style={{
                      background: themeBackground(formData.theme),
                      borderColor: `${formData.accentColor}30`
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: formData.accentColor }}
                        >
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{formData.title || "Nama Acara"}</p>
                          <p className="text-white/60 text-xs">{templates.find(t => t.accentColor.toLowerCase() === formData.accentColor.toLowerCase())?.name || formData.theme}</p>
                        </div>
                      </div>
                      {formData.coverImage && (
                        <img src={formData.coverImage} alt="Cover Preview" className="w-full h-24 object-cover rounded-lg" />
                      )}
                      <div className="flex gap-2">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: formData.accentColor }}
                        >
                          {eventTypes.find(t => t.value === formData.eventType)?.icon} {eventTypes.find(t => t.value === formData.eventType)?.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Navigation */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Seterusnya
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Social Media & Review */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard variant="light" glow="blue">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-sm text-blue-400">4</span>
                      Media Sosial & Semakan
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Facebook */}
                      <div>
                        <label htmlFor="facebookLink" className="block text-sm font-medium text-white/80 mb-2">
                          <Globe className="w-4 h-4 inline mr-1" />
                          Facebook Event Page
                        </label>
                        <input
                          id="facebookLink"
                          type="url"
                          value={formData.facebookLink}
                          onChange={(e) => setFormData(prev => ({ ...prev, facebookLink: e.target.value }))}
                          placeholder="https://facebook.com/events/..."
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      {/* Instagram */}
                      <div>
                        <label htmlFor="instagramLink" className="block text-sm font-medium text-white/80 mb-2">
                          <Smartphone className="w-4 h-4 inline mr-1" />
                          Instagram Hashtag / Page
                        </label>
                        <input
                          id="instagramLink"
                          type="url"
                          value={formData.instagramLink}
                          onChange={(e) => setFormData(prev => ({ ...prev, instagramLink: e.target.value }))}
                          placeholder="https://instagram.com/..."
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      {/* WhatsApp */}
                      <div>
                        <label htmlFor="whatsappLink" className="block text-sm font-medium text-white/80 mb-2">
                          <Smartphone className="w-4 h-4 inline mr-1" />
                          WhatsApp Group / Link
                        </label>
                        <input
                          id="whatsappLink"
                          type="url"
                          value={formData.whatsappLink}
                          onChange={(e) => setFormData(prev => ({ ...prev, whatsappLink: e.target.value }))}
                          placeholder="https://chat.whatsapp.com/..."
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      {/* Website */}
                      <div>
                        <label htmlFor="websiteLink" className="block text-sm font-medium text-white/80 mb-2">
                          <Globe className="w-4 h-4 inline mr-1" />
                          Website Acara (Pilihan)
                        </label>
                        <input
                          id="websiteLink"
                          type="url"
                          value={formData.websiteLink}
                          onChange={(e) => setFormData(prev => ({ ...prev, websiteLink: e.target.value }))}
                          placeholder="https://your-event-website.com"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
                        />
                      </div>

                      {/* Review Summary */}
                      <div className="pt-4 border-t border-white/10">
                        <h4 className="text-sm font-bold text-white mb-3">📋 Ringkasan Acara</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-white/50">Jenis Acara</span>
                            <span className="text-white font-medium">{eventTypes.find(t => t.value === formData.eventType)?.label}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-white/50">Nama</span>
                            <span className="text-white font-medium">{formData.title || "-"}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-white/50">URL</span>
                            <span className="text-emerald-300 font-mono text-xs">/e/{formData.slug || "-"}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-white/50">Tarikh</span>
                            <span className="text-white font-medium">{formData.eventDate ? new Date(formData.eventDate).toLocaleDateString("ms-MY", { dateStyle: "full" }) : "-"}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-white/50">Venue</span>
                            <span className="text-white font-medium">{formData.venueName || "-"}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-white/5">
                            <span className="text-white/50">Tema</span>
                            <span className="text-white font-medium">{templates.find(t => t.accentColor.toLowerCase() === formData.accentColor.toLowerCase())?.name || formData.theme}</span>
                          </div>
                          {formData.dressCode && (
                            <div className="flex justify-between py-2 border-b border-white/5">
                              <span className="text-white/50">Dress Code</span>
                              <span className="text-white font-medium">{dressCodes.find(d => d.value === formData.dressCode)?.label}</span>
                            </div>
                          )}
                          {formData.rsvpDeadline && (
                            <div className="flex justify-between py-2 border-b border-white/5">
                              <span className="text-white/50">RSVP Limit</span>
                              <span className="text-white font-medium">{new Date(formData.rsvpDeadline).toLocaleDateString("ms-MY")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Navigation */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:from-blue-600 hover:to-indigo-600 transition-all shadow-lg"
                  >
                    Semak & Cipta Acara
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Review & Create */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard variant="light" glow="emerald">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm text-emerald-400">✓</span>
                      Semakan Akhir & Cipta
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Success Banner */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-emerald-300 font-semibold text-sm mb-1">✅ Semua Maklumat Lengkap!</p>
                            <p className="text-emerald-200/70 text-xs">Semak ringkasan di bawah, kemudian klik "Cipta Acara" untuk mula.</p>
                          </div>
                        </div>
                      </div>

                      {/* Full Summary */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white mb-3">📋 Ringkasan Penuh Acara</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Basic Info */}
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xs text-white/40 mb-2">BUTIRAN ASAS</p>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-white/50">Jenis</p>
                                <p className="text-white font-medium text-sm">{eventTypes.find(t => t.value === formData.eventType)?.icon} {eventTypes.find(t => t.value === formData.eventType)?.label}</p>
                              </div>
                              <div>
                                <p className="text-xs text-white/50">Nama Acara</p>
                                <p className="text-white font-medium text-sm">{formData.title || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-white/50">URL</p>
                                <p className="text-emerald-300 font-mono text-xs">beasy.my/e/{formData.slug || "-"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-white/50">Tarikh & Masa</p>
                                <p className="text-white font-medium text-sm">
                                  {formData.eventDate ? (
                                    (() => {
                                      const d = new Date(formData.eventDate)
                                      return d.toLocaleDateString("ms-MY", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                      }) + " • " + d.toLocaleTimeString("ms-MY", {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })
                                    })()
                                  ) : "-"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Venue Info */}
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xs text-white/40 mb-2">LOKASI</p>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-white/50">Venue</p>
                                <p className="text-white font-medium text-sm">{formData.venueName || "Tidak ditetapkan"}</p>
                              </div>
                              {formData.dressCode && (
                                <div>
                                  <p className="text-xs text-white/50">Dress Code</p>
                                  <p className="text-white font-medium text-sm">{dressCodes.find(d => d.value === formData.dressCode)?.icon} {dressCodes.find(d => d.value === formData.dressCode)?.label}</p>
                                </div>
                              )}
                              {formData.rsvpDeadline && (
                                <div>
                                  <p className="text-xs text-white/50">RSVP Limit</p>
                                  <p className="text-white font-medium text-sm">{new Date(formData.rsvpDeadline).toLocaleDateString("ms-MY")}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Theme Info */}
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xs text-white/40 mb-2">TEMA & PENJUMUDKAN</p>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-white/50">Tema</p>
                                <p className="text-white font-medium text-sm">{templates.find(t => t.accentColor.toLowerCase() === formData.accentColor.toLowerCase())?.name || formData.theme}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-white/50">Warna Aksen</p>
                                <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: formData.accentColor }} />
                              </div>
                              {formData.coverImage && (
                                <div>
                                  <p className="text-xs text-white/50">Cover Image</p>
                                  <p className="text-emerald-300 text-sm">✓ Dimuat naik</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Social Links */}
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xs text-white/40 mb-2">MEDIA SOSIAL</p>
                            <div className="space-y-1 text-sm">
                              {formData.facebookLink && <p className="text-white/70 text-xs">🌐 Facebook</p>}
                              {formData.instagramLink && <p className="text-white/70 text-xs">📱 Instagram</p>}
                              {formData.whatsappLink && <p className="text-white/70 text-xs">💬 WhatsApp</p>}
                              {formData.websiteLink && <p className="text-white/70 text-xs">🔗 Website</p>}
                              {!formData.facebookLink && !formData.instagramLink && !formData.whatsappLink && !formData.websiteLink && (
                                <p className="text-white/30 text-xs">Tiada pautan ditambah</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {formData.description && (
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xs text-white/40 mb-2">DESKRIPSI</p>
                            <p className="text-white/80 text-sm">{formData.description}</p>
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !formData.title || !formData.eventDate}
                        className="flex items-center justify-center gap-3 w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Mencipta Acara...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-6 h-6" />
                            🎉 Cipta Acara Percuma Sekarang
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </GlassCard>

                {/* Navigation */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </button>
                  <button
                    type="button"
                    onClick={handleContinueToDashboard}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/60 font-medium hover:bg-white/10 transition-all"
                  >
                    Skip — Terus ke Dashboard
                  </button>
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {success && createdEvent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <GlassCard variant="light" glow="emerald">
                  <div className="text-center space-y-6 py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
                    >
                      <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">🎉 Acara Berjaya Dicipta!</h3>
                      <p className="text-white/60">Acara anda sudah sedia dan boleh dikongsi dengan tetamu.</p>
                      
                      {/* Free vs Premium Summary */}
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <p className="text-xs text-emerald-400 font-semibold mb-2">✅ AKTIF SEKARANG (PERCUMA)</p>
                          <ul className="text-xs text-emerald-200/70 space-y-1">
                            <li>• Event page published</li>
                            <li>• RSVP enabled</li>
                            <li>• Theme & custom URL</li>
                          </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <p className="text-xs text-amber-400 font-semibold mb-2">💎 UPGRADE TO PREMIUM — RM159</p>
                          <ul className="text-xs text-amber-200/70 space-y-1">
                            <li>• Location & Maps</li>
                            <li>• Wishes & Photo Upload</li>
                            <li>• Audio Guestbook</li>
                            <li>• Digital Angpao</li>
                            <li>• Google Drive Backup</li>
                          </ul>
                          <button className="mt-3 w-full py-2 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-medium hover:bg-amber-500/30 transition-all">
                            Upgrade Sekarang
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Event Link */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-white/40 mb-2">Pautan Acara Anda:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-emerald-300 font-mono text-sm bg-white/5 px-3 py-2 rounded-lg">
                          beasy.my/e/{createdEvent.event?.slug || createdEvent.slug}
                        </code>
                        <button
                          onClick={() => navigator.clipboard.writeText(`beasy.my/e/${createdEvent.event?.slug || createdEvent.slug}`)}
                          className="px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs hover:bg-emerald-500/30 transition-all"
                        >
                          Salin
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Link href={`/e/${createdEvent.event?.slug || createdEvent.slug}`}>
                        <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium hover:from-emerald-600 hover:to-teal-600 transition-all">
                          <Sparkles className="w-4 h-4" />
                          Lihat Acara
                        </button>
                      </Link>
                      <button
                        onClick={handleContinueToDashboard}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Dashboard
                      </button>
                    </div>

                    {/* Optional Setup */}
                    <div className="pt-6 border-t border-white/10 space-y-3">
                      <p className="text-sm text-white/60">✨ Setup Tambahan (Pilihan):</p>
                      
                      <button
                        onClick={() => setShowAngpaoSetup(!showAngpaoSetup)}
                        className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🧧</span>
                          <div className="text-left">
                            <p className="text-white font-medium text-sm">Digital Angpao</p>
                            <p className="text-white/40 text-xs">Terima sumbangan bank transfer</p>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showAngpaoSetup ? "rotate-180" : ""}`} />
                      </button>

                      {showAngpaoSetup && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                        >
                          <p className="text-sm text-emerald-300 mb-3">Untuk aktifkan Digital Angpao:</p>
                          <ol className="text-xs text-white/60 space-y-1 list-decimal list-inside">
                            <li>Pergi ke Dashboard → Edit acara ini</li>
                            <li>Tambah maklumat akaun bank</li>
                            <li>Simpan perubahan</li>
                          </ol>
                          <p className="text-xs text-white/40 mt-2">Angpao akan muncul di halaman acara secara automatik.</p>
                        </motion.div>
                      )}

                      <button
                        onClick={() => setShowDriveSetup(!showDriveSetup)}
                        className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">💎</span>
                          <div className="text-left">
                            <p className="text-white font-medium text-sm">Google Drive Backup</p>
                            <p className="text-white/40 text-xs">Auto-save semua upload ke cloud</p>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showDriveSetup ? "rotate-180" : ""}`} />
                      </button>

                      {showDriveSetup && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
                        >
                          <p className="text-sm text-amber-300 mb-2">💎 Ciri Premium — RM159 one-time payment</p>
                          <p className="text-xs text-white/60 mb-3">Auto-save semua foto, audio, dan video ke Google Drive anda.</p>
                          <button className="w-full py-2 rounded-lg bg-amber-500/20 text-amber-300 text-sm font-medium hover:bg-amber-500/30 transition-all">
                            Kemas Kini ke Premium
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  )
}
