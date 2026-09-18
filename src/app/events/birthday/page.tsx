import type { Metadata } from "next"
import Link from "next/link"
import { Cake, ArrowRight, Sparkles, Camera, Music2, Gift } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"

export const metadata: Metadata = {
  title: "Jemputan Birthday Online Malaysia | Beasy.my",
  description: "Buat jemputan birthday online yang ceria dan menarik secara percuma. Template party, countdown timer, RSVP dan galeri foto.",
  keywords: ["jemputan birthday online", "undangan hari jadi digital", "template party invitation", "rsvp birthday"],
}

const features = [
  { icon: Sparkles, title: "Template Party Ceria", desc: "Pilihan template warna-warni untuk birthday" },
  { icon: Camera, title: "Galeri Kenangan", desc: "Paparan gambar kenangan dari kecil hingga besar" },
  { icon: Music2, title: "Background Music", desc: "Tambah muzik latar untuk suasana meriah" },
  { icon: Gift, title: "Wish & Doa", desc: "Tetamu boleh tinggalkan ucapan dan doa" },
]

export default function BirthdayLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Jemputan Birthday Digital Yang Meriah!
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Cipta jemputan birthday online yang memukau. Sesuai untuk birthday kanak-kanak, 
          dewasa, surprise party dan perayaan istimewa lainnya.
        </p>
        <Link href="/e/demo-hari-jadi-ali" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all">
          Lihat Demo <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Fitur Untuk Majlis Birthday</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <GlassCard key={i} className="p-6 text-center">
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-amber-500" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl mx-4 my-12">
        <h2 className="text-3xl font-bold mb-4">Buat Jemputan Birthday Sekarang!</h2>
        <p className="text-lg mb-8 opacity-90">Percuma. Cepat. Ceria.</p>
        <Link href="/dashboard/create" className="inline-flex items-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all">
          Create Sekarang <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  )
}
