"use client"

import React, { useEffect, useMemo, useState } from 'react'
import GlassCard from '@/components/ui/GlassCard'
import { weddingChecklist, checklistCategories, checklistByCategory } from '@/lib/wedding-checklist'
import { ClipboardCheck, ExternalLink } from 'lucide-react'

interface WeddingChecklistWidgetProps {
  eventId: string
}

export default function WeddingChecklistWidget({ eventId }: WeddingChecklistWidgetProps) {
  const [done, setDone] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/events/${eventId}`, { cache: 'no-store' })
      .then(async response => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        setDone((data.event.theme_config?.customization?.checklistDone) || [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [eventId])

  const toggle = (id: string) => {
    setDone(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      save(next)
      return next
    })
  }

  const save = async (next: string[]) => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const response = await fetch(`/api/events/${eventId}/customization`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklistDone: next }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  const total = weddingChecklist.length
  const doneCount = done.length
  const progress = Math.round((doneCount / total) * 100)

  if (loading) return <p className="text-white/60 text-sm">Memuatkan senarai semak...</p>

  return (
    <GlassCard variant="dark" glow="amber" className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-amber-400" /> Senarai Semak Kahwin
        </h3>
        <span className="text-sm text-white/60">{doneCount} / {total} siap</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all" style={{ width: `${progress}%` }} />
      </div>

      {error && <p role="alert" className="text-rose-300 text-sm">{error}</p>}
      {saved && <p role="status" className="text-emerald-300 text-sm">Kemajuan disimpan.</p>}

      <div className="space-y-5">
        {checklistCategories.map(cat => {
          const items = checklistByCategory(cat.id)
          if (items.length === 0) return null
          return (
            <div key={cat.id}>
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <span>{cat.icon}</span> {cat.name}
              </h4>
              <div className="space-y-1.5">
                {items.map(item => {
                  const checked = done.includes(item.id)
                  return (
                    <label key={item.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                      <input type="checkbox" checked={checked} onChange={() => toggle(item.id)} className="mt-0.5 w-4 h-4 accent-emerald-500 shrink-0" />
                      <span className={`flex-1 text-sm ${checked ? 'text-white/40 line-through' : 'text-white'}`}>{item.label}</span>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-amber-300 hover:text-amber-200 shrink-0" title="Buka pautan rasmi">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {saving && <p className="text-white/40 text-xs">Menyimpan...</p>}
    </GlassCard>
  )
}
