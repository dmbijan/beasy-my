import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'node:crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'
export { POST } from './create/route'

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('slug')
    if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 100) return NextResponse.json({ error: 'Slug tidak sah' }, { status: 400 })
    const { data: event, error } = await supabaseAdmin.from('events').select(`
      id, slug, title, event_type, event_date, venue_name, venue_address, maps_link,
      description, dress_code, rsvp_deadline, theme_config, accent_color, cover_image,
      facebook_link, instagram_link, whatsapp_link, website_link, plan, is_anonymous,
      host_id, claim_token_hash, event_modules(module_type, is_enabled, settings)
    `).eq('slug', slug).eq('is_active', true).single()
    if (error || !event) return NextResponse.json({ error: 'Acara tidak dijumpai atau tidak aktif' }, { status: 404 })
    const session = await auth()
    const { host_id, claim_token_hash, ...publicEvent } = event
    const claimToken = req.cookies.get(`beasy_claim_${slug}`)?.value
    let canClaim = false
    if (!host_id && event.is_anonymous && claimToken && claim_token_hash) {
      const supplied = createHash('sha256').update(claimToken).digest()
      const stored = Buffer.from(claim_token_hash, 'hex')
      canClaim = stored.length === supplied.length && timingSafeEqual(stored, supplied)
    }
    return NextResponse.json({ event: {
      ...publicEvent, event_modules: event.event_modules.filter(module => module.is_enabled),
      isOwner: !!session?.user?.id && session.user.id === host_id, canClaim,
    } }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch {
    return NextResponse.json({ error: 'Gagal memuatkan acara' }, { status: 500 })
  }
}