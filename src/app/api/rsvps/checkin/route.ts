import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { eventIdSchema, qrTokenSchema, guestError, requireEventOwner, requireGuestEvent } from '@/lib/guest-api'

/**
 * POST /api/rsvps/checkin - Check-in tetamu menggunakan QR code
 * ⚠️ SECURITY: Hanya host event yang boleh check-in tetamu
 */
export async function POST(req: NextRequest) {
  try {
    // ✅ AUTH REQUIRED: Verify user is the event host
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Akses ditolak. Sila login sebagai tuan rumah.' }, { status: 401 })
    }

    const { qrCodeHash, eventId } = z.object({ eventId: eventIdSchema, qrCodeHash: qrTokenSchema }).parse(await req.json())
    await requireEventOwner(eventId, session.user.id)
    // RSVP deadline applies to registration, not arrival at the event.
    await requireGuestEvent(eventId, 'rsvp')

    // Compare-and-set in one SQL UPDATE: concurrent scans cannot overwrite the first timestamp.
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('rsvps')
      .update({
        checked_in: true,
        checked_in_at: new Date().toISOString(),
        attendance_status: 'attended',
      })
      .eq('event_id', eventId)
      .eq('qr_code_hash', qrCodeHash)
      .or('checked_in.eq.false,checked_in.is.null')
      .is('checked_in_at', null)
      .select('id, guest_name, checked_in_at')
      .maybeSingle()

    if (updateError) {
      console.error('Check-in update error:', updateError)
      return NextResponse.json({ error: 'Gagal mengemaskini status check-in' }, { status: 500 })
    }

    let rsvp = updated
    if (!rsvp) {
      const { data, error } = await supabaseAdmin.from('rsvps')
        .select('id, guest_name, checked_in_at, checked_in')
        .eq('event_id', eventId).eq('qr_code_hash', qrCodeHash).maybeSingle()
      if (error) return NextResponse.json({ error: 'Gagal menyemak check-in' }, { status: 500 })
      if (!data) return NextResponse.json({ error: 'QR code tidak sah atau tidak ditemui' }, { status: 404 })
      if (!data.checked_in && !data.checked_in_at) return NextResponse.json({ error: 'Sila cuba check-in sekali lagi' }, { status: 409 })
      rsvp = data
    }

    return NextResponse.json({
      success: true,
      alreadyCheckedIn: !updated,
      message: updated ? `Check-in berjaya untuk ${rsvp.guest_name}` : `${rsvp.guest_name} sudah check-in`,
      guestName: rsvp.guest_name,
      checkedInAt: rsvp.checked_in_at,
    })
  } catch (error) {
    return guestError(error)
  }
}

/**
 * GET /api/rsvps/checkin?eventId=<id> - Ambil senarai yang sudah check-in
 */
export async function GET(req: NextRequest) {
  try {
    // ✅ AUTH REQUIRED
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Akses ditolak. Sila login.' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const eventId = eventIdSchema.parse(searchParams.get('eventId'))
    const event = await requireEventOwner(eventId, session.user.id)

    // Get checked-in guests
    const { data: checkedInGuests, error, count } = await supabaseAdmin
      .from('rsvps')
      .select('id, guest_name, pax, checked_in_at, attendance_status', { count: 'exact' })
      .eq('event_id', eventId)
      .eq('checked_in', true)
      .order('checked_in_at', { ascending: false })
      .limit(100)

    if (error) return NextResponse.json({ error: 'Gagal membaca check-in' }, { status: 500 })

    return NextResponse.json({
      success: true,
      event: { id: event.id, title: event.title },
      guests: checkedInGuests || [],
      totalCheckedIn: count || 0,
    })
  } catch (error) {
    return guestError(error)
  }
}
