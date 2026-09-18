"use client"

import React from "react"
import GlassCard from "@/components/ui/GlassCard"
import { Gift, ExternalLink, Check } from "lucide-react"
import type { WishlistItem } from "@/lib/gallery-customization"

export default function Wishlist({ items }: { items: WishlistItem[] }) {
  if (!items || items.length === 0) return null
  return (
    <GlassCard variant="light" glow="emerald">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-emerald-500/20">
          <Gift className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Wishlist Hadiah</h3>
          <p className="text-sm text-white/60">Senarai hadiah — elak hadiah berulang</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={item.id || i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${item.reserved ? 'text-white/40 line-through' : 'text-white'}`}>{item.name}</p>
              {item.reserved && <p className="text-[10px] text-amber-300 flex items-center gap-1"><Check className="w-3 h-3" /> Ditepah</p>}
            </div>
            {item.link && !item.reserved && (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:text-emerald-200 shrink-0" title="Buka pautan">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
