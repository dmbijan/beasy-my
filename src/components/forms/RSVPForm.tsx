"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import GlassCard from "@/components/ui/GlassCard"
import { QRCodeSVG } from "qrcode.react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CheckCircle, User, Phone, Users, Shield, Info } from "lucide-react"

// ✅ SECURITY FIX: Add privacy_consent to schema
const rsvpSchema = z.object({
  guestName: z.string().trim().min(2, "Nama mesti sekurang-kurangnya 2 aksara").max(255),
  phoneNumber: z.string().trim().min(8, "Nombor telefon tidak sah").max(30).regex(/^\+?[0-9 ()-]+$/, "Nombor telefon tidak sah"),
  pax: z.number().int().min(1).max(10),
  privacyConsent: z.boolean().refine((v) => v === true, {
    message: "Anda perlu bersetuju sebelum menghantar RSVP",
  }),
})

type RSVPFormValues = z.infer<typeof rsvpSchema>

interface RSVPFormProps {
  eventId: string
  onSuccess?: (data: RSVPFormValues & { qrToken: string }) => void
  guestToken?: string | null
  preFillName?: string | null
}

export default function RSVPForm({ eventId, onSuccess, guestToken, preFillName }: RSVPFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [qrToken, setQrToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      guestName: preFillName || "",
      phoneNumber: "",
      pax: 1,
      privacyConsent: false,
    },
  })
  const privacyConsent = form.watch("privacyConsent")

  useEffect(() => {
    setSubmitted(false)
    setQrToken("")
    setError(null)
  }, [eventId])

  // Update form when preFillName changes
  useEffect(() => {
    if (preFillName) {
      form.setValue('guestName', preFillName)
    }
  }, [preFillName, form])

  async function onSubmit(data: RSVPFormValues) {
    setLoading(true)
    
    setError(null)
    
    try {
      // Call API route to save RSVP
      const response = await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          ...data,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Gagal menghantar RSVP")
      if (result.success !== true || typeof result.qrToken !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(result.qrToken)) {
        throw new Error("Respons RSVP tidak sah. Sila hubungi tuan rumah sebelum cuba lagi.")
      }

      setQrToken(result.qrToken)
      setSubmitted(true)
      onSuccess?.({ ...data, qrToken: result.qrToken })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Gagal menghantar RSVP")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 p-8"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            RSVP Berjaya! 🎉
          </h3>
          <p className="text-white/60 text-sm">
            Terima kasih {form.getValues("guestName")}! Kami sudah mencatat kehadiran anda.
          </p>
        </div>
        
        {/* QR Code Display */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="p-4 rounded-3xl bg-white border-4 border-white shadow-glass-lg">
            <div className="w-48 h-48 bg-white flex items-center justify-center">
              <QRCodeSVG value={qrToken} size={192} level="M" title="Kod QR check-in RSVP" />
            </div>
          </div>
          <p className="text-xs text-white/50 text-center">
            Tunjukkan kod QR ini semasa check-in di lokasi majlis
          </p>
          <p className="text-xs text-white/60">Simpan tangkap layar ini. Kod manual (rahsia):</p>
          <code className="max-w-full break-all select-all text-xs text-white/80">{qrToken}</code>
        </div>
      </motion.div>
    )
  }

  return (
    <GlassCard variant="light" glow="emerald" className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">Borang RSVP</h3>
        <p className="text-white/60 text-sm">
          Sila isi maklumat untuk mengesahkan kehadiran anda
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Guest Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Nama Penuh</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              {...form.register("guestName")}
              placeholder="Masukkan nama penuh"
              className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
          {form.formState.errors.guestName && (
            <p className="text-xs text-rose-400">{form.formState.errors.guestName.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Nombor Telefon</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              {...form.register("phoneNumber")}
              type="tel"
              placeholder="Cth: 012-3456789"
              className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>
          {form.formState.errors.phoneNumber && (
            <p className="text-xs text-rose-400">{form.formState.errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Pax Count */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/80">Bilangan Pax</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <select
              {...form.register("pax", { valueAsNumber: true })}
              className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num} className="bg-slate-900 text-white">
                  {num} Pax
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ✅ SECURITY FIX: Privacy Consent Checkbox (PDPA 2010) */}
        <div className="space-y-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                {...form.register("privacyConsent")}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded border-2 border-white/20 bg-white/5 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all flex items-center justify-center">
                {privacyConsent && (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
            <span className="text-xs text-white/60 leading-relaxed">
              Saya bersetuju bahawa data peribadi saya (nama & nombor telefon) akan dikumpul oleh{" "}
              <strong className="text-white/80">tuan rumah majlis ini</strong> untuk tujuan pengurusan kehadiran sahaja.
              Hubungi tuan rumah untuk pertanyaan mengenai tempoh simpanan atau pemadaman data.
              {" "}Mengikut{" "}
              <a href="https://www.pdpa.gov.my" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline">
                PDPA 2010
              </a>
              .
            </span>
          </label>
          {form.formState.errors.privacyConsent && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              {form.formState.errors.privacyConsent.message}
            </p>
          )}
        </div>

        {/* Privacy Notice Footer */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-blue-300/80 leading-relaxed">
            💡 <strong>Kenapa kami kumpul data ini?</strong> Tuan rumah majlis memerlukan maklumat anda untuk mengira bilangan tetamu,
            menyediakan tempat duduk, dan kemudahan check-in. Anda boleh hubungi tuan rumah jika ada pertanyaan tentang penggunaan data.
          </p>
        </div>

        {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading || !privacyConsent}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg border border-white/20 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Memproses...
            </span>
          ) : (
            "Hantar RSVP"
          )}
        </motion.button>
      </form>
    </GlassCard>
  )
}
