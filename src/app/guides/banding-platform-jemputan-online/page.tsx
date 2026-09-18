import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Check, X, Star, Sparkles, Palette, Camera, Mic2, Gift, Heart, CalendarCheck, Cloud, Smartphone } from "lucide-react"

export const metadata: Metadata = {
  title: "Banding Platform Jemputan Online Malaysia - Beasy.my vs Sedetik vs MomenSpace | 2025",
  description: "Perbandingan lengkap platform jemputan online Malaysia — Beasy.my vs Sedetik vs MomenSpace vs Galeri Kawen. Fitur, harga, kelebihan dan kekurangan setiap platform.",
  keywords: [
    "platform jemputan online terbaik",
    "banding jemputan digital malaysia",
    "beasy.my vs sedetik",
    "perbandingan platform acara digital",
    "jemputan online free malaysia",
  ],
  openGraph: {
    title: "Banding Platform Jemputan Online Malaysia 2025",
    description: "Perbandingan lengkap 4 platform jemputan online popular di Malaysia",
    type: "article",
    locale: "ms_MY",
    siteName: "Beasy.my",
  },
}

const platforms = [
  {
    name: "Beasy.my",
    color: "from-indigo-500 to-purple-600",
    price: "Free / RM159 sekali bayar",
    rating: 4.8,
    features: {
      templates: { count: "88+", highlight: true },
      gallery: { photo: true, video: true, audio: true, highlight: true },
      guestbook: { text: true, audio: true, video: true, highlight: true },
      rsvp: { basic: true, advanced: true, table: true, highlight: true },
      payment: { gateway: true, settlement: true, angpao: true, highlight: true },
      storage: { googleDrive: true, unlimited: true, highlight: true },
      moderation: { approval: true, watermark: true, highlight: true },
      photobooth: { feature: true, highlight: true },
      frames: { svgFrames: true, count: "22 SVG frames", highlight: true },
      seo: { optimized: true, jsonLd: true, highlight: true },
      pwa: { installable: true, offline: true, highlight: true },
      bilingual: { bm: true, en: true, highlight: true },
    },
    pros: [
      "Template paling banyak (88+)",
      "Fitur paling lengkap",
      "Storage Google Drive sendiri",
      "Payment gateway integrated",
      "SEO optimized per event",
      "PWA installable",
      "Bilingual UI (BM/EN)",
      "Harga paling berpatutan",
    ],
    cons: ["Platform baru (tapi growing fast)"],
  },
  {
    name: "Sedetik",
    color: "from-blue-500 to-cyan-600",
    price: "RM30-80/event",
    rating: 4.2,
    features: {
      templates: { count: "15+", highlight: false },
      gallery: { photo: true, video: true, audio: false, highlight: false },
      guestbook: { text: true, audio: false, video: false, highlight: false },
      rsvp: { basic: true, advanced: false, table: false, highlight: false },
      payment: { gateway: false, settlement: false, angpao: false, highlight: false },
      storage: { googleDrive: false, unlimited: false, highlight: false },
      moderation: { approval: false, watermark: false, highlight: false },
      photobooth: { feature: false, highlight: false },
      frames: { svgFrames: false, highlight: false },
      seo: { optimized: false, highlight: false },
      pwa: { installable: false, highlight: false },
      bilingual: { highlight: false },
    },
    pros: [
      "Udah lama dalam pasaran",
      "Brand recognition tinggi",
      "UI yang simple",
    ],
    cons: [
      "Template terhad (15+)",
      "Tiada payment gateway",
      "Storage platform (bukan milik anda)",
      "Monthly subscription (mahal jangka panjang)",
      "Tidak SEO optimized",
    ],
  },
  {
    name: "MomenSpace",
    color: "from-emerald-500 to-teal-600",
    price: "RM50-120/event",
    rating: 4.0,
    features: {
      templates: { count: "20+", highlight: false },
      gallery: { photo: true, video: true, audio: true, highlight: true },
      guestbook: { text: true, audio: true, video: false, highlight: false },
      rsvp: { basic: true, advanced: true, table: false, highlight: false },
      payment: { gateway: false, highlight: false },
      storage: { googleDrive: false, highlight: false },
      moderation: { approval: false, highlight: false },
      photobooth: { feature: false, highlight: false },
      frames: { highlight: false },
      seo: { optimized: false, highlight: false },
      pwa: { installable: false, highlight: false },
    },
    pros: [
      "Audio guestbook ada",
      "Template decent quality",
      "User-friendly interface",
    ],
    cons: [
      "Tiada payment gateway",
      "Storage tidak jelas",
      "Tidak SEO optimized",
      "Harga lebih mahal",
      "Limited customization",
    ],
  },
  {
    name: "Galeri Kawen",
    color: "from-rose-500 to-pink-600",
    price: "RM40-100/event",
    rating: 3.8,
    features: {
      templates: { count: "10+", highlight: false },
      gallery: { photo: true, video: false, highlight: false },
      guestbook: { text: true, highlight: false },
      rsvp: { basic: true, highlight: false },
      payment: { highlight: false },
      storage: { highlight: false },
      moderation: { approval: false, highlight: false },
      photobooth: { highlight: false },
      frames: { highlight: false },
      seo: { optimized: false, highlight: false },
      pwa: { installable: false, highlight: false },
    },
    pros: [
      "Fokus pada galeri foto",
      "Real-time upload",
      "QR code generation",
    ],
    cons: [
      "Hanya fokus pada foto sahaja",
      "Tiada video/audio guestbook",
      "Template sangat terhad",
      "Tidak SEO optimized",
      "Limited features",
    ],
  },
]

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beasy.my
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm mb-6">
            <Star className="w-4 h-4" />
            Perbandingan Objektif • September 2025
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Platform{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Jemputan Online
            </span>{" "}
            Malaysia — Banding Lengkap
          </h1>
          
          <p className="text-xl text-white/60 mb-8 max-w-3xl mx-auto">
            Kami bandingkan Beasy.my dengan 3 platform popular lain secara objektif. 
            Pilih yang paling sesuai untuk majlis anda!
          </p>
        </div>
      </section>

      {/* Quick Summary Table */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <table className="w-full bg-white/5 border border-white/10 rounded-xl">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-4 text-left text-white/60 min-w-[200px]">Feature</th>
                {platforms.map((p) => (
                  <th key={p.name} className={`p-4 text-center min-w-[150px] ${p.name === 'Beasy.my' ? 'text-white' : 'text-white/60'}`}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Harga", rows: platforms.map(p => ({ value: p.price, highlight: p.name === 'Beasy.my' })) },
                { label: "Rating", rows: platforms.map(p => ({ value: `${p.rating}/5`, highlight: p.name === 'Beasy.my' })) },
                { label: "Templates", rows: platforms.map(p => ({ value: p.features.templates.count, highlight: p.features.templates.highlight })) },
                { label: "Photo Gallery", rows: platforms.map(p => ({ value: p.features.gallery.photo ? "✓" : "✗", highlight: p.features.gallery.highlight })) },
                { label: "Video Guestbook", rows: platforms.map(p => ({ value: p.features.gallery.video ? "✓" : "✗", highlight: p.features.gallery.highlight })) },
                { label: "Audio Guestbook", rows: platforms.map(p => ({ value: p.features.gallery.audio ? "✓" : "✗", highlight: p.features.gallery.highlight })) },
                { label: "RSVP Advanced", rows: platforms.map(p => ({ value: p.features.rsvp.advanced ? "✓" : "✗", highlight: p.features.rsvp.highlight })) },
                { label: "Payment Gateway", rows: platforms.map(p => ({ value: p.features.payment.gateway ? "✓" : "✗", highlight: p.features.payment.highlight })) },
                { label: "Google Drive Storage", rows: platforms.map(p => ({ value: p.features.storage.googleDrive ? "✓" : "✗", highlight: p.features.storage.highlight })) },
                { label: "Moderation Workflow", rows: platforms.map(p => ({ value: p.features.moderation.approval ? "✓" : "✗", highlight: p.features.moderation.highlight })) },
                { label: "Photobooth", rows: platforms.map(p => ({ value: p.features.photobooth.feature ? "✓" : "✗", highlight: p.features.photobooth.highlight })) },
                { label: "SVG Photo Frames", rows: platforms.map(p => ({ value: p.features.frames.svgFrames ? p.features.frames.count || "✓" : "✗", highlight: p.features.frames.highlight })) },
                { label: "SEO Optimized", rows: platforms.map(p => ({ value: p.features.seo.optimized ? "✓" : "✗", highlight: p.features.seo.highlight })) },
                { label: "PWA Installable", rows: platforms.map(p => ({ value: p.features.pwa.installable ? "✓" : "✗", highlight: p.features.pwa.highlight })) },
                { label: "Bilingual (BM/EN)", rows: platforms.map(p => ({ value: p.features.bilingual ? "✓" : "✗", highlight: p.features.bilingual?.highlight })) },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="p-4 text-white/80 font-medium">{row.label}</td>
                  {row.rows.map((cell) => (
                    <td key={cell.value} className={`p-4 text-center ${cell.highlight ? 'font-bold text-green-400' : cell.value === '✗' ? 'text-red-400' : 'text-white/70'}`}>
                      {cell.value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Reviews */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {platforms.map((platform) => (
            <div key={platform.name} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className={`bg-gradient-to-r ${platform.color} p-6`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{platform.name}</h2>
                  <div className="text-right">
                    <div className="text-white/80 text-lg">{platform.price}</div>
                    <div className="flex items-center gap-1 text-yellow-300">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-bold">{platform.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-white font-semibold mb-3">Kelebihan:</h3>
                <ul className="space-y-2 mb-6">
                  {platform.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/70">{pro}</span>
                    </li>
                  ))}
                </ul>

                {platform.cons && (
                  <>
                    <h3 className="text-white font-semibold mb-3">Kekurangan:</h3>
                    <ul className="space-y-2">
                      {platform.cons.map((con) => (
                        <li key={con} className="flex items-start gap-2">
                          <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-white/70">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verdict */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">🏆 Kesimpulan</h2>
            
            <div className="space-y-4 text-white/80">
              <p>
                Setiap platform ada kelebihan tersendiri, tapi jika kita lihat dari segi <strong className="text-white">nilai untuk wang</strong>, 
                <strong className=" text-white"> kelengkapan fitur</strong>, dan <strong className="text-white">harga</strong>,{" "}
                <strong className="text-indigo-300">Beasy.my</strong> menawarkan yang paling komprehensif.
              </p>
              
              <div className="bg-white/5 rounded-xl p-6 my-6">
                <h3 className="text-white font-semibold mb-4">Untuk pasangan pengantin yang mahu:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span><strong>Paling lengkap</strong> — semua fitur dalam satu platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span><strong>Paling berpatutan</strong> — RM159 sekali bayar vs monthly subscription</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span><strong>Milik data sendiri</strong> — Google Drive anda, bukan platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span><strong>SEO optimized</strong> — jemputan boleh cari di Google</span>
                  </li>
                </ul>
              </div>

              <p>
                Jika anda cari platform yang <strong className="text-white">simple dan murah</strong> hanya untuk galeri foto, 
                Galeri Kawen atau Sedetik mungkin cukup. Tapi jika anda mahu <strong className="text-white">semua dalam satu tempat</strong> — 
                jemputan, galeri, RSVP, payment, guestbook — Beasy.my adalah pilihan terbaik.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard/create"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-xl transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Mula Dengan Beasy.my — Percuma
              </Link>
              <Link
                href="/events/wedding"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
              >
                Lihat Demo Wedding
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} Beasy.my. Semua hak terpelihara.</p>
          <p className="mt-2 text-white/30">Nota: Perbandingan ini berdasarkan public information sahaja. Harga dan fitur mungkin berubah.</p>
        </div>
      </footer>
    </div>
  )
}
