import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, Sparkles, Camera, Mic2, Gift, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "Panduan Lengkap Buat Jemputan Kahwin Digital Malaysia 2025 | Beasy.my",
  description: "Panduan step-by-step cara buat jemputan kahwin digital yang cantik dan profesional secara percuma. Template melayu islamic, RSVP online, galeri foto, audio guestbook dan payment gateway.",
  keywords: [
    "cara buat jemputan kahwin digital",
    "panduan jemputan kahwin online",
    "template jemputan kahwin melayu",
    "undangan perkahwinan digital malaysia",
    "jemputan kahwin free",
    "rsvp online kahwin",
  ],
  openGraph: {
    title: "Panduan Buat Jemputan Kahwin Digital - Beasy.my",
    description: "Panduan lengkap step-by-step buat jemputan kahwin digital percuma di Malaysia",
    type: "article",
    locale: "ms_MY",
    siteName: "Beasy.my",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Panduan Buat Jemputan Kahwin Digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Panduan Buat Jemputan Kahwin Digital",
    description: "Panduan lengkap step-by-step buat jemputan kahwin digital percuma",
  },
}

const steps = [
  {
    icon: Calendar,
    number: "01",
    title: "Daftar Akaun Percuma",
    content: (
      <>
        <p className="mb-4">
          Langkah pertama, daftar akaun percuma di{" "}
          <Link href="/auth/signin" className="text-indigo-400 hover:text-indigo-300 underline">
            Beasy.my
          </Link>
          . Tiada kad kredit diperlukan untuk versi asas. Anda boleh upgrade ke premium bila-bila masa.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <h4 className="font-semibold text-rose-400 mb-2">Apa anda dapat:</h4>
          <ul className="space-y-2 text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>88+ template jemputan yang boleh custom sepenuhnya</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Galeri foto & video tanpa had muat naik</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>RSVP online dengan pengurusan tetamu</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Audio guestbook untuk ucapan dari tetamu</span>
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Pilih Template Yang Sesuai",
    content: (
      <>
        <p className="mb-4">
          Beasy.my menyediakan{" "}
          <strong className="text-white">88+ template premium</strong> yang direka khas untuk majlis perkahwinan Malaysia. 
          Dari gaya melayu islamic klasik hingga modern minimalist.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { name: "Melayu Islamic", color: "from-emerald-500 to-green-600" },
            { name: "Modern Minimalist", color: "from-slate-500 to-gray-600" },
            { name: "Floral Romance", color: "from-pink-500 to-rose-600" },
            { name: "Royal Classic", color: "from-amber-500 to-yellow-600" },
            { name: "Boho Chic", color: "from-orange-500 to-amber-600" },
            { name: "Vintage Elegant", color: "from-purple-500 to-indigo-600" },
          ].map((style) => (
            <div key={style.name} className={`bg-gradient-to-br ${style.color} rounded-lg p-3 text-center`}>
              <span className="text-white font-medium text-sm">{style.name}</span>
            </div>
          ))}
        </div>
        <p className="text-white/60 text-sm">
          💡 Tip: Pilih template yang sesuai dengan tema majlis anda. Jangan lupa preview sebelum pilih!
        </p>
      </>
    ),
  },
  {
    icon: Heart,
    number: "03",
    title: "Isi Butiran Majlis",
    content: (
      <>
        <p className="mb-4">Masukkan semua butiran penting untuk jemputan anda:</p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          {[
            { label: "Nama Pengantin", example: 'Ahmad & Siti' },
            { label: "Tarikh & Masa", example: "Sabtu, 15 Mac 2025, 11:00 AM" },
            { label: "Venue", example: "Dewan Serbaguna KLCC, Kuala Lumpur" },
            { label: "Akad Nikah", example: "9:00 AM - 10:00 AM" },
            { label: "Resepsi", example: "12:00 PM - 3:00 PM" },
            { label: "Description", example: "Doa bersama agar diberkati Allah SWT" },
          ].map((field) => (
            <div key={field.label} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
              <span className="text-white/60 text-sm">{field.label}</span>
              <span className="text-white text-sm font-mono">{field.example}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    icon: Camera,
    number: "04",
    title: "Upload Gambar & Media",
    content: (
      <>
        <p className="mb-4">
          Tambah gambar pre-wedding, cover jemputan, dan media lain untuk mempercantikkan jemputan anda.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h4 className="font-semibold text-rose-400 mb-3">Fitur media yang tersedia:</h4>
          <ul className="space-y-2 text-white/70">
            <li className="flex items-start gap-2">
              <Camera className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
              <span><strong>Cover Image</strong> — Gambar utama yang muncul dalam carian Google & social media</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
              <span><strong>Gallery</strong> — Koleksi gambar pre-wedding & kenangan berdua</span>
            </li>
            <li className="flex items-start gap-2">
              <Mic2 className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
              <span><strong>Audio Guestbook</strong> — Tetamu rakam ucapan langsung dari browser</span>
            </li>
            <li className="flex items-start gap-2">
              <Gift className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
              <span><strong>Wish Form</strong> — Borang doa & harapan dari rakan & keluarga</span>
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    icon: Mic2,
    number: "05",
    title: "Setup RSVP & Payment Gateway",
    content: (
      <>
        <p className="mb-4">
          Aktifkan RSVP untuk track kehadiran tetamu dan payment gateway untuk menerima angpao digital.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-semibold text-emerald-400 mb-2">RSVP Online</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>• Track kehadiran real-time</li>
              <li>• Jumlah hadir vs tidak hadir</li>
              <li>• Notifikasi automatik</li>
              <li>• Pengurusan meja makan</li>
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h4 className="font-semibold text-amber-400 mb-2">Payment Gateway</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>• Angpao digital (ToyyibPay)</li>
              <li>• Settlement terus ke bank</li>
              <li>• Receipt automatik</li>
              <li>• Laporan lengkap</li>
            </ul>
          </div>
        </div>
        <p className="text-white/60 text-sm">
          💡 Untuk payment gateway, anda perlukan plan premium (RM159 sekali bayar).
        </p>
      </>
    ),
  },
  {
    icon: Gift,
    number: "06",
    title: "Preview & Kongsi Jemputan",
    content: (
      <>
        <p className="mb-4">
          Preview jemputan anda untuk pastikan semuanya sempurna, kemudian kongsi melalui pelbagai channel.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <h4 className="font-semibold text-rose-400 mb-3">Cara Kongsi Jemputan:</h4>
          <div className="space-y-3">
            {[
              { platform: "WhatsApp", method: "Kongsi link atau QR code", tip: "Tambah mesej peribadi untuk kesan lebih" },
              { platform: "Instagram/Facebook", method: "Post link di bio/story", tip: "Gunakan thumbnail yang menarik" },
              { platform: "Telegram", method: "Forward ke group keluarga", tip: "Buat pin untuk info penting" },
              { platform: "Print QR Code", method: "QR di meja resepsi / entrance dewan", tip: "Tetamu scan terus upload foto" },
            ].map((share) => (
              <div key={share.platform} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-semibold">{share.platform}</span>
                </div>
                <p className="text-white/60 text-sm ml-4">📌 {share.method}</p>
                <p className="text-white/40 text-xs ml-4">💡 {share.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    ),
  },
]

export default function PanduanJemputanKahwin() {
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
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm mb-6">
            <Clock className="w-4 h-4" />
            Panduan Lengkap • 10 minit baca
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Cara Buat{" "}
            <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              Jemputan Kahwin Digital
            </span>{" "}
            Yang Cantik & Profesional
          </h1>
          
          <p className="text-xl text-white/60 mb-8">
            Panduan step-by-step lengkap untuk pasangan pengantin Malaysia yang nak buat jemputan kahwin digital 
            secara percuma. Setup hanya ambil 5 minit sahaja!
          </p>

          <div className="flex items-center gap-4 text-sm text-white/40">
            <span>Dikemas kini: September 2025</span>
            <span>•</span>
            <span>Oleh Beasy.my Team</span>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">📑 Kandungan</h2>
            <ol className="space-y-2">
              {steps.map((step) => (
                <li key={step.number} className="flex items-center gap-3 text-white/70 hover:text-white cursor-pointer transition">
                  <span className="text-indigo-400 font-bold">{step.number}</span>
                  <span>{step.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-indigo-400 text-sm font-bold">LANGKAH {step.number}</span>
                  <h2 className="text-2xl font-bold text-white mt-1">{step.title}</h2>
                </div>
              </div>
              <div className="text-white/80 leading-relaxed">
                {step.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">💡 Tips Tambahan Untuk Jemputan Kahwin Digital</h2>
            <div className="space-y-4">
              {[
                "Gunakan gambar high resolution untuk cover image — ini yang orang nampak pertama kali",
                "Pastikan butiran venue jelas dengan alamat penuh dan parking information",
                "Tambah countdown timer untuk build excitement sampai hari H",
                "Aktifkan audio guestbook — tetamu suka rakam ucapan langsung",
                "Gunakan QR code di meja resepsi untuk tetamu upload foto secara real-time",
                "Test jemputan di mobile device sebelum share — 80% orang buka dari phone",
                "Kongsi jemputan 2-3 minggu sebelum majlis untuk optimum attendance",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-rose-400 font-bold mt-0.5">✦</span>
                  <p className="text-white/80">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Sedia Buat Jemputan Kahwin Digital?
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Ikuti panduan di atas dan mula cipta jemputan kahwin digital yang memukau. 
              Percuma untuk mulakan, tiada kad kredit diperlukan!
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-600 font-semibold text-lg hover:bg-white/90 transition-all shadow-xl"
            >
              Mula Sekarang — Percuma!
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Soalan Lazim Tentang Jemputan Kahwin Digital</h2>
          <div className="space-y-4">
            {[
              {
                q: "Adakah jemputan kahwin digital boleh cari di Google?",
                a: "Ya! Semua jemputan di Beasy.my SEO optimized. Apabila tetamu cari nama pengantin atau tarikh majlis di Google, jemputan digital anda akan muncul dalam carian dengan rich snippets."
              },
              {
                q: "Berapa kos buat jemputan kahwin digital?",
                a: "Anda boleh mula secara PERCUMA dengan fitur asas termasuk template, galeri foto, RSVP dan audio guestbook. Untuk fitur premium seperti payment gateway (angpao digital), custom domain dan analytics lanjutan, kami ada pakej sekali bayar RM159 sahaja."
              },
              {
                q: "Bagaimana tetamu boleh hantar hadiah cash / angpao?",
                a: "Dengan payment gateway ToyyibPay, tetamu boleh hantar angpao digital terus melalui link jemputan. Wang akan settle terus ke akaun bank anda dalam 1-3 hari bekerja."
              },
              {
                q: "Adakah tetamu perlu download aplikasi?",
                a: "Tidak! Semua fungsi Beasy.my boleh diakses terus dari browser telefon. Tetamu cukup imbas QR code atau klik link jemputan. Tiada app perlu install."
              },
              {
                q: "Bolehkah saya custom warna dan design mengikut tema majlis?",
                a: "Ya! Dengan 88+ template premium, anda boleh pilih dan custom sepenuhnya termasuk warna, font, layout dan elemen dekoratif. Setiap template boleh disesuaikan dengan tema majlis anda."
              },
            ].map((faq, i) => (
              <details key={i} className="bg-white/5 border border-white/10 rounded-xl group">
                <summary className="cursor-pointer p-6 font-semibold text-white list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-rose-400 text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-6 text-white/70 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} Beasy.my. Semua hak terpelihara.</p>
          <Link href="/fair-use-policy" className="hover:text-white/70 transition block mt-2">
            Polisi Penggunaan Adil
          </Link>
        </div>
      </footer>
    </div>
  )
}
