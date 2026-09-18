// Gallery customization catalog — inspired by Galeri Kawen (Kampung Tech).
// Provides couple identity, guest layout, theme colours, guest message fonts,
// and story templates (photo frames) that hosts can configure per event.

export interface CoupleIdentity {
  groom: string
  bride: string
  monogram: string
  hashtag: string
}

export type GuestLayout = 'polaroid-wall' | 'memory-wall'

export interface ThemeColour {
  id: string
  name: string
  primary: string
  secondary: string
  text: string
}

export interface GuestFont {
  id: string
  name: string
  fontFamily: string
}

export interface StoryTemplate {
  id: string
  name: string
  emoji: string
  // Border/frame style hint applied client-side.
  frameStyle: string
}

// 6 theme colours (Galeri Kawen names)
export const themeColours: ThemeColour[] = [
  { id: 'heirloom', name: 'Heirloom', primary: '#8b5e3c', secondary: '#d4a373', text: '#fdf6ec' },
  { id: 'botanical', name: 'Botanical', primary: '#2d6a4f', secondary: '#74c69d', text: '#f1faee' },
  { id: 'blush', name: 'Blush', primary: '#f4acb7', secondary: '#ffd6e0', text: '#5c1a2a' },
  { id: 'dusk', name: 'Dusk', primary: '#4a4e69', secondary: '#9a8c98', text: '#f2e9e4' },
  { id: 'coral', name: 'Coral', primary: '#e76f51', secondary: '#f4a261', text: '#fff1e6' },
  { id: 'midnight', name: 'Midnight', primary: '#0f172a', secondary: '#1e293b', text: '#e2e8f0' },
]

// 10 guest message fonts
export const guestFonts: GuestFont[] = [
  { id: 'dancing-script', name: 'Dancing Script', fontFamily: "'Dancing Script', cursive" },
  { id: 'great-vibes', name: 'Great Vibes', fontFamily: "'Great Vibes', cursive" },
  { id: 'parisienne', name: 'Parisienne', fontFamily: "'Parisienne', cursive" },
  { id: 'allura', name: 'Allura', fontFamily: "'Allura', cursive" },
  { id: 'sacramento', name: 'Sacramento', fontFamily: "'Sacramento', cursive" },
  { id: 'satisfy', name: 'Satisfy', fontFamily: "'Satisfy', cursive" },
  { id: 'kaushan-script', name: 'Kaushan Script', fontFamily: "'Kaushan Script', cursive" },
  { id: 'caveat', name: 'Caveat', fontFamily: "'Caveat', cursive" },
  { id: 'pinyon-script', name: 'Pinyon Script', fontFamily: "'Pinyon Script', cursive" },
  { id: 'classic-serif', name: 'Classic Serif', fontFamily: "'Playfair Display', serif" },
]

