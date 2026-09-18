import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { listEventMedia } from '@/lib/google-drive'
import { eventIdSchema, guestError, requireEventOwner } from '@/lib/guest-api'

// List media files for an event from the host's Google Drive.
// Used by the live hall display, slideshow, and gallery views.
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Akses ditolak. Sila login sebagai tuan rumah.' }, { status: 401 })
    }
    const eventId = eventIdSchema.parse(req.nextUrl.searchParams.get('eventId'))
    await requireEventOwner(eventId, session.user.id)

    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('drive_folder_id')
      .eq('id', eventId)
      .maybeSingle()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Acara tidak dijumpai' }, { status: 404 })
    }

    if (!event.drive_folder_id) {
      return NextResponse.json({ media: [] })
    }

    const media = await listEventMedia(session.user.id, event.drive_folder_id)

    // Apply moderation: only show approved media (or media uploaded before
    // moderation tracking existed, which have no record). Rejected/pending
    // media is hidden from the live hall / gallery until the host approves it.
    let visibleMedia = media
    try {
      const { data: moderation, error: modError } = await supabaseAdmin
        .from('media_moderation')
        .select('drive_file_id, status')
        .eq('event_id', eventId)

      if (!modError) {
        const moderationMap = new Map((moderation || []).map(m => [m.drive_file_id, m.status]))
        visibleMedia = media.filter(m => {
          const status = moderationMap.get(m.id)
          return status === undefined || status === 'approved'
        })
      }
    } catch {
      // media_moderation table may not exist yet (migration not run).
      // Fall back to showing all media.
      visibleMedia = media
    }

    return NextResponse.json({ media: visibleMedia, total: media.length, visible: visibleMedia.length })
  } catch (error) {
    return guestError(error)
  }
}
