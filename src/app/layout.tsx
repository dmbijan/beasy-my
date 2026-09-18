import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/Toaster"
import { AuthProvider } from "@/components/auth/AuthProvider"
import { LanguageProvider } from "@/lib/i18n"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://beasy.my'),
  title: {
    default: "Beasy.my — Digital Event Platform",
    template: "%s | Beasy.my",
  },
  description: "Everything for your event, in one place. Platform acara digital Malaysia — galeri foto, video, audio, RSVP, e-invitation, angpao digital dan banyak lagi.",
  keywords: ["event platform", "digital event", "wedding", "perkahwinan", "galeri foto", "guestbook digital", "RSVP", "e-invitation", "beasy", "malaysia"],
  authors: [{ name: "Beasy.my" }],
  creator: "Beasy.my",
  publisher: "Beasy.my",
  manifest: "/manifest.json",
  themeColor: "#0f172a",
  viewport: "width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ms_MY",
    siteName: "Beasy.my",
    title: "Beasy.my — Digital Event Platform",
    description: "Everything for your event, in one place.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beasy.my — Digital Event Platform",
    description: "Everything for your event, in one place.",
    creator: "@beasy_my",
  },
  icons: {
    icon: [
      { url: "/icons/icon.svg", sizes: "512x512", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ms_MY",
    siteName: "Beasy.my",
    title: "Beasy.my — Digital Event Platform",
    description: "Platform acara digital Malaysia — jemputan online, galeri foto, video, audio, RSVP, e-invitation, angpao digital dan banyak lagi.",
    url: "/",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "Beasy.my — Digital Event Platform",
        type: "image/svg+xml",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Beasy",
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ms" className="h-full">
      <head>
        {/* Guest message fonts (Galeri Kawen-style) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Parisienne&family=Allura&family=Sacramento&family=Satisfy&family=Kaushan+Script&family=Caveat:wght@400;700&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        {/* FAQ JSON-LD for homepage rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Apakah itu Beasy.my?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Beasy.my adalah platform acara digital Malaysia yang menyediakan jemputan online, galeri foto, audio guestbook, RSVP dan banyak lagi untuk majlis perkahwinan, birthday, korporat dan acara lainnya."
                  }
                },
                {
                  "@type": "Question",
                  name: "Bagaimana cara buat jemputan kahwin digital di Beasy.my?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Sangat mudah! Daftar akaun, pilih template yang anda suka (88+ pilihan), isi butiran majlis, dan kongsi link jemputan melalui WhatsApp atau QR code. Setup hanya ambil 5 minit sahaja."
                  }
                },
                {
                  "@type": "Question",
                  name: "Adakah Beasy.my percuma?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Ya! Kami ada versi percuma dengan fitur asas. Untuk fitur premium seperti payment gateway, custom domain, dan analytics lanjutan, kami ada pakej sekali bayar RM159 sahaja."
                  }
                },
                {
                  "@type": "Question",
                  name: "Bolehkah saya terima hadiah cash / angpao digital?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Ya! Beasy.my integrate dengan ToyyibPay payment gateway untuk menerima angpao digital, sumbangan dan payment untuk majlis anda. Settlement terus ke akaun bank anda."
                  }
                },
                {
                  "@type": "Question",
                  name: "Apa yang istimewa tentang galeri foto Beasy.my?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Galeri kami menggunakan Google Drive untuk storage — semua foto tetamu upload terus ke Google Drive anda. Tiada app perlu download oleh tetamu, cukup scan QR atau klik link."
                  }
                },
                {
                  "@type": "Question",
                  name: "Adakah jemputan digital boleh cari di Google?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Ya! Semua jemputan di Beasy.my SEO optimized. Tetamu boleh cari event anda melalui Google, dan jemputan akan muncul dalam carian dengan rich snippets."
                  }
                }
              ]
            })
          }}
        />
        {/* LocalBusiness JSON-LD for Malaysia SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Beasy.my",
              url: "https://beasy.my",
              description: "Platform acara digital Malaysia — jemputan online, galeri foto, video, audio, RSVP, e-invitation, angpao digital dan banyak lagi.",
              applicationCategory: "Web Application",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "159",
                priceCurrency: "MYR",
                description: "Premium plan - sekali bayar untuk semua fitur",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "250",
                bestRating: "5",
                worstRating: "1",
              },
              author: {
                "@type": "Organization",
                name: "Beasy.my",
                url: "https://beasy.my",
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "MY",
                  addressLocality: "Malaysia",
                },
              },
              sameAs: [
                "https://www.facebook.com/beasy.my",
                "https://www.instagram.com/beasy_my",
                "https://www.tiktok.com/@beasy.my",
              ],
            })
          }}
        />
      </head>
      <body className={`${inter.className} h-full`}>
        <LanguageProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
