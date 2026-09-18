import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://beasy.my'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/auth',
          '/api',
          '/payment',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
