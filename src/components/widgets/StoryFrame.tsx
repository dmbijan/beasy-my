"use client"

import React from 'react'

// SVG story frame overlays — 22 decorative photo frames (Galeri Kawen-inspired).
// Each frame renders as an absolutely-positioned SVG overlay on top of a photo.
// No external PNG assets required; pure inline SVG that scales with the container.

interface StoryFrameProps {
  frameId: string
  className?: string
  colour?: string
}

// Each frame is a distinct SVG composition. We use a simple decorative approach:
// a rounded rectangle border plus a motif (floral dots, ribbons, scallops, etc.)
function frameContent(id: string, colour: string) {
  const c = colour || '#ffffff'
  const accent = colour || '#f9a8d4'

  switch (id) {
    case 'orchid':
      return (
        <>
          <rect x="4" y="4" width="92" height="92" rx="12" fill="none" stroke={c} strokeWidth="3" />
          <circle cx="20" cy="20" r="4" fill={accent} /><circle cx="80" cy="20" r="4" fill={accent} />
          <circle cx="20" cy="80" r="4" fill={accent} /><circle cx="80" cy="80" r="4" fill={accent} />
          <circle cx="50" cy="14" r="3" fill={c} /><circle cx="14" cy="50" r="3" fill={c} />
          <circle cx="86" cy="50" r="3" fill={c} /><circle cx="50" cy="86" r="3" fill={c} />
        </>
      )
    case 'ribbon-frame-2':
    case 'ribbon-frame-1':
      return (
        <>
          <rect x="4" y="4" width="92" height="92" rx="8" fill="none" stroke={c} strokeWidth="4" />
          <rect x="10" y="10" width="80" height="80" rx="4" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M4 20 L20 4 M4 80 L20 96 M96 20 L80 4 M96 80 L80 96" stroke={c} strokeWidth="4" fill="none" />
        </>
      )
    case 'tulip-1':
    case 'floral-3':
    case 'floral':
    case 'floral-2':
      return (
        <>
          <rect x="6" y="6" width="88" height="88" rx="16" fill="none" stroke={c} strokeWidth="2.5" />
          {[16, 50, 84].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy="8" r="3" fill={accent} />
              <circle cx={x - 4} cy="13" r="2.5" fill={c} />
              <circle cx={x + 4} cy="13" r="2.5" fill={c} />
            </g>
          ))}
          <path d="M8 50 q4 -6 8 0 q-4 6 -8 0 M92 50 q-4 -6 -8 0 q4 6 8 0" fill={accent} />
        </>
      )
    case 'flower-frame-2':
    case 'flower-frame':
      return (
        <>
          <circle cx="50" cy="50" r="46" fill="none" stroke={c} strokeWidth="3" />
          {[0, 60, 120, 180, 240, 300].map(angle => (
            <g key={angle} transform={`rotate(${angle} 50 50)`}>
              <ellipse cx="50" cy="10" rx="6" ry="9" fill={accent} opacity="0.8" />
            </g>
          ))}
        </>
      )
    case 'classic-frame':
      return (
        <>
          <rect x="3" y="3" width="94" height="94" rx="3" fill="none" stroke={c} strokeWidth="5" />
          <rect x="9" y="9" width="82" height="82" rx="2" fill="none" stroke="#e2e8f0" strokeWidth="1" />
        </>
      )
    case 'balloon':
      return (
        <>
          <rect x="6" y="6" width="88" height="88" rx="20" fill="none" stroke={c} strokeWidth="2.5" />
          <circle cx="25" cy="25" r="6" fill={accent} />
          <circle cx="75" cy="25" r="6" fill="#7dd3fc" />
          <circle cx="25" cy="75" r="6" fill="#fde047" />
          <circle cx="75" cy="75" r="6" fill="#86efac" />
        </>
      )
    case 'minimalist':
      return (
        <>
          <rect x="8" y="8" width="84" height="84" rx="2" fill="none" stroke={c} strokeWidth="1.5" opacity="0.7" />
        </>
      )
    case 'news-paper':
      return (
        <>
          <rect x="5" y="5" width="90" height="90" rx="2" fill="none" stroke={c} strokeWidth="2" />
          <line x1="14" y1="20" x2="86" y2="20" stroke={c} strokeWidth="1" opacity="0.5" />
          <line x1="14" y1="30" x2="86" y2="30" stroke={c} strokeWidth="1" opacity="0.5" />
          <line x1="14" y1="40" x2="60" y2="40" stroke={c} strokeWidth="1" opacity="0.5" />
          <rect x="14" y="50" width="34" height="34" fill="none" stroke={c} strokeWidth="1" opacity="0.5" />
        </>
      )
    case 'princess':
    case 'royal-mirror':
      return (
        <>
          <rect x="5" y="5" width="90" height="90" rx="24" fill="none" stroke={c} strokeWidth="4" />
          <rect x="12" y="12" width="76" height="76" rx="16" fill="none" stroke={accent} strokeWidth="2" />
          <path d="M50 2 l3 8 -3 8 -3 -8 z" fill={accent} />
        </>
      )
    case 'sketched-flower-1':
    case 'sketched-flower-2':
      return (
        <>
          <rect x="5" y="5" width="90" height="90" rx="10" fill="none" stroke={c} strokeWidth="2" strokeDasharray="6 4" />
          <path d="M50 20 q-6 8 0 16 q6 -8 0 -16" stroke={c} fill="none" strokeWidth="1.5" />
          <path d="M20 50 q8 -6 16 0 q-8 6 -16 0" stroke={c} fill="none" strokeWidth="1.5" />
          <path d="M50 64 q-6 8 0 16 q6 -8 0 -16" stroke={c} fill="none" strokeWidth="1.5" />
          <path d="M64 50 q8 -6 16 0 q-8 6 -16 0" stroke={c} fill="none" strokeWidth="1.5" />
        </>
      )
    case 'garden':
      return (
        <>
          <rect x="6" y="6" width="88" height="88" rx="12" fill="none" stroke={c} strokeWidth="3" />
          {[20, 35, 50, 65, 80].map((x, i) => (
            <path key={i} d={`M${x} 8 q2 -6 0 -12 M${x} 8 q-2 -6 0 -12`} stroke="#4ade80" strokeWidth="1.5" fill="none" />
          ))}
          <circle cx="50" cy="50" r="30" fill="none" stroke="#4ade80" strokeWidth="1" opacity="0.5" />
        </>
      )
    case 'mirror':
      return (
        <>
          <ellipse cx="50" cy="50" rx="46" ry="46" fill="none" stroke={c} strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="40" ry="40" fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.6" />
        </>
      )
    case 'love-story':
      return (
        <>
          <rect x="6" y="6" width="88" height="88" rx="14" fill="none" stroke={c} strokeWidth="2.5" />
          <path d="M50 28 C40 18 24 22 24 34 C24 46 50 54 50 60 C50 54 76 46 76 34 C76 22 60 18 50 28 Z" fill={accent} opacity="0.85" />
          <path d="M30 34 C30 42 44 50 50 54 C56 50 70 42 70 34 C70 26 58 24 50 30 C42 24 30 26 30 34 Z" fill="#fecdd3" opacity="0.6" />
        </>
      )
    case 'new-chapter':
      return (
        <>
          <rect x="5" y="5" width="90" height="90" rx="6" fill="none" stroke={c} strokeWidth="2" />
          <line x1="50" y1="5" x2="50" y2="95" stroke={c} strokeWidth="1" opacity="0.4" />
          <path d="M14 12 q4 -4 8 0 M78 12 q4 -4 8 0" stroke={c} strokeWidth="1.5" fill="none" />
        </>
      )
    case 'muslim':
      return (
        <>
          <rect x="6" y="6" width="88" height="88" rx="14" fill="none" stroke={c} strokeWidth="2.5" />
          <path d="M50 20 a6 6 0 0 1 6 6 h-12 a6 6 0 0 1 6 -6 Z" fill={accent} />
          <path d="M30 26 l3 10 M70 26 l-3 10" stroke={accent} strokeWidth="2" fill="none" />
          <path d="M50 30 q-10 14 0 26 q10 -12 0 -26" stroke={c} strokeWidth="1.5" fill="none" opacity="0.7" />
        </>
      )
    default:
      return (
        <rect x="4" y="4" width="92" height="92" rx="10" fill="none" stroke={c} strokeWidth="2.5" />
      )
  }
}

export default function StoryFrame({ frameId, className, colour }: StoryFrameProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      {frameContent(frameId, colour || '#ffffff')}
    </svg>
  )
}
