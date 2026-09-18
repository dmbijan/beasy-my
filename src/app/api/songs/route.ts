import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth } from '@/lib/auth'
import { z } from 'zod'
import { eventIdSchema, guestNameSchema, guestError, requireGuestEvent } from '@/lib/guest-api'

const RATE_WINDOW = new Map<string, { count: number; reset: number }>()
const MAX_PER_MINUTE = 30
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = RATE_WINDOW.get(ip)
  if (!record || now > record.reset) { RATE_WINDOW.set(ip, { count: 1, reset: now + 60000 }); return true }
  if (record.count >= MAX_PER_MINUTE) return false
  record.count++
  return true
}

export async function GET(req: Request) {
  try {
    // ✅ AUTH REQUIRED: Hanya host event boleh akses senarai lagu
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Akses ditolak. Sila login sebagai tuan rumah.' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const eventId = eventIdSchema.parse(searchParams.get('eventId'))

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID diperlukan' }, { status: 400 })
    }

    // ✅ Verify user owns this event
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

    const { data: songRequests, error } = await supabaseAdmin
      .from('song_requests')
      .select('id, guest_name, song_title, artist, message, created_at')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: 'Gagal membaca permintaan lagu' }, { status: 500 })
    }

    return NextResponse.json({ songRequests })
  } catch (error) {
    return guestError(error)
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Terlalu banyak permintaan. Tunggu sebentar.' }, { status: 429 })
    }
    const body = await req.json()
    
    const { eventId, guestName, songTitle, artist, message } = z.object({
      eventId: eventIdSchema,
      guestName: guestNameSchema,
      songTitle: z.string().trim().min(1).max(255),
      artist: z.string().trim().max(255).optional(),
      message: z.string().trim().max(2000).optional(),
    }).parse(body)
    await requireGuestEvent(eventId, 'song_request')

    const { data: songRequest, error } = await supabaseAdmin
      .from('song_requests')
      .insert({
        event_id: eventId,
        guest_name: guestName,
        song_title: songTitle,
        artist: artist || '',
        message: message || '',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Gagal menyimpan permintaan lagu' }, { status: 500 })
    }

    return NextResponse.json({ success: true, songRequest })
  } catch (error) {
    return guestError(error)
  }
}
