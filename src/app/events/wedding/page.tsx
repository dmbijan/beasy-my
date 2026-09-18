import type { Metadata } from "next"
import Link from "next/link"
import { Heart, ArrowRight, Sparkles, Camera, Mic2, CalendarCheck } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"

export const metadata: Metadata = {
  title: "Jemputan Kahwin Digital Malaysia | Beasy.my",
  description: "Buat jemputan kahwin digital yang cantik dan profesional secara percuma. Template melayu islamic, RSVP online, galeri foto, audio guestbook dan banyak lagi.",
  keywords: ["jemputan kahwin digital", "undangan perkahwinan online", "template jemputan kahwin melayu", "rsvp online malaysia"],
  openGraph: {
    title: "Jemputan Kahwin Digital - Beasy.my",
    description: "Platform jemputan kahwin digital #1 Malaysia",
    type: "website",
    locale: "ms_MY",
    siteName: "Beasy.my",
  },
}

const features = [
  { icon: Sparkles, title: "114+ Template Kahwin", desc: "Motion, Floral, Khat Islamik, Luxury, Simple & Traditional" },
  { icon: Camera, title: "Galeri Foto & Video", desc: "Upload dan kongsi momen istimewa anda" },
  { icon: Mic2, title: "Audio Guestbook", desc: "Ucapan dan doa dari tetamu dalam bentuk audio" },
  { icon: CalendarCheck, title: "RSVP Online", desc: "Pengurusan tetamu yang mudah dan efisien" },
]

const weddingCategories = [
  { name: "Motion", desc: "Gradient bercahaya & dinamik", gradient: "from-rose-500 via-purple-500 to-indigo-500" },
  { name: "Floral", desc: "Palet bunga romantik", gradient: "from-pink-400 to-rose-500" },
  { name: "Khat", desc: "Seni khat Islamik & emas", gradient: "from-amber-500 to-yellow-600" },
  { name: "Luxury", desc: "Premium emas & navy", gradient: "from-slate-900 to-amber-600" },
  { name: "Simple", desc: "Minimal & bersih", gradient: "from-white to-slate-200" },
  { name: "Traditional", desc: "Songket & batik Melayu", gradient: "from-red-700 to-rose-600" },
]

const benefits = [
  "Percuma untuk asas — tiada kad kredit diperlukan",
  "Setup dalam 5 minit sahaja",
  "Boleh kongsi melalui WhatsApp, Telegram & social media",
  "SEO optimized — tetamu boleh cari event anda di Google",
  "Payment gateway untuk angpao & hadiah cash",
  "Moderation workflow untuk keselamatan gambar",
]

export default function WeddingLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          Jemputan Kahwin Digital Terbaik di Malaysia
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Cipta jemputan perkahwinan digital yang memukau dengan template melayu islamic, 
          RSVP online, galeri foto, dan audio guestbook. Percuma untuk mulakan!
        </p>
        <Link href="/e/demo-perkahwinan-aiman-sarah" className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all">
          Lihat Demo <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Template Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">114+ Template Kahwin Digital</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          6 kategori eksklusif untuk majlis perkahwinan — daripada khat Islamik, bunga romantik, hingga songket tradisional.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {weddingCategories.map((cat, i) => (
            <Link key={i} href="/templates" className="block group">
              <div className="rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                <div className={`h-20 bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}>
                  <span className="text-white font-bold drop-shadow">You're Invited</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 group-hover:text-rose-600 transition">{cat.name}</h3>
                  <p className="text-sm text-gray-500">{cat.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/templates" className="inline-flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition">
            Lihat Semua Template <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Fitur Lengkap Untuk Majlis Perkahwinan</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <GlassCard key={i} className="p-6 text-center">
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-rose-500" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Benefits List */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Kenapa Pilih Beasy.my?</h2>
          <ul className="space-y-4">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3 p-4 bg-white/50 rounded-lg">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-3xl mx-4 my-12">
        <h2 className="text-3xl font-bold mb-4">Mula Buat Jemputan Kahwin Sekarang!</h2>
        <p className="text-lg mb-8 opacity-90">Percuma. Cepat. Profesional.</p>
        <Link href="/dashboard/create" className="inline-flex items-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all">
          Create Jemputan <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  )
}
