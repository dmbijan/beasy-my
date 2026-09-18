// Shared theme → background helper.
// Used by both the create-page preview and the public event portal so that a
// selected template (theme + accentColor) renders a consistent look.

export type EventTheme = 'glass' | 'elegant' | 'modern' | 'nature' | 'ocean' | 'sunset'

// Maps a schema `theme` value to a CSS `background` string.
export function themeBackground(theme: string | undefined): string {
  switch (theme) {
    case 'elegant': return 'linear-gradient(135deg, #d4af37, #8b4513)'
    case 'modern': return '#1a1a2e'
    case 'nature': return 'linear-gradient(135deg, #2d6a4f, #40916c)'
    case 'ocean': return 'linear-gradient(135deg, #023e8a, #0077b6)'
    case 'sunset': return 'linear-gradient(135deg, #e63946, #f4a261)'
    case 'glass':
    default: return 'rgba(255,255,255,0.05)'
  }
}

// Maps a schema `theme` value to a full-page gradient (for the portal backdrop).
export function themePageGradient(theme: string | undefined): string {
  switch (theme) {
    case 'elegant': return 'linear-gradient(135deg, #1f1204, #3d2706, #6b4a12)'
    case 'modern': return 'linear-gradient(135deg, #0f0f1a, #1a1a2e, #23233a)'
    case 'nature': return 'linear-gradient(135deg, #0c1f14, #1e3a28, #2d6a4f)'
    case 'ocean': return 'linear-gradient(135deg, #021530, #023e8a, #0077b6)'
    case 'sunset': return 'linear-gradient(135deg, #4a0e16, #8a1f2b, #e63946)'
    case 'glass':
    default: return 'linear-gradient(135deg, #1a0b12, #2b1020, #3a1428)'
  }
}

// Maps an accent hex colour to a low-opacity rgba string (for borders/tints).
export function accentWithAlpha(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(clean)) return `rgba(244, 63, 94, ${alpha})`
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
