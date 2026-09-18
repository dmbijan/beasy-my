import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { appendToGoogleSheet, createRSVPSpreadsheet } from '@/lib/google-drive'
import { randomBytes } from 'node:crypto'
import { eventIdSchema, guestError, qrTokenSchema, requireGuestEvent, rsvpSchema } from '@/lib/guest-api'
import { auth } from '@/lib/auth'

// ⚠️ SECURITY FIX #9: Rate limiting for public endpoints
const RATE_LIMIT_WINDOW = new Map<string, { count: number; reset: number }>()
const MAX_REQUESTS_PER_MINUTE = 20

function checkRateLimit(ip: string, endpoint: string): boolean {
  const key = `${ip}-${endpoint}`
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  
  const record = RATE_LIMIT_WINDOW.get(key)
  
  if (!record || now > record.reset) {
    RATE_LIMIT_WINDOW.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  
  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return false
  }
  
  record.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    // ⚠️ SECURITY FIX #9: Check rate limit before processing
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (!checkRateLimit(ip, '/api/rsvps')) {
      return NextResponse.json({ error: 'Terlalu banyak permintaan. Tunggu sebentar.' }, { status: 429 })
    }

    const body = await req.json()
    const validatedData = rsvpSchema.parse(body)

    const event = await requireGuestEvent(validatedData.eventId, 'rsvp', true)
    const qrToken = randomBytes(32).toString('base64url')

    // Insert to Supabase
    const { data: rsvp, error: rsvpError } = await supabaseAdmin
      .from('rsvps')
      .insert({
        event_id: validatedData.eventId,
        guest_name: validatedData.guestName,
        phone_number: validatedData.phoneNumber,
        pax: validatedData.pax,
        attendance_status: 'pending',
        qr_code_hash: qrToken,
        checked_in: false,
        privacy_consent: true, // ✅ Track PDPA consent
        consent_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (rsvpError) {
      console.error('Supabase RSVP Error:', rsvpError)
      return NextResponse.json({ error: 'Gagal menyimpan RSVP' }, { status: 500 })
    }

    // Sync to Google Sheets if connected
    if (event.host_id && event.sheet_id) {
      try {
        await appendToGoogleSheet(
          event.host_id,
          event.sheet_id,
          'RSVP!A:H',
          [[
            new Date().toISOString(),
            validatedData.guestName,
            validatedData.phoneNumber,
            validatedData.pax.toString(),
            'pending',
            qrToken,
            'false',
            '',
          ]]
        )
      } catch (sheetError) {
        console.error('Google Sheets Sync Error:', sheetError)
        // Don't fail the request if Sheets sync fails
      }
    } else if (event.host_id && event.drive_folder_id) {
      // Create spreadsheet if not exists
      try {
        const sheetId = await createRSVPSpreadsheet(event.host_id, event.title)
        
        await supabaseAdmin
          .from('events')
          .update({ sheet_id: sheetId })
          .eq('id', event.id)

        // Append to newly created sheet
        await appendToGoogleSheet(
          event.host_id,
          sheetId,
          'RSVP!A:H',
          [[
            new Date().toISOString(),
            validatedData.guestName,
            validatedData.phoneNumber,
            validatedData.pax.toString(),
            'pending',
            qrToken,
            'false',
            '',
          ]]
        )
      } catch (createSheetError) {
        console.error('Create Spreadsheet Error:', createSheetError)
      }
    }

    return NextResponse.json({
      success: true,
      rsvpId: rsvp?.id,
      qrToken,
      message: 'RSVP berjaya disimpan',
    })
  } catch (error) {
    return guestError(error)
  }
}

/**
 * GET /api/rsvps — Ambil senarai RSVP untuk event
 * ⚠️ SECURITY FIX: Hanya host event yang boleh akses (auth required)
 * PDPA 2010 compliance: guest_name + phone_number adalah data peribadi
 */
export async function GET(req: NextRequest) {
  try {
    // ✅ AUTH REQUIRED: Verify user is the event host
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Akses ditolak. Sila login sebagai tuan rumah.' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')
    const qrHash = searchParams.get('qrHash')

    eventIdSchema.parse(eventId)
    if (qrHash !== null) qrTokenSchema.parse(qrHash)

    // ✅ Verify this user owns the event
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('host_id')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event tidak dijumpai' }, { status: 404 })
    }

    if (event.host_id !== session.user.id) {
      return NextResponse.json({ error: 'Akses ditolak: anda bukan tuan rumah event ini' }, { status: 403 })
    }

    // Host verified — fetch RSVPs
    let query = supabaseAdmin
      .from('rsvps')
      .select('id, guest_name, phone_number, pax, attendance_status, qr_code_hash, checked_in, checked_in_at, created_at')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (qrHash) {
      query = query.eq('qr_code_hash', qrHash)
    }

    const { data: rsvps, error } = await query

    if (error) {
      return NextResponse.json({ error: 'Gagal membaca RSVP' }, { status: 500 })
    }

    return NextResponse.json({ rsvps })
  } catch (error) {
    return guestError(error)
  }
}
