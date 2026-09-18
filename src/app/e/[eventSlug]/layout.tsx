import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export async function generateMetadata({ params }: { params: Promise<{ eventSlug: string }> }): Promise<Metadata> {
  const { eventSlug } = await params
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://beasy.my'
  try {
    const { data: event } = await supabaseAdmin
      .from('events')
      .select('title, event_type, event_date, venue_name, venue_address, description, cover_image')
      .eq('slug', eventSlug)
      .eq('is_active', true)
      .maybeSingle()

    if (!event) {
      return {
        title: 'Acara Tidak Dijumpai | Beasy.my',
        description: 'Acara yang anda cari tidak dijumpai.',
        robots: { index: false, follow: true },
      }
    }

    const title = `${event.title} | Beasy.my`
    const description = event.description || `Sertai ${event.title} di ${event.venue_name || 'tempat menarik'}!`
    const imageUrl = event.cover_image || `${baseUrl}/og-default.jpg`

    return {
      title,
      description,
      keywords: [event.title, event.event_type, event.venue_name || '', 'beasy', 'event'],
      alternates: { canonical: `${baseUrl}/e/${eventSlug}` },
      category: event.event_type || 'event',
      openGraph: {
        type: 'website',
        locale: 'ms_MY',
        url: `${baseUrl}/e/${eventSlug}`,
        title,
        description,
        images: [{ url: imageUrl, width: 1200, height: 630, alt: event.title }],
        siteName: 'Beasy.my',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
        creator: '@beasy_my',
      },
    }
  } catch {
    return {
      title: 'Beasy.my — Digital Event Platform',
      description: 'Platform acara digital Malaysia',
    }
  }
}

export default async function EventLayout({ children, params }: { children: React.ReactNode; params: Promise<{ eventSlug: string }> }) {
  const { eventSlug } = await params
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://beasy.my'

  // JSON-LD structured data (Event schema) for rich results
  let jsonLd = null
  try {
    const { data: event } = await supabaseAdmin
      .from('events')
      .select('title, event_type, event_date, venue_name, venue_address, description, cover_image')
      .eq('slug', eventSlug)
      .eq('is_active', true)
      .maybeSingle()

    if (event) {
      const eventSchema = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        description: event.description || '',
        startDate: event.event_date,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        image: event.cover_image || `${baseUrl}/og-default.jpg`,
        url: `${baseUrl}/e/${eventSlug}`,
        location: event.venue_name
          ? { '@type': 'Place', name: event.venue_name, address: event.venue_address || '' }
          : undefined,
        organizer: { '@type': 'Organization', name: 'Beasy.my', url: baseUrl },
      }
      jsonLd = JSON.stringify(eventSchema)
    }
  } catch {
    // ignore JSON-LD on error
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      )}
      {children}
    </>
  )
}
