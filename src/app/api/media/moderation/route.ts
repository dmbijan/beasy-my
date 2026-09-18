import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'
import { eventIdSchema, guestError, requireEventOwner } from '@/lib/guest-api'

// List media moderation records for an event (host only).
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Akses ditolak. Sila login sebagai tuan rumah.' }, { status: 401 })
    }
    const eventId = eventIdSchema.parse(req.nextUrl.searchParams.get('eventId'))
    await requireEventOwner(eventId, session.user.id)

    const status = req.nextUrl.searchParams.get('status')
    let query = supabaseAdmin
      .from('media_moderation')
      .select('id, drive_file_id, file_name, mime_type, status, uploader_name, created_at')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })
      .limit(500)

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query = query.eq('status', status)
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: 'Gagal membaca media' }, { status: 500 })
    return NextResponse.json({ media: data || [] })
  } catch (error) {
    return guestError(error)
  }
}

// Approve or reject a media item (host only).
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Akses ditolak. Sila login sebagai tuan rumah.' }, { status: 401 })
    }
    const body = await req.json()
    const { eventId, mediaId, status } = z.object({
      eventId: eventIdSchema,
      mediaId: z.string().uuid(),
      status: z.enum(['approved', 'rejected']),
    }).parse(body)

    // Verify ownership of the event before updating.
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('id')
      .eq('id', eventId)
      .eq('host_id', session.user.id)
      .maybeSingle()
    if (eventError || !event) return NextResponse.json({ error: 'Acara tidak dijumpai atau bukan milik anda' }, { status: 404 })

    const { data, error } = await supabaseAdmin
      .from('media_moderation')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', mediaId)
      .eq('event_id', eventId)
      .select('id, status')
      .single()

    if (error || !data) return NextResponse.json({ error: 'Gagal mengemaskini media' }, { status: 404 })
    return NextResponse.json({ success: true, media: data })
  } catch (error) {
    return guestError(error)
  }
}
