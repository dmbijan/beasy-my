import type { Metadata } from "next"
import Link from "next/link"
import { Baby, ArrowRight, Sparkles, Camera, Heart, Gift } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"

export const metadata: Metadata = {
  title: "Jemputan Aqiqah Digital Malaysia | Beasy.my",
  description: "Buat jemputan majlis aqiqah digital yang cantik dan syarie. Template aqiqah, RSVP online, galeri foto bayi dan wish form untuk ucapan.",
  keywords: ["jemputan aqiqah digital", "undangan aqiqah online", "majlis aqiqah digital", "template aqiqah melayu"],
}

const features = [
  { icon: Sparkles, title: "Template Syarie", desc: "Reka bentuk sopan dan sesuai dengan ajaran Islam" },
  { icon: Camera, title: "Galeri Bayi", desc: "Kongsi momen indah kelahiran si manja" },
  { icon: Heart, title: "Wish & Doa", desc: "Tetamu boleh tinggalkan doa dan harapan" },
  { icon: Gift, title: "Hadiah Cash", desc: "Terima angpao digital melalui payment gateway" },
]

export default function AqiqahLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
          Jemputan Aqiqah Yang Sopan & Cantik
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Sambitan kelahiran anak anda dengan jemputan aqiqah digital yang syarie dan memukau. 
          Sesuai untuk majlis aqiqah seluruh Malaysia.
        </p>
        <Link href="/e/demo-aqiqah-anak-alam" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all">
          Lihat Demo <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Fitur Untuk Majlis Aqiqah</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <GlassCard key={i} className="p-6 text-center">
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-3xl mx-4 my-12">
        <h2 className="text-3xl font-bold mb-4">Selamat! Buat Jemputan Aqiqah Sekarang</h2>
        <p className="text-lg mb-8 opacity-90">Percuma. Mudah. Berkat.</p>
        <Link href="/dashboard/create" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all">
          Create Jemputan <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  )
}
