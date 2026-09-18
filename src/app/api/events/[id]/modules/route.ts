import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'
import { isPremiumHost, PREMIUM_MODULES } from '@/lib/premium'

const moduleSchema = z.object({
  module_type: z.string().min(1).max(50),
  is_enabled: z.boolean(),
})

const FREE_MODULES = new Set(['rsvp', 'seating', 'menu'])
const ALL_KNOWN = new Set<string>([...FREE_MODULES, ...PREMIUM_MODULES])

// PATCH /api/events/[id]/modules — toggle a module on/off for the event.
// Premium modules require an active premium host.
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Sila log masuk dahulu' }, { status: 401 })
    const { id } = await context.params
    if (!z.string().uuid().safeParse(id).success) return NextResponse.json({ error: 'ID tidak sah' }, { status: 400 })

    const parsed = moduleSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return NextResponse.json({ error: 'Maklumat modul tidak sah' }, { status: 400 })
    const { module_type, is_enabled } = parsed.data

    if (!ALL_KNOWN.has(module_type)) {
      return NextResponse.json({ error: 'Modul tidak dikenali' }, { status: 400 })
    }

    // Verify event ownership.
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events').select('host_id').eq('id', id).maybeSingle()
    if (eventError || !event) return NextResponse.json({ error: 'Acara tidak dijumpai' }, { status: 404 })
    if (event.host_id !== session.user.id) return NextResponse.json({ error: 'Bukan tuan rumah acara ini' }, { status: 403 })

    // Premium gate: free hosts may not enable premium modules.
    const isPremium = await isPremiumHost(session.user.id)
    if (is_enabled && (PREMIUM_MODULES as readonly string[]).includes(module_type) && !isPremium) {
      return NextResponse.json({ error: `Modul ${module_type} memerlukan pelan Premium` }, { status: 403 })
    }

    // Toggle: update if exists, otherwise insert.
    const { data: existing } = await supabaseAdmin.from('event_modules')
      .select('id').eq('event_id', id).eq('module_type', module_type).maybeSingle()
    const now = new Date().toISOString()
    const { data, error } = existing
      ? await supabaseAdmin.from('event_modules')
          .update({ is_enabled, updated_at: now }).eq('id', existing.id)
          .select('event_id, module_type, is_enabled').single()
      : await supabaseAdmin.from('event_modules')
          .insert({ event_id: id, module_type, is_enabled, settings: {}, updated_at: now })
          .select('event_id, module_type, is_enabled').single()

    if (error) return NextResponse.json({ error: 'Gagal mengemas kini modul' }, { status: 500 })
    return NextResponse.json({ success: true, module: data })
  } catch {
    return NextResponse.json({ error: 'Ralat server' }, { status: 500 })
  }
}