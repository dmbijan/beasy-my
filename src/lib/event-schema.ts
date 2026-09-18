import { z } from 'zod'
import { defaultCustomization } from './gallery-customization'

const reserved = new Set(['admin', 'api', 'dashboard', 'auth', 'login', 'signin', 'signup', 'register', 'payment', 'checkout', 'success', 'webhook', 'static', 'assets', 'cdn', 'media', 'upload', 'download', 'e', 'demo', 'support', 'help', 'contact', 'about', 'terms', 'privacy', 'cookie', 'legal', 'status', 'health', 'config', 'settings'])
const optionalText = (max: number) => z.string().trim().max(max).optional().default('')
const link = z.string().trim().max(2048).refine(value => {
  if (!value) return true
  try { return ['https:', 'http:'].includes(new URL(value).protocol) } catch { return false }
}, 'Pautan mesti menggunakan HTTP atau HTTPS').optional().default('')
const date = z.string().refine(value => Number.isFinite(Date.parse(value)), 'Tarikh tidak sah')

// Gallery customization (Galeri Kawen-inspired) — stored in theme_config JSONB.
const wishlistItemSchema = z.object({
  id: z.string(), name: z.string().trim().max(200).optional().default(''),
  link: z.string().trim().max(2048).optional().default(''), reserved: z.boolean().optional().default(false),
})
const itineraryItemSchema = z.object({
  id: z.string(), time: z.string().trim().max(50).optional().default(''),
  title: z.string().trim().max(200).optional().default(''), description: z.string().trim().max(2000).optional().default(''),
})
const customizationSchema = z.object({
  groom: optionalText(120), bride: optionalText(120), monogram: optionalText(10),
  hashtag: optionalText(100), welcomeMessage: optionalText(2000),
  guestLanguage: z.enum(['ms', 'en']).optional().default('ms'),
  guestLayout: z.enum(['polaroid-wall', 'memory-wall']).optional().default('polaroid-wall'),
  themeColourId: z.string().optional().default('blush'),
  guestFontId: z.string().optional().default('dancing-script'),
  keepsakeBackground: z.string().max(3_000_000).optional().default(''),
  storyTemplateIds: z.array(z.string()).optional().default([]),
  backgroundMusic: z.string().trim().max(2048).optional().default(''),
  videoCover: z.string().trim().max(2048).optional().default(''),
  wishlist: z.array(wishlistItemSchema).optional().default([]),
  itinerary: z.array(itineraryItemSchema).optional().default([]),
  chatAiEnabled: z.boolean().optional().default(false),
  pdfEnabled: z.boolean().optional().default(false),
  checklistDone: z.array(z.string()).optional().default([]),
})

export const eventSchema = z.object({
  title: z.string().trim().min(3).max(255),
  slug: z.string().trim().toLowerCase().min(3).max(90).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).refine(value => !reserved.has(value), 'Slug ini terpelihara'),
  eventType: z.enum(['wedding', 'birthday', 'corporate', 'festival', 'graduation', 'aqiqah', 'baby-shower', 'party', 'other']),
  eventDate: date,
  description: optionalText(10000), venueName: optionalText(255), venueAddress: optionalText(2000),
  mapsLink: link, dressCode: optionalText(50),
  rsvpDeadline: z.union([z.literal(''), date]).optional().default(''),
  theme: z.enum(['glass', 'elegant', 'modern', 'nature', 'ocean', 'sunset']).optional().default('glass'),
  accentColor: z.string().regex(/^#[0-9a-f]{6}$/i).optional().default('#f43f5e'),
  coverImage: z.string().max(3_000_000).optional().default(''),
  facebookLink: link, instagramLink: link, whatsappLink: link, websiteLink: link,
  angpaoEnabled: z.boolean().optional().default(false),
  bankName: optionalText(255), accountNumber: optionalText(50), accountName: optionalText(255),
  duitNowNumber: optionalText(50), duitNowName: optionalText(255),
  customization: customizationSchema.optional(),
}).refine(data => !data.rsvpDeadline || Date.parse(data.rsvpDeadline) <= Date.parse(data.eventDate), {
  path: ['rsvpDeadline'], message: 'Tarikh akhir RSVP mesti sebelum atau pada tarikh acara',
})

export function eventRow(data: z.infer<typeof eventSchema>) {
  const customization = { ...defaultCustomization, ...(data.customization || {}) }
  return {
    title: data.title, slug: data.slug, event_type: data.eventType, event_date: new Date(data.eventDate).toISOString(),
    description: data.description, venue_name: data.venueName, venue_address: data.venueAddress,
    maps_link: data.mapsLink || null, dress_code: data.dressCode || null,
    rsvp_deadline: data.rsvpDeadline ? new Date(data.rsvpDeadline).toISOString() : null,
    theme_config: { theme: data.theme, accent_color: data.accentColor, customization }, accent_color: data.accentColor,
    cover_image: data.coverImage || null, facebook_link: data.facebookLink || null,
    instagram_link: data.instagramLink || null, whatsapp_link: data.whatsappLink || null, website_link: data.websiteLink || null,
  }
}

export function defaultEventModules(data: z.infer<typeof eventSchema>) {
  return ['rsvp', 'seating', 'menu', 'photobooth', 'audio_guestbook', 'video_guestbook', 'wishes', 'song_request', 'live_wall', 'angpao'].map(module_type => ({
    module_type,
    is_enabled: module_type === 'angpao' ? data.angpaoEnabled : ['rsvp', 'wishes', 'song_request', 'photobooth', 'audio_guestbook', 'video_guestbook'].includes(module_type),
    settings: module_type === 'angpao' ? {
      bankName: data.bankName, accountNumber: data.accountNumber, accountName: data.accountName,
      duitNowNumber: data.duitNowNumber, duitNowName: data.duitNowName,
    } : {},
  }))
}