import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://beasy.my'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/templates`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/fair-use-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    // Event type landing pages (SEO keywords)
    { url: `${baseUrl}/events/wedding`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/events/birthday`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events/corporate`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events/aqiqah`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events/graduation`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/events/festival`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    // SEO Guides & Blog Posts (Long-tail keywords)
    { url: `${baseUrl}/guides/panduan-jemputan-kahwin-digital`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/guides/10-template-jemputan-kahwin-cantik`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/guides/banding-platform-jemputan-online`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ]

  // Dynamic event pages
  let eventPages: MetadataRoute.Sitemap = []
  try {
    const { data: events } = await supabaseAdmin
      .from('events')
      .select('slug, updated_at')
      .eq('is_active', true)

    eventPages = (events || []).map(event => ({
      url: `${baseUrl}/e/${event.slug}`,
      lastModified: event.updated_at ? new Date(event.updated_at) : new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  } catch {
    // sitemap should never crash; skip events on error
  }

  return [...staticPages, ...eventPages]
}
