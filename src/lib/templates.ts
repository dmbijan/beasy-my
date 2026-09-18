// Template design catalog — inspired by sedetik.com's template library.
// Each template maps to a theme + accent color + gradient that the event
// portal and QR designs can apply. The event schema currently stores
// `theme` and `accentColor`, so we keep these templates compatible by
// exposing a `theme` value and `accentColor` for each.

export type TemplateCategory =
  | 'Classic' | 'Floral' | 'Cultural' | 'Malay Vogue' | 'Borneo Chic'
  | 'Chinese Couture' | 'Indian Flair' | 'Festive' | 'Party' | 'Dark' | 'Nature'
  | 'Motion' | 'Khat' | 'Luxury' | 'Simple' | 'Traditional'

export interface EventTemplate {
  id: string
  name: string
  category: TemplateCategory
  // Two-color gradient used for the card preview.
  gradient: string
  // Accent color (hex) applied to buttons/accents.
  accentColor: string
  // Optional secondary accent.
  accentColor2: string
  // Compatible event `theme` value from the existing schema enum.
  theme: 'glass' | 'elegant' | 'modern' | 'nature' | 'ocean' | 'sunset'
  // Event types this template is intended for. When omitted/empty, all types.
  eventTypes?: string[]
  // Decorative motif category (SVG pattern shown in preview/portal).
  motif?: 'floral' | 'khat' | 'luxury' | 'simple' | 'traditional' | 'motion'
  suggested?: boolean
}

// Wedding-specific categories (KahwinNow-inspired). These 5 categories are
// intended exclusively for wedding events.
export const weddingCategories: TemplateCategory[] = [
  'Motion', 'Khat', 'Luxury', 'Simple', 'Traditional',
]

// Returns true when a template is wedding-exclusive.
export function isWeddingTemplate(t: EventTemplate): boolean {
  return t.eventTypes === undefined
    ? weddingCategories.includes(t.category)
    : t.eventTypes.includes('wedding')
}

export const templateCategories: TemplateCategory[] = [
  'Classic', 'Floral', 'Cultural', 'Malay Vogue', 'Borneo Chic',
  'Chinese Couture', 'Indian Flair', 'Festive', 'Party', 'Dark', 'Nature',
  'Motion', 'Khat', 'Luxury', 'Simple', 'Traditional',
]

