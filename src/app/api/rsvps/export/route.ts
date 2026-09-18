import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'
import { getRSVPsForExport, exportRSVPsToGoogleSheet } from '@/lib/google-drive'
import { eventIdSchema, guestError, requireEventOwner } from '@/lib/guest-api'

/**
 * POST /api/rsvps/export
 * Export semua RSVP data ke Google Sheets
 * ⚠️ SECURITY: Hanya host event yang boleh export
 */
export async function POST(req: NextRequest) {
  try {
    // ✅ AUTH REQUIRED: Verify user is the event host
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Akses ditolak. Sila login sebagai tuan rumah.' }, { status: 401 })
    }

    const body = await req.json()
    const eventId = eventIdSchema.parse(body?.eventId)

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID diperlukan' }, { status: 400 })
    }

    // Get event details to verify ownership
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('id, host_id, title')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event tidak dijumpai' }, { status: 404 })
    }

    // Verify this user owns the event
    if (event.host_id !== session.user.id) {
      return NextResponse.json({ error: 'Akses ditolak: anda bukan tuan rumah event ini' }, { status: 403 })
    }

    // Get all RSVPs for this event
    const rsvps = await getRSVPsForExport(eventId)

    if (rsvps.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Tiada RSVP untuk di-export',
        spreadsheetId: null,
      })
    }

    // Export to Google Sheets
    const result = await exportRSVPsToGoogleSheet(
      session.user.id,
      eventId,
      event.title,
      rsvps
    )

    return NextResponse.json({
      success: true,
      message: `Berjaya export ${rsvps.length} RSVP ke Google Sheets`,
      spreadsheetId: result.spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${result.spreadsheetId}`,
      totalRSVPs: rsvps.length,
    })
  } catch (error) {
    return guestError(error)
  }
}

/**
 * GET /api/rsvps/export?eventId=<id> - Check export status
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const eventId = eventIdSchema.parse(searchParams.get('eventId'))
    await requireEventOwner(eventId, session.user.id)

    // Count RSVPs
    const { count, error } = await supabaseAdmin
      .from('rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)

    if (error) return NextResponse.json({ error: 'Gagal membaca status eksport' }, { status: 500 })

    return NextResponse.json({
      success: true,
      totalRSVPs: count || 0,
    })
  } catch (error) {
    return guestError(error)
  }
}
