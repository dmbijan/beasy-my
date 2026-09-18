import type { Metadata } from "next"
import Link from "next/link"
import { GraduationCap, ArrowRight, Sparkles, Camera, Mic2, CalendarCheck } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"

export const metadata: Metadata = {
  title: "Jemputan Konvokesyen & Graduasi Digital | Beasy.my",
  description: "Buat jemputan konvokesyen dan majlis graduasi digital yang profesional. Template graduation, RSVP online, galeri foto ijazah dan audio guestbook.",
  keywords: ["jemputan konvokesyen digital", "undangan graduasi online", "template graduation invitation", "majlis konvokesyen digital malaysia"],
}

const features = [
  { icon: Sparkles, title: "Template Graduation", desc: "Reka bentuk formal dan elegan untuk majlis konvokesyen" },
  { icon: Camera, title: "Galeri Kenangan", desc: "Paparan gambar dari tahun-tahun belajar hingga hari konvokesyen" },
  { icon: Mic2, title: "Audio Guestbook", desc: "Ucapan tahniah dan doa dari keluarga dan rakan sekelas" },
  { icon: CalendarCheck, title: "RSVP & Parking", desc: "Pengurusan kehadiran dan maklumat parking venue universiti" },
]

export default function GraduationLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50">
      <section className="container mx-auto px-4 py-20 text-center">
        <GraduationCap className="w-20 h-20 mx-auto mb-6 text-indigo-500" />
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Jemputan Konvokesyen Yang Profesional!
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
          Rayakan pencapaian akademik anda dengan jemputan konvokesyen digital yang elegan. 
          Sesuai untuk majlis konvokesyen UPM, UM, USM, UIAM dan semua universiti Malaysia.
        </p>
        <Link href="/dashboard/create" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all">
          Buat Jemputan Sekarang <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Fitur Untuk Majlis Graduasi</h2>
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
        <h2 className="text-3xl font-bold mb-4">Tahniah! Buat Jemputan Konvokesyen Sekarang</h2>
        <p className="text-lg mb-8 opacity-90">Percuma. Mudah. Berkesan.</p>
        <Link href="/dashboard/create" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all">
          Create Sekarang <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  )
}
