// Programmatic SVG motifs for wedding templates.
// Each category gets an abstract decorative pattern rendered as an SVG data URI
// or inline <svg>, so the portal/catalog can show a floral / khat / traditional
// motif without shipping any copyrighted image assets.

export type MotifKind =
  | 'floral'    // abstract flower petals / botanical
  | 'khat'      // abstract islamic calligraphy arcs / geometry
  | 'luxury'    // gold arabesque / laurel
  | 'simple'    // minimal line / dot grid
  | 'traditional' // songket / batik diamond lattice
  | 'motion'    // luminous rays / orbit rings

// Returns an inline SVG <pattern> id + a full <svg> element string for a category.
// We keep this as a function returning JSX (inline) for easy embedding.
export function motifKindForCategory(category: string): MotifKind {
  switch (category) {
    case 'Floral': return 'floral'
    case 'Khat': return 'khat'
    case 'Luxury': return 'luxury'
    case 'Simple': return 'simple'
    case 'Traditional': return 'traditional'
    case 'Motion': return 'motion'
    default: return 'floral'
  }
}

// Renders a decorative SVG overlay. `kind` selects the motif, `accent` is the
// stroke colour (hex). Renders as a full-bleed SVG with low opacity strokes.
export function MotifOverlay({ kind, accent }: { kind: MotifKind; accent: string }) {
  const s = (w: number) => ({ stroke: accent, strokeWidth: w, fill: 'none', strokeLinecap: 'round' as const })
  return (
    <svg
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
      aria-hidden="true"
    >
      {kind === 'floral' && (
        <g {...s(1)}>
          {/* abstract flower: petals + center */}
          <ellipse cx="100" cy="100" rx="60" ry="60" />
          <ellipse cx="100" cy="100" rx="30" ry="60" />
          <ellipse cx="100" cy="100" rx="60" ry="30" />
          <circle cx="100" cy="100" r="18" />
          {[0, 45, 90, 135].map(a => (
            <ellipse key={a} cx="100" cy="100" rx="80" ry="24" transform={`rotate(${a} 100 100)`} />
          ))}
          <circle cx="40" cy="40" r="12" />
          <circle cx="160" cy="160" r="12" />
          <circle cx="160" cy="40" r="8" />
          <circle cx="40" cy="160" r="8" />
        </g>
      )}
      {kind === 'khat' && (
        <g {...s(1)}>
          {/* abstract islamic arcs / mosque dome + crescent */}
          <path d="M40 120 Q70 60 100 120 Q130 60 160 120" />
          <path d="M60 120 Q80 80 100 120 Q120 80 140 120" />
          <path d="M100 120 L100 160" />
          <path d="M70 160 Q100 150 130 160" />
          <path d="M150 50 Q165 35 178 48 Q168 60 150 50" />
          <circle cx="158" cy="48" r="6" />
          <path d="M30 90 Q20 70 40 70" />
          <path d="M170 90 Q180 70 160 70" />
        </g>
      )}
      {kind === 'luxury' && (
        <g {...s(1)}>
          {/* gold arabesque / laurel */}
          <path d="M30 150 Q60 120 100 130 Q140 120 170 150" />
          <path d="M30 150 Q40 130 50 150 Q60 130 70 150 Q80 130 90 150 Q100 130 110 150 Q120 130 130 150 Q140 130 150 150 Q160 130 170 150" />
          <circle cx="100" cy="110" r="16" />
          <circle cx="100" cy="110" r="8" />
          <path d="M100 50 L105 80 L135 70 L112 92 L130 120 L100 104 L70 120 L88 92 L65 70 L95 80 Z" />
        </g>
      )}
      {kind === 'simple' && (
        <g {...s(1)}>
          {/* minimal line + dots */}
          <path d="M40 100 L160 100" />
          <path d="M100 40 L100 160" />
          <circle cx="100" cy="100" r="30" />
          {[[40,40],[160,40],[40,160],[160,160]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="3" fill={accent} />
          ))}
        </g>
      )}
      {kind === 'traditional' && (
        <g {...s(1)}>
          {/* songket / batik diamond lattice */}
          <rect x="40" y="40" width="120" height="120" transform="rotate(45 100 100)" />
          <rect x="60" y="60" width="80" height="80" transform="rotate(45 100 100)" />
          <path d="M40 100 L160 100" />
          <path d="M100 40 L100 160" />
          <path d="M55 55 L145 145" />
          <path d="M145 55 L55 145" />
          <circle cx="100" cy="100" r="10" />
        </g>
      )}
      {kind === 'motion' && (
        <g {...s(1)}>
          {/* luminous rays / orbit rings */}
          <circle cx="100" cy="100" r="70" />
          <circle cx="100" cy="100" r="50" />
          <circle cx="100" cy="100" r="30" />
          {[0, 30, 60, 90, 120, 150].map(a => (
            <line key={a} x1="100" y1="100" x2={100 + 90 * Math.cos(a * Math.PI / 180)} y2={100 + 90 * Math.sin(a * Math.PI / 180)} />
          ))}
          <circle cx="100" cy="100" r="8" fill={accent} stroke="none" />
        </g>
      )}
    </svg>
  )
}
