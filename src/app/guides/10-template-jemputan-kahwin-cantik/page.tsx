import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Clock, Sparkles, Palette, Camera, Star, Check, X } from "lucide-react"

export const metadata: Metadata = {
  title: "10 Template Jemputan Kahwin Melayu Ter Cantik (Free) | Beasy.my",
  description: "Senarai 10 template jemputan kahwin melayu tercantik di Beasy.my — percuma untuk guna. Dari gaya klasik islamic hingga modern minimalist.",
  keywords: [
    "template jemputan kahwin melayu",
    "template undangan perkahwinan free",
    "template jemputan kahwin cantik",
    "templat temponghaj melayu",
    "jemputan kahwin digital template",
  ],
  openGraph: {
    title: "10 Template Jemputan Kahwin Melayu Ter Cantik",
    description: "88+ template premium percuma untuk jemputan kahwin digital Malaysia",
    type: "article",
    locale: "ms_MY",
    siteName: "Beasy.my",
  },
}

const templates = [
  {
    name: "Royal Islamic Classic",
    style: "Melayu Islamic",
    colors: ["#1a5e3a", "#d4af37", "#f5f0e8"],
    description: "Template klasik dengan elemen islamic calligraphy dan warna hijau zamrud. Sesuai untuk majlis yang mengikut sunnah.",
    features: ["Arabic calligraphy header", "Green & gold color scheme", "Bismillah opening", "Surah Al-Fatihah section"],
    bestFor: "Majlis yang mengutamakan elemen tradisional dan islamic",
  },
  {
    name: "Modern Minimalist",
    style: "Modern",
    colors: ["#2d2d2d", "#ffffff", "#c9a96e"],
    description: "Reka bentuk bersih dan minimalis dengan typography yang elegan. Fokus pada kandungan penting sahaja.",
    features: ["Clean sans-serif fonts", "White space optimized", "Monochrome palette", "Grid-based layout"],
    bestFor: "Pasangan muda yang suka gaya contemporary",
  },
  {
    name: "Floral Romance",
    style: "Romantic",
    colors: ["#ff6b9d", "#ffa0c4", "#fff0f5"],
    description: "Template penuh dengan ilustrasi bunga watercolor yang lembut. Warna pink dan rose dominan.",
    features: ["Watercolor floral borders", "Soft pink gradient", "Rose petal accents", "Romantic script fonts"],
    bestFor: "Wedding outdoor garden atau beach wedding",
  },
  {
    name: "Golden Elegance",
    style: "Luxury",
    colors: ["#d4af37", "#ffd700", "#1a1a2e"],
    description: "Template mewah dengan sentuhan emas dan latar gelap. Memberikan kesan premium dan eksklusif.",
    features: ["Gold foil effect", "Dark luxury background", "Ornate decorative elements", "Premium serif fonts"],
    bestFor: "Grand reception di dewan mewah",
  },
  {
    name: "Boho Chic",
    style: "Bohemian",
    colors: ["#d4a373", "#ccd5ae", "#faedcd"],
    description: "Gaya bohemian yang casual dan natural. Warna earth tone dengan elemen dried flowers.",
    features: ["Earth tone palette", "Dried flower illustrations", "Casual handwritten fonts", "Organic shapes"],
    bestFor: "Outdoor ceremony atau destination wedding",
  },
  {
    name: "Vintage Pearl",
    style: "Vintage",
    colors: ["#f8f4e9", "#e8dcc8", "#8b7355"],
    description: "Inspirasi vintage dengan sentuhan pearl dan lace. Nostalgia klasik yang timeless.",
    features: ["Pearl border design", "Lace pattern overlay", "Vintage sepia tones", "Classic calligraphy"],
    bestFor: "Majlis tema retro atau heritage wedding",
  },
  {
    name: "Tulip Garden",
    style: "Nature",
    colors: ["#e84393", "#fd79a8", "#ffeaa7"],
    description: "Template ceria dengan motif tulip dan bunga spring. Warna pastel yang menenangkan.",
    features: ["Tulip illustration set", "Pastel gradient background", "Spring floral wreath", "Light airy feel"],
    bestfor: "Spring wedding atau outdoor afternoon ceremony",
  },
  {
    name: "Islamic Geometric",
    style: "Islamic Art",
    colors: ["#0d7377", "#14a3a8", "#e0fbfc"],
    description: "Pattern geometri islamic yang intricate dengan warna teal yang unik. Modern tapi tetap islamic.",
    features: ["Geometric arabesque patterns", "Teal and white theme", "Islamic star motifs", "Symmetrical design"],
    bestFor: "Majlis yang mahu gabungan moden dan islamic",
  },
  {
    name: "Rustic Woodland",
    style: "Rustic",
    colors: ["#6b4423", "#a0522d", "#deb887"],
    description: "Tema rustic dengan tekstur kayu dan daun. Sesuai untuk wedding di alam semula jadi.",
    features: ["Wood texture background", "Leafy vine borders", "Rustic burlap accents", "Handcrafted feel"],
    bestFor: "Forest wedding atau countryside venue",
  },
  {
    name: "Celestial Night",
    style: "Dark Theme",
    colors: ["#1a1a3e", "#4a47a3", "#f0e68c"],
    description: "Template dark mode dengan elemen bintang dan bulan. Mysterious dan dramatik.",
    features: ["Star constellation map", "Moon phase icons", "Deep navy background", "Gold celestial accents"],
    bestFor: "Evening reception atau night wedding party",
  },
]

