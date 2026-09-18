import { defaultCustomization, type GalleryCustomization } from './gallery-customization'

export interface PublicEvent {
  id: string; slug: string; title: string; event_type: string; event_date: string;
  venue_name?: string; venue_address?: string; maps_link?: string; plan?: string;
  is_anonymous?: boolean; isOwner?: boolean; canClaim?: boolean;
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
  return {
    ...event, eventType: event.event_type, eventDate: new Date(event.event_date),
    venueName: event.venue_name || '', venueAddress: event.venue_address || '', mapsLink: event.maps_link,
    theme, accentColor,
    customization,
    modules: {
      rsvp: enabled('rsvp'), seating: enabled('seating'), menu: enabled('menu'), photoWall: enabled('photobooth'),
      audioGuestbook: enabled('audio_guestbook'), videoGuestbook: enabled('video_guestbook'),
      wishes: enabled('wishes'), songRequest: enabled('song_request'), liveWall: enabled('live_wall'), angpao: enabled('angpao'),
    },
    angpao: {
      type: 'account', bankName: String(angpao.bankName || ''), accountNumber: String(angpao.accountNumber || ''),
      accountName: String(angpao.accountName || ''), duitnowNumber: String(angpao.duitNowNumber || ''), duitnowName: String(angpao.duitNowName || ''),
    },
  }
}