// 22 story templates (photo frames) — inspired by Galeri Kawen
export const storyTemplates: StoryTemplate[] = [
  { id: 'orchid', name: 'Orchid', emoji: '🌸', frameStyle: 'border-4 border-fuchsia-300 rounded-lg' },
  { id: 'ribbon-frame-2', name: 'Ribbon Frame 2', emoji: '🎀', frameStyle: 'border-8 border-rose-200 rounded-xl' },
  { id: 'tulip-1', name: 'Tulip 1', emoji: '🌷', frameStyle: 'border-4 border-red-300 rounded-lg' },
  { id: 'flower-frame-2', name: 'Flower Frame 2', emoji: '🌺', frameStyle: 'border-4 border-pink-300 rounded-full' },
  { id: 'classic-frame', name: 'Classic Frame', emoji: '🖼️', frameStyle: 'border-8 border-white shadow-lg rounded-sm' },
  { id: 'flower-frame', name: 'Flower Frame', emoji: '💐', frameStyle: 'border-4 border-amber-200 rounded-lg' },
  { id: 'floral-2', name: 'Floral 2', emoji: '🌼', frameStyle: 'border-4 border-lime-200 rounded-xl' },
  { id: 'balloon', name: 'Ballon', emoji: '🎈', frameStyle: 'border-4 border-sky-200 rounded-2xl' },
  { id: 'minimalist', name: 'Minimalist', emoji: '⬜', frameStyle: 'border-2 border-white/50 rounded-md' },
  { id: 'floral', name: 'Floral', emoji: '🌹', frameStyle: 'border-4 border-rose-200 rounded-lg' },
  { id: 'news-paper', name: 'News Paper', emoji: '📰', frameStyle: 'border-4 border-stone-300 rounded-sm grayscale' },
  { id: 'princess', name: 'Princess', emoji: '👑', frameStyle: 'border-8 border-amber-200 rounded-xl' },
  { id: 'sketched-flower-2', name: 'Sketched Flower 2', emoji: '✏️', frameStyle: 'border-4 border-dashed border-pink-300 rounded-lg' },
  { id: 'garden', name: 'Garden', emoji: '🌿', frameStyle: 'border-4 border-emerald-300 rounded-xl' },
  { id: 'ribbon-frame-1', name: 'Ribbon Frame 1', emoji: '🎗️', frameStyle: 'border-8 border-rose-100 rounded-xl' },
  { id: 'mirror', name: 'Mirror', emoji: '🪞', frameStyle: 'border-4 border-slate-300 rounded-2xl' },
  { id: 'love-story', name: 'Love Story', emoji: '💕', frameStyle: 'border-4 border-red-200 rounded-lg' },
  { id: 'new-chapter', name: 'New Chapter', emoji: '📖', frameStyle: 'border-4 border-indigo-200 rounded-lg' },
  { id: 'muslim', name: 'Muslim', emoji: '🕌', frameStyle: 'border-4 border-emerald-200 rounded-xl' },
  { id: 'royal-mirror', name: 'Royal Mirror', emoji: '👑', frameStyle: 'border-8 border-yellow-200 rounded-2xl' },
  { id: 'sketched-flower-1', name: 'Sketched Flower 1', emoji: '🖋️', frameStyle: 'border-4 border-dotted border-rose-300 rounded-lg' },
  { id: 'floral-3', name: 'Floral 3', emoji: '💮', frameStyle: 'border-4 border-purple-200 rounded-lg' },
]

export const guestLayouts: { id: GuestLayout; name: string; description: string }[] = [
  { id: 'polaroid-wall', name: 'Polaroid Wall', description: 'Dinding polaroid berselerak romantik, kamera & slideshow.' },
  { id: 'memory-wall', name: 'Memory Wall', description: 'Dinding masonry hijau gelap bersih — tetamu snap atau upload, foto mengalir langsung.' },
]

export interface GalleryCustomization {
  groom: string
  bride: string
  monogram: string
  hashtag: string
  welcomeMessage: string
  guestLanguage: 'ms' | 'en'
  guestLayout: GuestLayout
  themeColourId: string
  guestFontId: string
  keepsakeBackground: string
  storyTemplateIds: string[]
  // ---- New wedding features (competitor-inspired) ----
  backgroundMusic: string
  videoCover: string
  wishlist: WishlistItem[]
  itinerary: ItineraryItem[]
  chatAiEnabled: boolean
  pdfEnabled: boolean
}

export interface WishlistItem {
  id: string
  name: string
  link: string
  reserved: boolean
}

export interface ItineraryItem {
  id: string
  time: string
  title: string
  description: string
}

export const defaultCustomization: GalleryCustomization = {
  groom: '',
  bride: '',
  monogram: '',
  hashtag: '',
  welcomeMessage: '',
  guestLanguage: 'ms',
  guestLayout: 'polaroid-wall',
  themeColourId: 'blush',
  guestFontId: 'dancing-script',
  keepsakeBackground: '',
  storyTemplateIds: [],
  backgroundMusic: '',
  videoCover: '',
  wishlist: [],
  itinerary: [],
  chatAiEnabled: false,
  pdfEnabled: false,
}

export function themeColourById(id: string): ThemeColour {
  return themeColours.find(c => c.id === id) || themeColours[2] // blush default
}

export function guestFontById(id: string): GuestFont {
  return guestFonts.find(f => f.id === id) || guestFonts[0]
}
