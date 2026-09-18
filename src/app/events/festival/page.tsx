import type { Metadata } from "next"
import Link from "next/link"
import { Music, ArrowRight, Sparkles, Camera, Users, PartyPopper } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"

export const metadata: Metadata = {
  title: "Jemputan Festival & Acara Budaya Digital | Beasy.my",
  description: "Platform jemputan festival muzik, acara budaya dan perayaan digital. Template festive, RSVP massal, gallery event dan live streaming integration.",
  keywords: ["jemputan festival digital", "undangan acara budaya online", "festival invitation platform", "event invitation malaysia"],
}

const features = [
  { icon: Music, title: "Template Festive", desc: "Reka bentuk ceria dan colorful untuk festival dan acara budaya" },
  { icon: Users, title: "Mass RSVP", desc: "Pengurusan ribuan tetamu dengan breakdown kategori tiket" },
  { icon: Camera, title: "Live Gallery", desc: "Real-time photo capture semasa event berlangsung" },
  { icon: PartyPopper, title: "Schedule & Lineup", desc: "Paparan jadual program dan lineup performer" },
]

export default function FestivalLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <section className="container mx-auto px-4 py-20 text-center">
        <Music className="w-20 h-20 mx-auto mb-6 text-purple-500" />
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Jemputan Festival Yang Meriah!
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Uruskan festival muzik, acara budaya, perayaan raya dan gathering besar dengan 
          platform jemputan digital yang powerful dan efisien.
        </p>
        <Link href="/e/demo-festival-muzik-raya" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all">
          Lihat Demo Festival <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Fitur Untuk Event Besar</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <GlassCard key={i} className="p-6 text-center">
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl mx-4 my-12">
        <h2 className="text-3xl font-bold mb-4">Mudah Untuk Event Organizer!</h2>
        <p className="text-lg mb-8 opacity-90">Track thousands of attendees. Manage effortlessly.</p>
        <Link href="/dashboard/create" className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all">
          Mula Sekarang <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  )
}
