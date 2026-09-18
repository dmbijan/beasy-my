import { defaultCustomization, type GalleryCustomization } from './gallery-customization'

export interface PublicEvent {
  id: string; slug: string; title: string; event_type: string; event_date: string;
  venue_name?: string; venue_address?: string; maps_link?: string; plan?: string;
  description?: string; dress_code?: string;
  is_anonymous?: boolean; isOwner?: boolean; canClaim?: boolean; isPremium?: boolean;
  accent_color?: string;
  theme_config?: { theme?: string; accent_color?: string; customization?: Partial<GalleryCustomization> };
  event_modules?: { module_type: string; is_enabled: boolean; settings?: Record<string, unknown> }[];
}

export function toEventView(event: PublicEvent) {
  const modules = new Map((event.event_modules || []).map(module => [module.module_type, module]))
  const enabled = (type: string) => modules.get(type)?.is_enabled === true
  const angpao = modules.get('angpao')?.settings || {}
  const customization: GalleryCustomization = { ...defaultCustomization, ...(event.theme_config?.customization || {}) }
  // Normalize theme + accentColor so the portal can render a template-specific look.
  const theme = event.theme_config?.theme || 'glass'
  const accentColor = event.theme_config?.accent_color || event.accent_color || '#f43f5e'
  const isPremium = event.isPremium === true
  // Premium modules are only enabled when the host has an active premium plan.
  const premium = (type: string) => isPremium && enabled(type)
  return {
    ...event, eventType: event.event_type, eventDate: new Date(event.event_date),
    venueName: event.venue_name || '', venueAddress: event.venue_address || '',
    mapsLink: isPremium ? event.maps_link : '',
    description: event.description || '', dressCode: event.dress_code || '',
    theme, accentColor,
    isPremium,
    customization,
    modules: {
      rsvp: enabled('rsvp'), seating: enabled('seating'), menu: enabled('menu'),
      photoWall: premium('photobooth'),
      audioGuestbook: premium('audio_guestbook'), videoGuestbook: premium('video_guestbook'),
      wishes: premium('wishes'), songRequest: premium('song_request'), liveWall: premium('live_wall'), angpao: premium('angpao'),
    },
    angpao: {
      type: 'account', bankName: String(angpao.bankName || ''), accountNumber: String(angpao.accountNumber || ''),
      accountName: String(angpao.accountName || ''), duitnowNumber: String(angpao.duitNowNumber || ''), duitnowName: String(angpao.duitNowName || ''),
    },
  }
}