export const templates: EventTemplate[] = [
  { id: 'beasy', name: 'Beasy', category: 'Classic', gradient: 'from-rose-500 to-pink-600', accentColor: '#f43f5e', accentColor2: '#ec4899', theme: 'glass', suggested: true },
  { id: 'rustic', name: 'Rustic', category: 'Classic', gradient: 'from-amber-600 to-orange-700', accentColor: '#d97706', accentColor2: '#ea580c', theme: 'nature', suggested: true },
  { id: 'orchid', name: 'Orchid', category: 'Floral', gradient: 'from-fuchsia-500 to-purple-600', accentColor: '#c026d3', accentColor2: '#9333ea', theme: 'elegant', suggested: true },
  { id: 'minimalist', name: 'Minimalist', category: 'Classic', gradient: 'from-slate-400 to-slate-600', accentColor: '#64748b', accentColor2: '#475569', theme: 'modern' },
  { id: 'elegant-gold', name: 'Elegant Gold', category: 'Classic', gradient: 'from-yellow-500 to-amber-600', accentColor: '#d4af37', accentColor2: '#b8860b', theme: 'elegant' },
  { id: 'modern', name: 'Modern', category: 'Classic', gradient: 'from-indigo-500 to-blue-600', accentColor: '#6366f1', accentColor2: '#2563eb', theme: 'modern' },
  { id: 'vintage', name: 'Vintage', category: 'Classic', gradient: 'from-stone-500 to-yellow-700', accentColor: '#a8a29e', accentColor2: '#ca8a04', theme: 'elegant' },
  { id: 'jiho', name: 'Jiho', category: 'Cultural', gradient: 'from-rose-400 to-amber-400', accentColor: '#fb7185', accentColor2: '#fbbf24', theme: 'sunset' },
  { id: 'sparkle', name: 'Sparkle', category: 'Festive', gradient: 'from-cyan-400 to-blue-500', accentColor: '#22d3ee', accentColor2: '#3b82f6', theme: 'modern' },
  { id: 'royal', name: 'Royal', category: 'Classic', gradient: 'from-purple-700 to-indigo-800', accentColor: '#7e22ce', accentColor2: '#3730a3', theme: 'elegant' },
  { id: 'dark-royale', name: 'Dark Royale', category: 'Dark', gradient: 'from-slate-800 to-slate-950', accentColor: '#334155', accentColor2: '#0f172a', theme: 'modern' },
  { id: 'sketch', name: 'Sketch', category: 'Classic', gradient: 'from-zinc-400 to-zinc-600', accentColor: '#a1a1aa', accentColor2: '#52525b', theme: 'modern' },
  { id: 'avant-garde', name: 'Avant-Garde', category: 'Party', gradient: 'from-lime-400 to-emerald-600', accentColor: '#a3e635', accentColor2: '#059669', theme: 'modern' },
  { id: 'love-letter', name: 'Love Letter', category: 'Floral', gradient: 'from-pink-500 to-rose-600', accentColor: '#ec4899', accentColor2: '#e11d48', theme: 'elegant' },
  { id: 'blue-roses', name: 'Blue Roses', category: 'Floral', gradient: 'from-blue-500 to-indigo-600', accentColor: '#3b82f6', accentColor2: '#4f46e5', theme: 'ocean' },
  { id: 'pastel', name: 'Pastel', category: 'Floral', gradient: 'from-pink-300 to-sky-300', accentColor: '#f9a8d4', accentColor2: '#7dd3fc', theme: 'sunset' },
  { id: 'malay-vogue', name: 'Malay Vogue', category: 'Malay Vogue', gradient: 'from-emerald-500 to-teal-600', accentColor: '#10b981', accentColor2: '#0d9488', theme: 'nature' },
  { id: 'borneo-chic', name: 'Borneo Chic', category: 'Borneo Chic', gradient: 'from-orange-500 to-amber-600', accentColor: '#f97316', accentColor2: '#d97706', theme: 'sunset' },
  { id: 'chinese-couture', name: 'Chinese Couture', category: 'Chinese Couture', gradient: 'from-red-600 to-rose-700', accentColor: '#dc2626', accentColor2: '#be123c', theme: 'elegant' },
  { id: 'indian-flair', name: 'Indian Flair', category: 'Indian Flair', gradient: 'from-amber-500 to-pink-600', accentColor: '#f59e0b', accentColor2: '#db2777', theme: 'sunset' },
  // ---- Extended templates (toward 88+ like sedetik) ----
  { id: 'rose-garden', name: 'Rose Garden', category: 'Floral', gradient: 'from-rose-400 to-red-500', accentColor: '#fb7185', accentColor2: '#ef4444', theme: 'elegant' },
  { id: 'lavender', name: 'Lavender', category: 'Floral', gradient: 'from-purple-400 to-violet-500', accentColor: '#a78bfa', accentColor2: '#8b5cf6', theme: 'elegant' },
  { id: 'peony', name: 'Peony', category: 'Floral', gradient: 'from-pink-400 to-fuchsia-500', accentColor: '#f472b6', accentColor2: '#d946ef', theme: 'elegant' },
  { id: 'daisy', name: 'Daisy', category: 'Floral', gradient: 'from-yellow-300 to-amber-400', accentColor: '#fde047', accentColor2: '#fbbf24', theme: 'sunset' },
  { id: 'sunflower', name: 'Sunflower', category: 'Floral', gradient: 'from-yellow-400 to-orange-500', accentColor: '#facc15', accentColor2: '#f97316', theme: 'sunset' },
  { id: 'cherry-blossom', name: 'Cherry Blossom', category: 'Floral', gradient: 'from-pink-300 to-rose-400', accentColor: '#f9a8d4', accentColor2: '#fb7185', theme: 'sunset' },
  { id: 'jasmine', name: 'Jasmine', category: 'Floral', gradient: 'from-white to-emerald-200', accentColor: '#f8fafc', accentColor2: '#a7f3d0', theme: 'nature' },
  { id: 'hibiscus', name: 'Hibiscus', category: 'Cultural', gradient: 'from-red-500 to-pink-600', accentColor: '#ef4444', accentColor2: '#ec4899', theme: 'elegant' },
  { id: 'songket', name: 'Songket', category: 'Malay Vogue', gradient: 'from-amber-500 to-yellow-600', accentColor: '#d97706', accentColor2: '#ca8a04', theme: 'elegant' },
  { id: 'batik', name: 'Batik', category: 'Malay Vogue', gradient: 'from-teal-500 to-emerald-600', accentColor: '#14b8a6', accentColor2: '#059669', theme: 'nature' },
  { id: 'kebaya', name: 'Kebaya', category: 'Malay Vogue', gradient: 'from-pink-500 to-rose-400', accentColor: '#ec4899', accentColor2: '#fb7185', theme: 'elegant' },
  { id: 'songket-emas', name: 'Songket Emas', category: 'Malay Vogue', gradient: 'from-yellow-500 to-amber-700', accentColor: '#eab308', accentColor2: '#b45309', theme: 'elegant' },
  { id: 'sarawak', name: 'Sarawak', category: 'Borneo Chic', gradient: 'from-emerald-500 to-green-600', accentColor: '#10b981', accentColor2: '#16a34a', theme: 'nature' },
  { id: 'sabah', name: 'Sabah', category: 'Borneo Chic', gradient: 'from-sky-500 to-blue-600', accentColor: '#0ea5e9', accentColor2: '#2563eb', theme: 'ocean' },
  { id: 'mandarin', name: 'Mandarin', category: 'Chinese Couture', gradient: 'from-red-500 to-orange-600', accentColor: '#ef4444', accentColor2: '#ea580c', theme: 'elegant' },
  { id: 'sakura', name: 'Sakura', category: 'Chinese Couture', gradient: 'from-pink-400 to-red-300', accentColor: '#f472b6', accentColor2: '#fca5a5', theme: 'sunset' },
  { id: 'bangle', name: 'Bangle', category: 'Indian Flair', gradient: 'from-amber-400 to-rose-500', accentColor: '#fbbf24', accentColor2: '#f43f5e', theme: 'sunset' },
  { id: 'mehndi', name: 'Mehndi', category: 'Indian Flair', gradient: 'from-green-500 to-emerald-600', accentColor: '#22c55e', accentColor2: '#059669', theme: 'nature' },
  { id: 'bollywood', name: 'Bollywood', category: 'Indian Flair', gradient: 'from-orange-500 to-pink-600', accentColor: '#f97316', accentColor2: '#db2777', theme: 'sunset' },
  { id: 'hari-raya', name: 'Hari Raya', category: 'Festive', gradient: 'from-emerald-500 to-yellow-400', accentColor: '#10b981', accentColor2: '#facc15', theme: 'nature' },
  { id: 'deepavali', name: 'Deepavali', category: 'Festive', gradient: 'from-purple-500 to-amber-400', accentColor: '#a855f7', accentColor2: '#fbbf24', theme: 'elegant' },
  { id: 'christmas', name: 'Christmas', category: 'Festive', gradient: 'from-red-600 to-green-600', accentColor: '#dc2626', accentColor2: '#16a34a', theme: 'elegant' },
  { id: 'new-year', name: 'New Year', category: 'Festive', gradient: 'from-slate-800 to-amber-400', accentColor: '#1e293b', accentColor2: '#fbbf24', theme: 'modern' },
  { id: 'merdeka', name: 'Merdeka', category: 'Festive', gradient: 'from-blue-600 to-red-600', accentColor: '#2563eb', accentColor2: '#dc2626', theme: 'modern' },
  { id: 'disco', name: 'Disco', category: 'Party', gradient: 'from-fuchsia-500 to-cyan-400', accentColor: '#d946ef', accentColor2: '#22d3ee', theme: 'modern' },
  { id: 'neon', name: 'Neon', category: 'Party', gradient: 'from-lime-400 to-cyan-400', accentColor: '#a3e635', accentColor2: '#22d3ee', theme: 'modern' },
  { id: 'tropical', name: 'Tropical', category: 'Party', gradient: 'from-teal-400 to-lime-400', accentColor: '#2dd4bf', accentColor2: '#a3e635', theme: 'nature' },
  { id: 'beach', name: 'Beach', category: 'Party', gradient: 'from-cyan-400 to-blue-500', accentColor: '#22d3ee', accentColor2: '#3b82f6', theme: 'ocean' },
  { id: 'garden-party', name: 'Garden Party', category: 'Party', gradient: 'from-green-400 to-emerald-500', accentColor: '#4ade80', accentColor2: '#10b981', theme: 'nature' },
  { id: 'midnight-blue', name: 'Midnight Blue', category: 'Dark', gradient: 'from-blue-900 to-slate-900', accentColor: '#1e3a8a', accentColor2: '#0f172a', theme: 'modern' },
  { id: 'charcoal', name: 'Charcoal', category: 'Dark', gradient: 'from-zinc-700 to-zinc-900', accentColor: '#3f3f46', accentColor2: '#18181b', theme: 'modern' },
  { id: 'emerald-night', name: 'Emerald Night', category: 'Dark', gradient: 'from-emerald-900 to-slate-900', accentColor: '#064e3b', accentColor2: '#0f172a', theme: 'modern' },
  { id: 'burgundy', name: 'Burgundy', category: 'Dark', gradient: 'from-red-900 to-rose-950', accentColor: '#7f1d1d', accentColor2: '#4c0519', theme: 'elegant' },
  { id: 'navy-gold', name: 'Navy Gold', category: 'Classic', gradient: 'from-blue-900 to-amber-500', accentColor: '#1e3a8a', accentColor2: '#f59e0b', theme: 'elegant' },
  { id: 'ivory', name: 'Ivory', category: 'Classic', gradient: 'from-amber-100 to-yellow-200', accentColor: '#fef3c7', accentColor2: '#fde68a', theme: 'elegant' },
  { id: 'champagne', name: 'Champagne', category: 'Classic', gradient: 'from-amber-200 to-orange-300', accentColor: '#fde68a', accentColor2: '#fdba74', theme: 'elegant' },
  { id: 'silver', name: 'Silver', category: 'Classic', gradient: 'from-slate-300 to-slate-500', accentColor: '#cbd5e1', accentColor2: '#64748b', theme: 'modern' },
  { id: 'bronze', name: 'Bronze', category: 'Classic', gradient: 'from-amber-700 to-stone-700', accentColor: '#b45309', accentColor2: '#44403c', theme: 'elegant' },
  { id: 'platinum', name: 'Platinum', category: 'Classic', gradient: 'from-zinc-300 to-slate-400', accentColor: '#d4d4d8', accentColor2: '#94a3b8', theme: 'modern' },
  { id: 'watercolor', name: 'Watercolor', category: 'Floral', gradient: 'from-sky-300 to-pink-300', accentColor: '#7dd3fc', accentColor2: '#f9a8d4', theme: 'sunset' },
  { id: 'boho', name: 'Boho', category: 'Party', gradient: 'from-orange-300 to-rose-400', accentColor: '#fdba74', accentColor2: '#fb7185', theme: 'sunset' },
  { id: 'forest', name: 'Forest', category: 'Nature', gradient: 'from-green-700 to-emerald-800', accentColor: '#15803d', accentColor2: '#065f46', theme: 'nature' },
  { id: 'ocean-mist', name: 'Ocean Mist', category: 'Nature', gradient: 'from-cyan-300 to-blue-400', accentColor: '#67e8f9', accentColor2: '#60a5fa', theme: 'ocean' },
  { id: 'desert', name: 'Desert', category: 'Nature', gradient: 'from-amber-400 to-stone-500', accentColor: '#fbbf24', accentColor2: '#78716c', theme: 'sunset' },
  { id: 'aurora', name: 'Aurora', category: 'Dark', gradient: 'from-emerald-400 to-purple-600', accentColor: '#34d399', accentColor2: '#9333ea', theme: 'modern' },
  { id: 'galaxy', name: 'Galaxy', category: 'Dark', gradient: 'from-indigo-900 to-purple-900', accentColor: '#312e81', accentColor2: '#581c87', theme: 'modern' },
  { id: 'rose-gold', name: 'Rose Gold', category: 'Classic', gradient: 'from-rose-300 to-amber-300', accentColor: '#fda4af', accentColor2: '#fcd34d', theme: 'elegant' },
  { id: 'mint', name: 'Mint', category: 'Floral', gradient: 'from-emerald-300 to-teal-400', accentColor: '#6ee7b7', accentColor2: '#2dd4bf', theme: 'nature' },
  { id: 'coral-reef', name: 'Coral Reef', category: 'Nature', gradient: 'from-coral-400 to-rose-400', accentColor: '#fb923c', accentColor2: '#fb7185', theme: 'sunset' },
  { id: 'pearl', name: 'Pearl', category: 'Classic', gradient: 'from-slate-100 to-slate-300', accentColor: '#f1f5f9', accentColor2: '#cbd5e1', theme: 'elegant' },
  { id: 'emerald', name: 'Emerald', category: 'Classic', gradient: 'from-emerald-500 to-green-600', accentColor: '#10b981', accentColor2: '#16a34a', theme: 'nature' },
  { id: 'ruby', name: 'Ruby', category: 'Classic', gradient: 'from-red-600 to-rose-700', accentColor: '#dc2626', accentColor2: '#be123c', theme: 'elegant' },
  { id: 'sapphire', name: 'Sapphire', category: 'Classic', gradient: 'from-blue-600 to-indigo-700', accentColor: '#2563eb', accentColor2: '#4338ca', theme: 'ocean' },
  { id: 'amethyst', name: 'Amethyst', category: 'Classic', gradient: 'from-purple-500 to-violet-600', accentColor: '#a855f7', accentColor2: '#7c3aed', theme: 'elegant' },
  { id: 'topaz', name: 'Topaz', category: 'Classic', gradient: 'from-cyan-400 to-blue-500', accentColor: '#22d3ee', accentColor2: '#3b82f6', theme: 'ocean' },
  { id: 'garnet', name: 'Garnet', category: 'Dark', gradient: 'from-red-800 to-rose-900', accentColor: '#991b1b', accentColor2: '#881337', theme: 'elegant' },
  { id: 'gold-leaf', name: 'Gold Leaf', category: 'Classic', gradient: 'from-yellow-400 to-amber-500', accentColor: '#facc15', accentColor2: '#f59e0b', theme: 'elegant' },
  { id: 'noir', name: 'Noir', category: 'Dark', gradient: 'from-black to-zinc-800', accentColor: '#000000', accentColor2: '#27272a', theme: 'modern' },
  { id: 'monochrome', name: 'Monochrome', category: 'Classic', gradient: 'from-zinc-500 to-zinc-700', accentColor: '#71717a', accentColor2: '#3f3f46', theme: 'modern' },
  { id: 'sunset-glow', name: 'Sunset Glow', category: 'Party', gradient: 'from-orange-400 to-pink-500', accentColor: '#fb923c', accentColor2: '#ec4899', theme: 'sunset' },
  { id: 'ocean-breeze', name: 'Ocean Breeze', category: 'Nature', gradient: 'from-sky-400 to-cyan-400', accentColor: '#38bdf8', accentColor2: '#22d3ee', theme: 'ocean' },
  { id: 'autumn', name: 'Autumn', category: 'Nature', gradient: 'from-amber-600 to-red-600', accentColor: '#d97706', accentColor2: '#dc2626', theme: 'sunset' },
  { id: 'spring', name: 'Spring', category: 'Floral', gradient: 'from-green-300 to-pink-300', accentColor: '#86efac', accentColor2: '#f9a8d4', theme: 'nature' },
  { id: 'winter', name: 'Winter', category: 'Dark', gradient: 'from-slate-300 to-blue-400', accentColor: '#cbd5e1', accentColor2: '#60a5fa', theme: 'ocean' },
  { id: 'summer', name: 'Summer', category: 'Party', gradient: 'from-yellow-300 to-orange-400', accentColor: '#fde047', accentColor2: '#fb923c', theme: 'sunset' },
  { id: 'classic-white', name: 'Classic White', category: 'Classic', gradient: 'from-white to-slate-200', accentColor: '#ffffff', accentColor2: '#e2e8f0', theme: 'elegant' },
  { id: 'royal-blue', name: 'Royal Blue', category: 'Classic', gradient: 'from-blue-700 to-indigo-800', accentColor: '#1d4ed8', accentColor2: '#3730a3', theme: 'ocean' },
  { id: 'crimson', name: 'Crimson', category: 'Classic', gradient: 'from-red-500 to-rose-600', accentColor: '#ef4444', accentColor2: '#e11d48', theme: 'elegant' },
  // ---- KahwinNow-inspired categories (reka semula visual, bukan salinan aset) ----
  // Motion 001–006 — animated/luminous gradients
  { id: 'motion-001', name: 'Motion 001', category: 'Motion', gradient: 'from-rose-500 via-purple-500 to-indigo-500', accentColor: '#f43f5e', accentColor2: '#6366f1', theme: 'modern' },
  { id: 'motion-002', name: 'Motion 002', category: 'Motion', gradient: 'from-amber-400 via-pink-500 to-rose-500', accentColor: '#f59e0b', accentColor2: '#ec4899', theme: 'sunset' },
  { id: 'motion-003', name: 'Motion 003', category: 'Motion', gradient: 'from-emerald-400 via-teal-500 to-cyan-500', accentColor: '#34d399', accentColor2: '#06b6d4', theme: 'ocean' },
  { id: 'motion-004', name: 'Motion 004', category: 'Motion', gradient: 'from-indigo-500 via-blue-500 to-sky-400', accentColor: '#6366f1', accentColor2: '#38bdf8', theme: 'ocean' },
  { id: 'motion-005', name: 'Motion 005', category: 'Motion', gradient: 'from-fuchsia-500 via-purple-500 to-violet-600', accentColor: '#d946ef', accentColor2: '#8b5cf6', theme: 'elegant' },
  { id: 'motion-006', name: 'Motion 006', category: 'Motion', gradient: 'from-orange-400 via-red-500 to-rose-600', accentColor: '#fb923c', accentColor2: '#e11d48', theme: 'sunset' },
  // Floral 001–041 — botanical palettes
  { id: 'floral-001', name: 'Floral 001', category: 'Floral', gradient: 'from-rose-300 to-pink-400', accentColor: '#fda4af', accentColor2: '#f472b6', theme: 'elegant' },
  { id: 'floral-002', name: 'Floral 002', category: 'Floral', gradient: 'from-pink-400 to-rose-500', accentColor: '#f472b6', accentColor2: '#f43f5e', theme: 'elegant' },
  { id: 'floral-003', name: 'Floral 003', category: 'Floral', gradient: 'from-fuchsia-300 to-purple-400', accentColor: '#f0abfc', accentColor2: '#c084fc', theme: 'elegant' },
  { id: 'floral-004', name: 'Floral 004', category: 'Floral', gradient: 'from-purple-300 to-violet-400', accentColor: '#d8b4fe', accentColor2: '#a78bfa', theme: 'elegant' },
  { id: 'floral-005', name: 'Floral 005', category: 'Floral', gradient: 'from-rose-400 to-red-400', accentColor: '#fb7185', accentColor2: '#f87171', theme: 'elegant' },
  { id: 'floral-006', name: 'Floral 006', category: 'Floral', gradient: 'from-pink-300 to-fuchsia-300', accentColor: '#f9a8d4', accentColor2: '#f0abfc', theme: 'sunset' },
  { id: 'floral-007', name: 'Floral 007', category: 'Floral', gradient: 'from-red-300 to-pink-400', accentColor: '#fca5a5', accentColor2: '#f472b6', theme: 'sunset' },
  { id: 'floral-008', name: 'Floral 008', category: 'Floral', gradient: 'from-orange-200 to-rose-300', accentColor: '#fed7aa', accentColor2: '#fda4af', theme: 'sunset' },
  { id: 'floral-009', name: 'Floral 009', category: 'Floral', gradient: 'from-amber-200 to-pink-300', accentColor: '#fde68a', accentColor2: '#f9a8d4', theme: 'sunset' },
  { id: 'floral-010', name: 'Floral 010', category: 'Floral', gradient: 'from-yellow-200 to-rose-300', accentColor: '#fef08a', accentColor2: '#fda4af', theme: 'sunset' },
  { id: 'floral-011', name: 'Floral 011', category: 'Floral', gradient: 'from-lime-200 to-emerald-300', accentColor: '#d9f99d', accentColor2: '#6ee7b7', theme: 'nature' },
  { id: 'floral-012', name: 'Floral 012', category: 'Floral', gradient: 'from-emerald-200 to-teal-300', accentColor: '#a7f3d0', accentColor2: '#5eead4', theme: 'nature' },
  { id: 'floral-013', name: 'Floral 013', category: 'Floral', gradient: 'from-teal-200 to-cyan-300', accentColor: '#99f6e4', accentColor2: '#67e8f9', theme: 'nature' },
  { id: 'floral-014', name: 'Floral 014', category: 'Floral', gradient: 'from-sky-200 to-blue-300', accentColor: '#bae6fd', accentColor2: '#93c5fd', theme: 'ocean' },
  { id: 'floral-015', name: 'Floral 015', category: 'Floral', gradient: 'from-blue-200 to-indigo-300', accentColor: '#bfdbfe', accentColor2: '#a5b4fc', theme: 'ocean' },
  { id: 'floral-016', name: 'Floral 016', category: 'Floral', gradient: 'from-indigo-200 to-purple-300', accentColor: '#c7d2fe', accentColor2: '#d8b4fe', theme: 'elegant' },
  { id: 'floral-017', name: 'Floral 017', category: 'Floral', gradient: 'from-violet-200 to-purple-300', accentColor: '#ddd6fe', accentColor2: '#d8b4fe', theme: 'elegant' },
  { id: 'floral-018', name: 'Floral 018', category: 'Floral', gradient: 'from-rose-200 to-pink-300', accentColor: '#fecdd3', accentColor2: '#f9a8d4', theme: 'elegant' },
  { id: 'floral-019', name: 'Floral 019', category: 'Floral', gradient: 'from-pink-200 to-rose-300', accentColor: '#fbcfe8', accentColor2: '#fda4af', theme: 'elegant' },
  { id: 'floral-020', name: 'Floral 020', category: 'Floral', gradient: 'from-fuchsia-200 to-pink-300', accentColor: '#f5d0fe', accentColor2: '#f9a8d4', theme: 'elegant' },
  { id: 'floral-021', name: 'Floral 021', category: 'Floral', gradient: 'from-green-200 to-emerald-300', accentColor: '#bbf7d0', accentColor2: '#6ee7b7', theme: 'nature' },
  { id: 'floral-022', name: 'Floral 022', category: 'Floral', gradient: 'from-amber-200 to-yellow-300', accentColor: '#fde68a', accentColor2: '#fde047', theme: 'sunset' },
  { id: 'floral-023', name: 'Floral 023', category: 'Floral', gradient: 'from-orange-200 to-amber-300', accentColor: '#fed7aa', accentColor2: '#fcd34d', theme: 'sunset' },
  { id: 'floral-024', name: 'Floral 024', category: 'Floral', gradient: 'from-red-200 to-orange-300', accentColor: '#fecaca', accentColor2: '#fdba74', theme: 'sunset' },
  { id: 'floral-025', name: 'Floral 025', category: 'Floral', gradient: 'from-purple-200 to-fuchsia-300', accentColor: '#e9d5ff', accentColor2: '#f0abfc', theme: 'elegant' },
  { id: 'floral-026', name: 'Floral 026', category: 'Floral', gradient: 'from-rose-300 to-amber-200', accentColor: '#fda4af', accentColor2: '#fde68a', theme: 'sunset' },
  { id: 'floral-027', name: 'Floral 027', category: 'Floral', gradient: 'from-pink-300 to-sky-200', accentColor: '#f9a8d4', accentColor2: '#bae6fd', theme: 'ocean' },
  { id: 'floral-028', name: 'Floral 028', category: 'Floral', gradient: 'from-emerald-300 to-lime-200', accentColor: '#6ee7b7', accentColor2: '#d9f99d', theme: 'nature' },
  { id: 'floral-029', name: 'Floral 029', category: 'Floral', gradient: 'from-cyan-200 to-blue-300', accentColor: '#a5f3fc', accentColor2: '#93c5fd', theme: 'ocean' },
  { id: 'floral-030', name: 'Floral 030', category: 'Floral', gradient: 'from-violet-300 to-indigo-300', accentColor: '#c4b5fd', accentColor2: '#a5b4fc', theme: 'elegant' },
  { id: 'floral-031', name: 'Floral 031', category: 'Floral', gradient: 'from-rose-400 to-fuchsia-400', accentColor: '#fb7185', accentColor2: '#e879f9', theme: 'elegant' },
  { id: 'floral-032', name: 'Floral 032', category: 'Floral', gradient: 'from-pink-400 to-purple-400', accentColor: '#f472b6', accentColor2: '#c084fc', theme: 'elegant' },
  { id: 'floral-033', name: 'Floral 033', category: 'Floral', gradient: 'from-emerald-400 to-teal-400', accentColor: '#34d399', accentColor2: '#2dd4bf', theme: 'nature' },
  { id: 'floral-034', name: 'Floral 034', category: 'Floral', gradient: 'from-amber-300 to-rose-300', accentColor: '#fcd34d', accentColor2: '#fda4af', theme: 'sunset' },
  { id: 'floral-035', name: 'Floral 035', category: 'Floral', gradient: 'from-sky-300 to-violet-300', accentColor: '#7dd3fc', accentColor2: '#c4b5fd', theme: 'ocean' },
  { id: 'floral-036', name: 'Floral 036', category: 'Floral', gradient: 'from-lime-300 to-emerald-300', accentColor: '#bef264', accentColor2: '#6ee7b7', theme: 'nature' },
  { id: 'floral-037', name: 'Floral 037', category: 'Floral', gradient: 'from-orange-300 to-pink-300', accentColor: '#fdba74', accentColor2: '#f9a8d4', theme: 'sunset' },
  { id: 'floral-038', name: 'Floral 038', category: 'Floral', gradient: 'from-fuchsia-300 to-rose-300', accentColor: '#f0abfc', accentColor2: '#fda4af', theme: 'elegant' },
  { id: 'floral-039', name: 'Floral 039', category: 'Floral', gradient: 'from-teal-300 to-emerald-300', accentColor: '#5eead4', accentColor2: '#6ee7b7', theme: 'nature' },
  { id: 'floral-040', name: 'Floral 040', category: 'Floral', gradient: 'from-indigo-300 to-sky-300', accentColor: '#a5b4fc', accentColor2: '#7dd3fc', theme: 'ocean' },
  { id: 'floral-041', name: 'Floral 041', category: 'Floral', gradient: 'from-rose-200 to-fuchsia-300', accentColor: '#fecdd3', accentColor2: '#f0abfc', theme: 'elegant' },
  // Khat 001–022 — Islamic calligraphy (gold + teal/green)
  { id: 'khat-001', name: 'Khat 001', category: 'Khat', gradient: 'from-amber-500 to-yellow-600', accentColor: '#d4af37', accentColor2: '#b8860b', theme: 'elegant' },
  { id: 'khat-002', name: 'Khat 002', category: 'Khat', gradient: 'from-yellow-500 to-amber-600', accentColor: '#eab308', accentColor2: '#d97706', theme: 'elegant' },
  { id: 'khat-003', name: 'Khat 003', category: 'Khat', gradient: 'from-emerald-700 to-teal-600', accentColor: '#047857', accentColor2: '#0d9488', theme: 'nature' },
  { id: 'khat-004', name: 'Khat 004', category: 'Khat', gradient: 'from-teal-700 to-emerald-600', accentColor: '#0f766e', accentColor2: '#059669', theme: 'nature' },
  { id: 'khat-005', name: 'Khat 005', category: 'Khat', gradient: 'from-green-800 to-emerald-700', accentColor: '#166534', accentColor2: '#047857', theme: 'nature' },
  { id: 'khat-006', name: 'Khat 006', category: 'Khat', gradient: 'from-amber-600 to-orange-600', accentColor: '#d97706', accentColor2: '#ea580c', theme: 'elegant' },
  { id: 'khat-007', name: 'Khat 007', category: 'Khat', gradient: 'from-yellow-600 to-amber-500', accentColor: '#ca8a04', accentColor2: '#f59e0b', theme: 'elegant' },
  { id: 'khat-008', name: 'Khat 008', category: 'Khat', gradient: 'from-teal-600 to-cyan-600', accentColor: '#0d9488', accentColor2: '#0891b2', theme: 'ocean' },
  { id: 'khat-009', name: 'Khat 009', category: 'Khat', gradient: 'from-emerald-600 to-green-700', accentColor: '#059669', accentColor2: '#15803d', theme: 'nature' },
  { id: 'khat-010', name: 'Khat 010', category: 'Khat', gradient: 'from-amber-400 to-yellow-500', accentColor: '#fbbf24', accentColor2: '#eab308', theme: 'elegant' },
  { id: 'khat-011', name: 'Khat 011', category: 'Khat', gradient: 'from-slate-700 to-teal-700', accentColor: '#334155', accentColor2: '#0f766e', theme: 'nature' },
  { id: 'khat-012', name: 'Khat 012', category: 'Khat', gradient: 'from-yellow-400 to-amber-600', accentColor: '#facc15', accentColor2: '#d97706', theme: 'elegant' },
  { id: 'khat-013', name: 'Khat 013', category: 'Khat', gradient: 'from-emerald-500 to-teal-700', accentColor: '#10b981', accentColor2: '#0f766e', theme: 'nature' },
  { id: 'khat-014', name: 'Khat 014', category: 'Khat', gradient: 'from-amber-500 to-orange-500', accentColor: '#f59e0b', accentColor2: '#f97316', theme: 'sunset' },
  { id: 'khat-015', name: 'Khat 015', category: 'Khat', gradient: 'from-teal-500 to-emerald-600', accentColor: '#14b8a6', accentColor2: '#059669', theme: 'nature' },
  { id: 'khat-016', name: 'Khat 016', category: 'Khat', gradient: 'from-yellow-500 to-amber-500', accentColor: '#eab308', accentColor2: '#f59e0b', theme: 'elegant' },
  { id: 'khat-017', name: 'Khat 017', category: 'Khat', gradient: 'from-green-700 to-emerald-600', accentColor: '#15803d', accentColor2: '#059669', theme: 'nature' },
  { id: 'khat-018', name: 'Khat 018', category: 'Khat', gradient: 'from-amber-600 to-yellow-500', accentColor: '#d97706', accentColor2: '#eab308', theme: 'elegant' },
  { id: 'khat-019', name: 'Khat 019', category: 'Khat', gradient: 'from-teal-800 to-emerald-700', accentColor: '#115e59', accentColor2: '#047857', theme: 'nature' },
  { id: 'khat-020', name: 'Khat 020', category: 'Khat', gradient: 'from-orange-500 to-amber-600', accentColor: '#f97316', accentColor2: '#d97706', theme: 'sunset' },
  { id: 'khat-021', name: 'Khat 021', category: 'Khat', gradient: 'from-emerald-700 to-green-800', accentColor: '#047857', accentColor2: '#166534', theme: 'nature' },
  { id: 'khat-022', name: 'Khat 022', category: 'Khat', gradient: 'from-yellow-500 to-orange-600', accentColor: '#eab308', accentColor2: '#ea580c', theme: 'sunset' },
  // Luxury 001–003 — gold/navy/noir premium
  { id: 'luxury-001', name: 'Luxury 001', category: 'Luxury', gradient: 'from-slate-900 to-amber-600', accentColor: '#0f172a', accentColor2: '#d97706', theme: 'elegant' },
  { id: 'luxury-002', name: 'Luxury 002', category: 'Luxury', gradient: 'from-zinc-900 to-yellow-600', accentColor: '#18181b', accentColor2: '#ca8a04', theme: 'elegant' },
  { id: 'luxury-003', name: 'Luxury 003', category: 'Luxury', gradient: 'from-neutral-900 to-amber-500', accentColor: '#171717', accentColor2: '#f59e0b', theme: 'elegant' },
  // Simple 001–022 — minimalist clean palettes
  { id: 'simple-001', name: 'Simple 001', category: 'Simple', gradient: 'from-white to-slate-200', accentColor: '#ffffff', accentColor2: '#e2e8f0', theme: 'modern' },
  { id: 'simple-002', name: 'Simple 002', category: 'Simple', gradient: 'from-slate-100 to-slate-300', accentColor: '#f1f5f9', accentColor2: '#cbd5e1', theme: 'modern' },
  { id: 'simple-003', name: 'Simple 003', category: 'Simple', gradient: 'from-zinc-100 to-zinc-300', accentColor: '#f4f4f5', accentColor2: '#d4d4d8', theme: 'modern' },
  { id: 'simple-004', name: 'Simple 004', category: 'Simple', gradient: 'from-neutral-100 to-neutral-300', accentColor: '#f5f5f5', accentColor2: '#d4d4d4', theme: 'modern' },
  { id: 'simple-005', name: 'Simple 005', category: 'Simple', gradient: 'from-stone-100 to-stone-300', accentColor: '#f5f5f4', accentColor2: '#d6d3d1', theme: 'modern' },
  { id: 'simple-006', name: 'Simple 006', category: 'Simple', gradient: 'from-rose-100 to-rose-200', accentColor: '#ffe4e6', accentColor2: '#fecdd3', theme: 'elegant' },
  { id: 'simple-007', name: 'Simple 007', category: 'Simple', gradient: 'from-sky-100 to-sky-200', accentColor: '#e0f2fe', accentColor2: '#bae6fd', theme: 'ocean' },
  { id: 'simple-008', name: 'Simple 008', category: 'Simple', gradient: 'from-emerald-100 to-emerald-200', accentColor: '#d1fae5', accentColor2: '#a7f3d0', theme: 'nature' },
  { id: 'simple-009', name: 'Simple 009', category: 'Simple', gradient: 'from-amber-100 to-amber-200', accentColor: '#fef3c7', accentColor2: '#fde68a', theme: 'sunset' },
  { id: 'simple-010', name: 'Simple 010', category: 'Simple', gradient: 'from-indigo-100 to-indigo-200', accentColor: '#e0e7ff', accentColor2: '#c7d2fe', theme: 'modern' },
  { id: 'simple-011', name: 'Simple 011', category: 'Simple', gradient: 'from-slate-200 to-slate-400', accentColor: '#e2e8f0', accentColor2: '#94a3b8', theme: 'modern' },
  { id: 'simple-012', name: 'Simple 012', category: 'Simple', gradient: 'from-gray-100 to-gray-300', accentColor: '#f3f4f6', accentColor2: '#d1d5db', theme: 'modern' },
  { id: 'simple-013', name: 'Simple 013', category: 'Simple', gradient: 'from-teal-100 to-teal-200', accentColor: '#ccfbf1', accentColor2: '#99f6e4', theme: 'nature' },
  { id: 'simple-014', name: 'Simple 014', category: 'Simple', gradient: 'from-purple-100 to-purple-200', accentColor: '#f3e8ff', accentColor2: '#e9d5ff', theme: 'elegant' },
  { id: 'simple-015', name: 'Simple 015', category: 'Simple', gradient: 'from-pink-100 to-pink-200', accentColor: '#fce7f3', accentColor2: '#fbcfe8', theme: 'elegant' },
  { id: 'simple-016', name: 'Simple 016', category: 'Simple', gradient: 'from-orange-100 to-orange-200', accentColor: '#ffedd5', accentColor2: '#fed7aa', theme: 'sunset' },
  { id: 'simple-017', name: 'Simple 017', category: 'Simple', gradient: 'from-cyan-100 to-cyan-200', accentColor: '#cffafe', accentColor2: '#a5f3fc', theme: 'ocean' },
  { id: 'simple-018', name: 'Simple 018', category: 'Simple', gradient: 'from-lime-100 to-lime-200', accentColor: '#ecfccb', accentColor2: '#d9f99d', theme: 'nature' },
  { id: 'simple-019', name: 'Simple 019', category: 'Simple', gradient: 'from-violet-100 to-violet-200', accentColor: '#ede9fe', accentColor2: '#ddd6fe', theme: 'elegant' },
  { id: 'simple-020', name: 'Simple 020', category: 'Simple', gradient: 'from-blue-100 to-blue-200', accentColor: '#dbeafe', accentColor2: '#bfdbfe', theme: 'ocean' },
  { id: 'simple-021', name: 'Simple 021', category: 'Simple', gradient: 'from-slate-50 to-slate-200', accentColor: '#f8fafc', accentColor2: '#e2e8f0', theme: 'modern' },
  { id: 'simple-022', name: 'Simple 022', category: 'Simple', gradient: 'from-zinc-50 to-zinc-200', accentColor: '#fafafa', accentColor2: '#e4e4e7', theme: 'modern' },
  // Traditional 001–020 — songket/batik inspired (red/gold/green)
  { id: 'traditional-001', name: 'Traditional 001', category: 'Traditional', gradient: 'from-red-700 to-rose-600', accentColor: '#b91c1c', accentColor2: '#e11d48', theme: 'elegant' },
  { id: 'traditional-002', name: 'Traditional 002', category: 'Traditional', gradient: 'from-amber-700 to-yellow-600', accentColor: '#b45309', accentColor2: '#ca8a04', theme: 'elegant' },
  { id: 'traditional-003', name: 'Traditional 003', category: 'Traditional', gradient: 'from-emerald-700 to-green-600', accentColor: '#047857', accentColor2: '#16a34a', theme: 'nature' },
  { id: 'traditional-004', name: 'Traditional 004', category: 'Traditional', gradient: 'from-red-600 to-amber-600', accentColor: '#dc2626', accentColor2: '#d97706', theme: 'elegant' },
  { id: 'traditional-005', name: 'Traditional 005', category: 'Traditional', gradient: 'from-yellow-600 to-red-600', accentColor: '#ca8a04', accentColor2: '#dc2626', theme: 'elegant' },
  { id: 'traditional-006', name: 'Traditional 006', category: 'Traditional', gradient: 'from-green-700 to-amber-600', accentColor: '#15803d', accentColor2: '#d97706', theme: 'nature' },
  { id: 'traditional-007', name: 'Traditional 007', category: 'Traditional', gradient: 'from-rose-700 to-red-700', accentColor: '#be123c', accentColor2: '#b91c1c', theme: 'elegant' },
  { id: 'traditional-008', name: 'Traditional 008', category: 'Traditional', gradient: 'from-amber-600 to-emerald-700', accentColor: '#d97706', accentColor2: '#047857', theme: 'nature' },
  { id: 'traditional-009', name: 'Traditional 009', category: 'Traditional', gradient: 'from-red-700 to-emerald-700', accentColor: '#b91c1c', accentColor2: '#047857', theme: 'elegant' },
  { id: 'traditional-010', name: 'Traditional 010', category: 'Traditional', gradient: 'from-yellow-500 to-amber-700', accentColor: '#eab308', accentColor2: '#b45309', theme: 'elegant' },
  { id: 'traditional-011', name: 'Traditional 011', category: 'Traditional', gradient: 'from-red-500 to-rose-700', accentColor: '#ef4444', accentColor2: '#be123c', theme: 'elegant' },
  { id: 'traditional-012', name: 'Traditional 012', category: 'Traditional', gradient: 'from-amber-500 to-red-600', accentColor: '#f59e0b', accentColor2: '#dc2626', theme: 'elegant' },
  { id: 'traditional-013', name: 'Traditional 013', category: 'Traditional', gradient: 'from-emerald-600 to-green-700', accentColor: '#059669', accentColor2: '#15803d', theme: 'nature' },
  { id: 'traditional-014', name: 'Traditional 014', category: 'Traditional', gradient: 'from-yellow-600 to-green-700', accentColor: '#ca8a04', accentColor2: '#15803d', theme: 'nature' },
  { id: 'traditional-015', name: 'Traditional 015', category: 'Traditional', gradient: 'from-red-600 to-yellow-600', accentColor: '#dc2626', accentColor2: '#ca8a04', theme: 'elegant' },
  { id: 'traditional-016', name: 'Traditional 016', category: 'Traditional', gradient: 'from-amber-700 to-rose-700', accentColor: '#b45309', accentColor2: '#be123c', theme: 'elegant' },
  { id: 'traditional-017', name: 'Traditional 017', category: 'Traditional', gradient: 'from-green-600 to-emerald-700', accentColor: '#16a34a', accentColor2: '#047857', theme: 'nature' },
  { id: 'traditional-018', name: 'Traditional 018', category: 'Traditional', gradient: 'from-rose-600 to-amber-600', accentColor: '#e11d48', accentColor2: '#d97706', theme: 'elegant' },
  { id: 'traditional-019', name: 'Traditional 019', category: 'Traditional', gradient: 'from-red-700 to-amber-700', accentColor: '#b91c1c', accentColor2: '#b45309', theme: 'elegant' },
  { id: 'traditional-020', name: 'Traditional 020', category: 'Traditional', gradient: 'from-emerald-700 to-amber-700', accentColor: '#047857', accentColor2: '#b45309', theme: 'nature' },
]

export function templateById(id: string): EventTemplate | undefined {
  return templates.find(t => t.id === id)
}

// Finds a template by its accent colour (accent colour doubles as the
// template selector in the current schema, which only stores theme+accent).
export function templateByAccentColor(color: string): EventTemplate | undefined {
  const c = color?.toLowerCase()
  return templates.find(t => t.accentColor.toLowerCase() === c)
}

export function templatesByCategory(category: TemplateCategory): EventTemplate[] {
  return templates.filter(t => t.category === category)
}
