"use client"

import React from "react"
import GlassCard from "@/components/ui/GlassCard"
import { Clock, CalendarDays } from "lucide-react"
import type { ItineraryItem } from "@/lib/gallery-customization"

export default function Itinerary({ items }: { items: ItineraryItem[] }) {
  if (!items || items.length === 0) return null
  const sorted = [...items].sort((a, b) => a.time.localeCompare(b.time))
  return (
    <GlassCard variant="light" glow="default">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-indigo-500/20">
          <CalendarDays className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Aturcara Majlis</h3>
          <p className="text-sm text-white/60">Jadual sepanjang majlis berlangsung</p>
        </div>
      </div>
      <div className="space-y-3">
        {sorted.map((item, i) => (
          <div key={item.id || i} className="flex gap-3 items-start">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-white/70" />
              </div>
              {i < sorted.length - 1 && <div className="w-px flex-1 bg-white/10 my-1" />}
            </div>
            <div className="flex-1 pb-1">
              {item.time && <p className="text-xs font-semibold text-indigo-300 mb-0.5">{item.time}</p>}
              <p className="text-white font-medium">{item.title}</p>
              {item.description && <p className="text-sm text-white/60">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
