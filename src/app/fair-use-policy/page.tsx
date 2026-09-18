import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Polisi Penggunaan Adil | Beasy.my",
  description: "Polisi penggunaan adil untuk pelan Beasy.my.",
}

export default function FairUsePolicyPage() {
  return (
    <main className="min-h-screen mesh-gradient px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <Link href="/" className="text-white/60 hover:text-white">← Kembali</Link>
        <h1 className="text-3xl font-bold text-white">Polisi Penggunaan Adil</h1>
        <p className="text-white/60 text-sm">Kemas kini terakhir: September 2026</p>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Apa maksud tanpa had</h2>
          <p className="text-white/70 leading-relaxed">
            Pelan Beasy.my membolehkan tetamu memuat naik foto, video dan audio sepanjang tempoh acara tanpa
            kuota media tetap. Had teknikal bagi saiz dan tempoh setiap fail masih terpakai untuk memastikan
            muat naik boleh diproses dengan baik (foto 10MB, video 250MB / 2 minit, audio 50MB).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Penggunaan yang munasabah</h2>
          <p className="text-white/70 leading-relaxed">
            Beasy.my direka untuk satu majlis sebenar seperti perkahwinan, pertunangan, hari jadi, majlis korporat
            atau sambutan keluarga. Media sepatutnya berkaitan dengan majlis tersebut dan dikongsi oleh
            tuan rumah, keluarga, tetamu atau penyedia majlis mereka.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Penggunaan yang tidak termasuk</h2>
          <p className="text-white/70 leading-relaxed">
            Pelan ini bukan storan awan umum, arkib sandaran, rangkaian pengedaran fail atau ruang untuk kandungan
            yang tidak berkaitan dengan majlis. Muat naik automatik secara besar-besaran, penyalahgunaan sistem dan
            kandungan yang melanggar undang-undang atau hak orang lain tidak dibenarkan.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Bila kami akan membuat semakan</h2>
          <p className="text-white/70 leading-relaxed">
            Kami membuat semakan operasi apabila sebuah acara menghampiri 5,000 media atau 100 GB. Ini bukan had
            automatik dan muat naik tidak dihentikan hanya kerana mencapai angka tersebut. Kami mungkin menghubungi
            pemilik untuk memahami penggunaan dan memastikan perkhidmatan kekal lancar.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Jika penggunaan menjejaskan perkhidmatan</h2>
          <p className="text-white/70 leading-relaxed">
            Kami akan cuba menghubungi pemilik dan mencari penyelesaian yang munasabah terlebih dahulu. Jika perlu
            untuk melindungi keselamatan, kestabilan atau pengguna lain, kami boleh menghadkan aktiviti luar biasa
            secara sementara mengikut Terma Perkhidmatan.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">Soalan</h2>
          <p className="text-white/70 leading-relaxed">
            Jika majlis anda dijangka melebihi 5,000 media atau 100 GB, hubungi kami supaya kami boleh membantu anda
            merancang lebih awal.
          </p>
        </section>
      </div>
    </main>
  )
}