export default function TemplateShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm mb-6">
            <Palette className="w-4 h-4" />
            88+ Templates Premium • Percuma Untuk Guna
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            10 Template{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Jemputan Kahwin Melayu
            </span>{" "}
            Ter Cantik
          </h1>
          
          <p className="text-xl text-white/60 mb-8 max-w-3xl mx-auto">
            Koleksi template premium yang direka khas untuk majlis perkahwinan Malaysia. 
            Setiap template boleh custom sepenuhnya — pilih, edit, dan kongsi dalam 5 minit!
          </p>

          <Link
            href="/dashboard/create"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Lihat Semua 88+ Templates
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { number: "88+", label: "Templates" },
            { number: "15+", label: "Styles" },
            { number: "100%", label: "Customizable" },
            { number: "RM0", label: "Untuk Asas" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{stat.number}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Templates Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {templates.map((template, index) => (
            <div
              key={template.name}
              className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden ${index % 2 === 0 ? '' : 'md:flex-row'}`}
            >
              <div className="md:w-1/2">
                <div
                  className="h-64 md:h-full flex items-center justify-center p-8"
                  style={{
                    background: `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1]})`,
                  }}
                >
                  <div className="text-center">
                    <Palette className="w-16 h-16 text-white/80 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white">{template.name}</h3>
                    <span className="text-white/60 text-sm">{template.style}</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium">
                    {template.style}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm font-medium">
                    Free
                  </span>
                </div>
                
                <p className="text-white/70 mb-6">{template.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Features:</h4>
                  <div className="space-y-2">
                    {template.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-white/60 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <p className="text-white/60 text-sm">
                    <strong className="text-white">Sesuai untuk:</strong> {template.bestFor}
                  </p>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-white/40 text-sm">Colors:</span>
                  <div className="flex gap-2">
                    {template.colors.map((color) => (
                      <div
                        key={color}
                        className="w-8 h-8 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <Link
                  href="/dashboard/create"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
                >
                  Guna Template Ini
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Kenapa Pilih Template Beasy.my?</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white/5 border border-white/10 rounded-xl">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-white/60">Feature</th>
                  <th className="p-4 text-center text-white">Beasy.my</th>
                  <th className="p-4 text-center text-white/60">Platform Lain</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Jumlah Template", beasy: "88+", other: "10-20" },
                  { feature: "Harga Asas", beasy: "PERCUMA", other: "RM10-50/template" },
                  { feature: "Custom Warna", beasy: <Check className="w-5 h-5 text-green-400 mx-auto" />, other: <X className="w-5 h-5 text-red-400 mx-auto" /> },
                  { feature: "Custom Font", beasy: <Check className="w-5 h-5 text-green-400 mx-auto" />, other: <X className="w-5 h-5 text-red-400 mx-auto" /> },
                  { feature: "Responsive Design", beasy: <Check className="w-5 h-5 text-green-400 mx-auto" />, other: <Check className="w-5 h-5 text-green-400 mx-auto" /> },
                  { feature: "SEO Optimized", beasy: <Check className="w-5 h-5 text-green-400 mx-auto" />, other: <X className="w-5 h-5 text-red-400 mx-auto" /> },
                  { feature: "Audio Guestbook", beasy: <Check className="w-5 h-5 text-green-400 mx-auto" />, other: <X className="w-5 h-5 text-red-400 mx-auto" /> },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="p-4 text-white/80">{row.feature}</td>
                    <td className="p-4 text-center text-white font-semibold">{row.beasy}</td>
                    <td className="p-4 text-center text-white/60">{row.other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Nak Lihat Semua 88+ Templates?
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Setiap template boleh custom sepenuhnya — warna, font, layout, dan elemen dekoratif. 
              Mulakan secara PERCUMA tanpa kad kredit!
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-purple-600 font-semibold text-lg hover:bg-white/90 transition-all shadow-xl"
            >
              Browse Semua Templates
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} Beasy.my. Semua hak terpelihara.</p>
        </div>
      </footer>
    </div>
  )
}
