import { NextResponse } from 'next/server'
import { randomUUID, createHash } from 'node:crypto'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { defaultEventModules, eventRow, eventSchema } from '@/lib/event-schema'

export async function POST(req: Request) {
  try {
    const data = eventSchema.parse(await req.json())
    const session = await auth()
    const hostId = session?.user?.id || null
    const claimToken = hostId ? null : randomUUID()
    const { data: event, error } = await supabaseAdmin.from('events').insert({
      ...eventRow(data), host_id: hostId, is_anonymous: !hostId, is_active: false, plan: 'free',
      claim_token_hash: claimToken ? createHash('sha256').update(claimToken).digest('hex') : null,
    }).select('id, slug, title').single()
    if (error || !event) {
      return NextResponse.json({ error: error?.code === '23505' ? 'Slug sudah digunakan. Pilih pautan lain.' : 'Gagal menyimpan acara. Sila cuba lagi.' }, { status: error?.code === '23505' ? 409 : 500 })
    }
    const { error: moduleError } = await supabaseAdmin.from('event_modules').insert(
      defaultEventModules(data).map(module => ({ event_id: event.id, ...module }))
    )
    if (moduleError) {
      await supabaseAdmin.from('events').delete().eq('id', event.id).eq('is_active', false)
      return NextResponse.json({ error: 'Gagal menyediakan modul acara.' }, { status: 500 })
    }
    const { data: published, error: publishError } = await supabaseAdmin.from('events').update({ is_active: true })
      .eq('id', event.id).select('id').single()
    if (publishError || !published) return NextResponse.json({ error: 'Acara belum berjaya diterbitkan.' }, { status: 500 })
    const response = NextResponse.json({ success: true, event, url: `/e/${event.slug}` }, { status: 201 })
    if (claimToken) response.cookies.set(`beasy_claim_${event.slug}`, claimToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
      path: '/api/events', maxAge: 60 * 60 * 24 * 30,
    })
    return response
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) return NextResponse.json({ error: error instanceof z.ZodError ? error.errors[0].message : 'JSON tidak sah' }, { status: 400 })
    console.error('Event creation failed')
    return NextResponse.json({ error: 'Gagal mencipta acara' }, { status: 500 })
  }
}