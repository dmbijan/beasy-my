import type { Metadata } from "next"
import Link from "next/link"
import { Building2, ArrowRight, Sparkles, Users, FileCheck, Video } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"

export const metadata: Metadata = {
  title: "Jemputan Majlis Korporat Digital | Beasy.my",
  description: "Platform jemputan majlis korporat profesional. Conference, seminar, team building dan corporate dinner dengan RSVP dan payment gateway.",
  keywords: ["jemputan korporat digital", "invitation conference malaysia", "corporate event platform", "seminar invitation online"],
}

const features = [
  { icon: Sparkles, title: "Template Profesional", desc: "Reka bentuk korporat yang elegan dan profesional" },
  { icon: Users, title: "Pengurusan Tetamu", desc: "Track RSVP dan senarai kehadiran secara real-time" },
  { icon: FileCheck, title: "Payment Gateway", desc: "Angpao digital dan settlement melalui ToyyibPay" },
  { icon: Video, title: "Live Streaming", desc: "Integrasi live streaming untuk acara hybrid" },
]

export default function CorporateLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50">
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Jemputan Korporat Yang Profesional
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Uruskan conference, seminar, team building dan corporate dinner dengan platform 
          jemputan digital yang profesional dan efisien.
        </p>
        <Link href="/e/demo-korporat-majlis-bisnes" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all">
          Lihat Demo <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Fitur Untuk Event Korporat</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <GlassCard key={i} className="p-6 text-center">
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-3xl mx-4 my-12">
        <h2 className="text-3xl font-bold mb-4">Mudah Untuk HR & Event Manager</h2>
        <p className="text-lg mb-8 opacity-90">Setup cepat. Track mudah. Laporan lengkap.</p>
        <Link href="/dashboard/create" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all">
          Mula Sekarang <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  )
}
