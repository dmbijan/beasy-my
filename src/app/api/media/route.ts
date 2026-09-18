import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { eventIdSchema, guestError, requireEventOwner } from '@/lib/guest-api'

// Media files live on the host's Google Drive (no Supabase metadata table).
// This endpoint only confirms ownership and returns an empty list; gallery
// rendering is handled client-side from the Drive web-view links.
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Akses ditolak. Sila login sebagai tuan rumah.' }, { status: 401 })
    }
    const eventId = eventIdSchema.parse(req.nextUrl.searchParams.get('eventId'))
    await requireEventOwner(eventId, session.user.id)
    return NextResponse.json({ media: [] })
  } catch (error) {
    return guestError(error)
  }
}
