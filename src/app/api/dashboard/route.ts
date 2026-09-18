import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Sila log masuk dahulu' }, { status: 401 })
  try {
    const { data: events, error } = await supabaseAdmin.from('events')
      .select('id, title, slug, event_type, event_date, created_at, is_active, drive_folder_id, event_modules(module_type, is_enabled)')
      .eq('host_id', session.user.id).order('created_at', { ascending: false })
    if (error) throw error
    const withStats = await Promise.all((events || []).map(async event => {
      const results = await Promise.all([
        supabaseAdmin.from('rsvps').select('id', { count: 'exact', head: true }).eq('event_id', event.id),
        supabaseAdmin.from('rsvps').select('id', { count: 'exact', head: true }).eq('event_id', event.id).eq('checked_in', true),
      ])
      if (results.some(result => result.error)) throw new Error('Statistik tidak tersedia')
      // Media is stored on the host's Google Drive, not in Supabase.
      return { ...event, rsvp_count: results[0].count || 0, checked_in_count: results[1].count || 0, media_count: 0 }
    }))
    const { data: profile, error: profileError } = await supabaseAdmin.from('profiles')
      .select('id, email, full_name, avatar_url, created_at').eq('id', session.user.id).single()
    if (profileError) throw profileError
    return Response.json({ events: withStats, profile }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch {
    return Response.json({ error: 'Gagal memuatkan dashboard. Sila cuba lagi.' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Sila log masuk dahulu' }, { status: 401 })
  const parsed = z.object({ full_name: z.string().trim().min(2).max(255) }).strict().safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'Nama tidak sah' }, { status: 400 })
  const { data, error } = await supabaseAdmin.from('profiles').update(parsed.data).eq('id', session.user.id).select('id').single()
  if (error || !data) return Response.json({ error: 'Gagal menyimpan profil' }, { status: 500 })
  return Response.json({ success: true })
}