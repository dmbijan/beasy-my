import { Metadata } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Generate dynamic metadata for event pages
 * Used in /e/[eventSlug]/page.tsx for SEO and social sharing
 */
export async function generateMetadata(eventSlug: string): Promise<Metadata> {
  try {
    const { data: event } = await supabaseAdmin
      .from('events')
      .select('title, event_type, event_date, venue_name, venue_address, description, cover_image, theme_config')
      .eq('slug', eventSlug)
      .single()

    if (!event) {
      return {
        title: 'Acara Tidak Dijumpai | Beasy.my',
        description: 'Acara yang anda cari tidak dijumpai.',
      }
    }

    const title = `${event.title} | Beasy.my`
    const description = event.description || `Sertai ${event.title} di ${event.venue_name || 'tempat menarik'}!`
    const imageUrl = event.cover_image || `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/og-default.jpg`
    const eventDate = new Date(event.event_date).toISOString()

    return {
      title,
      description,
      keywords: [event.title, event.event_type, event.venue_name, 'beasy', 'myevents'],
      authors: [{ name: 'Beasy.my' }],
      creator: 'Beasy.my',
      publisher: 'Beasy.my',
      robots: 'index, follow',
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/e/${eventSlug}`,
      },
      category: event.event_type || 'event',
      openGraph: {
        type: 'website',
        locale: 'ms_MY',
        url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/e/${eventSlug}`,
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: event.title,
          },
        ],
        siteName: 'Beasy.my',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
        creator: '@beasy_my',
      },
      verification: {
        other: {
          'event-date': eventDate,
          'event-venue': event.venue_name || '',
        },
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Beasy.my - Digital Event Platform',
      description: 'Platform acara digital Malaysia',
    }
  }
}
