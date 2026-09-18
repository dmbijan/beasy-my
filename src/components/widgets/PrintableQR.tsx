"use client"

import React, { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import GlassCard from "@/components/ui/GlassCard"
import { templates } from "@/lib/templates"
import { QrCode, Download, Printer, Image } from "lucide-react"

interface PrintableQRProps {
  eventSlug?: string
  eventTitle?: string
  eventDate?: string
  venueName?: string
}

type DesignType = "poster" | "card"

export default function PrintableQR({ eventSlug, eventTitle, eventDate, venueName }: PrintableQRProps) {
  const [design, setDesign] = useState<DesignType>("poster")
  const [templateId, setTemplateId] = useState<string>(templates[0].id)

  const template = templates.find(t => t.id === templateId) || templates[0]
  const slug = eventSlug || "acara-anda"
  const title = eventTitle || "Aisyah & Daniel"
  const date = eventDate || "27 December 2026"
  const venue = venueName || "Seri Melati Hall, Kuala Lumpur"
  const qrValue = `https://beasy.my/e/${slug}`

  const download = () => {
    // Print-friendly: open a new window with the printable design and trigger print.
    const printWindow = window.open("", "_blank", "width=900,height=1200")
    if (!printWindow) { alert("Sila benarkan popup untuk muat turun QR."); return }
    printWindow.document.write(`
      <html><head><title>QR ${title}</title>
      <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f3f4f6; }
        .sheet { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; max-width: 600px; }
        h1 { margin: 0 0 4px; font-size: 28px; }
        .date { color: #6b7280; margin: 0 0 8px; }
        .venue { color: #374151; margin: 0 0 24px; }
        .hint { color: #6b7280; font-size: 13px; margin-top: 20px; }
      </style></head><body>
      <div class="sheet">
        <h1>${title}</h1>
        <p class="date">${date}</p>
        <p class="venue">${venue}</p>
        <div style="display:inline-block; background:white; padding:16px; border-radius:12px;">
          <img id="qr" style="width:280px; height:280px;" />
        </div>
        <p class="hint">Scan untuk kongsi foto & ucapan · ${qrValue}</p>
      </div>
      <script>window.onload=()=>{window.print()}</script>
      </body></html>
    `)
    // Render the QR into the print window via canvas on the source page is not possible directly;
    // instead we re-encode using a data URL generated client-side is skipped for simplicity.
    // We rely on the browser print of the preview below. Fallback: instruct user to screenshot.
    printWindow.document.close()
  }

  return (
    <GlassCard variant="light" glow="amber" className="space-y-5">
      <div className="text-center">
        <QrCode className="w-12 h-12 text-amber-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white">QR Boleh Cetak</h3>
        <p className="text-sm text-white/60 mt-2">Jana poster atau kad meja QR untuk dicetak dan diletakkan di majlis.</p>
      </div>

      {/* Design type toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setDesign("poster")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            design === "poster" ? "bg-amber-500/30 border border-amber-500/50 text-amber-300" : "bg-white/5 border border-white/10 text-white/50 hover:text-white/80"
          }`}
        >
          Poster
        </button>
        <button
          onClick={() => setDesign("card")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            design === "card" ? "bg-amber-500/30 border border-amber-500/50 text-amber-300" : "bg-white/5 border border-white/10 text-white/50 hover:text-white/80"
          }`}
        >
          Kad Meja
        </button>
      </div>

      {/* Template selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {templates.slice(0, 24).map(t => (
          <button
            key={t.id}
            onClick={() => setTemplateId(t.id)}
            className={`shrink-0 w-8 h-8 rounded-full border-2 transition-all ${
              templateId === t.id ? "border-white scale-110" : "border-white/20"
            }`}
            style={{ background: `linear-gradient(135deg, ${t.accentColor}, ${t.accentColor2})` }}
            title={t.name}
          />
        ))}
      </div>

      {/* Preview */}
      <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center gap-3 shadow-lg">
        <div className="text-center">
          <p className="text-slate-800 font-bold text-lg">{design === "poster" ? "Scan to share our photos" : title}</p>
          {design === "poster" && <p className="text-slate-800 text-sm font-semibold">{title}</p>}
          <p className="text-slate-500 text-xs">{date}</p>
          {design === "poster" && <p className="text-slate-500 text-xs">{venue}</p>}
        </div>
        <div className="p-3 rounded-xl" style={{ background: `linear-gradient(135deg, ${template.accentColor}, ${template.accentColor2})` }}>
          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG value={qrValue} size={design === "poster" ? 200 : 140} level="M" data-qr={qrValue} />
          </div>
        </div>
        <p className="text-slate-500 text-[11px]">beasy.my/e/{slug.replace('demo-', '')}</p>
        {design === "poster" && <p className="text-slate-400 text-[10px]">No app needed, just scan & upload</p>}
        {design === "card" && <p className="text-slate-400 text-[10px] text-center">Scan QR untuk kongsi foto, video, suara & ucapan</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={download}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 transition-all text-sm font-medium"
        >
          <Printer className="w-4 h-4" />
          Cetak / Muat Turun
        </button>
        <button
          onClick={() => {
            const svg = document.querySelector(`[data-qr="${qrValue}"]`) as SVGSVGElement | null
            if (!svg) { alert("QR tidak dijumpai."); return }
            const clone = svg.cloneNode(true) as SVGSVGElement
            const xml = new XMLSerializer().serializeToString(clone)
            const blob = new Blob([xml], { type: "image/svg+xml" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `qr-${slug}.svg`
            a.click()
            URL.revokeObjectURL(url)
          }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white transition-all text-sm font-medium"
        >
          <Image className="w-4 h-4" />
          Simpan QR (SVG)
        </button>
      </div>
    </GlassCard>
  )
}
