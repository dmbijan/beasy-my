import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'
import { eventIdSchema, guestNameSchema, guestError, requireGuestEvent } from '@/lib/guest-api'

// ⚠️ SECURITY FIX #9: Rate limiting for public endpoints
const RATE_LIMIT_WINDOW = new Map<string, { count: number; reset: number }>()
const MAX_REQUESTS_PER_MINUTE = 30

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = eventIdSchema.parse(searchParams.get('eventId'))
    const guestName = z.string().trim().max(255).nullable().parse(searchParams.get('guestName'))
    await requireGuestEvent(eventId, 'wishes')

    let query = supabaseAdmin
      .from('guest_wishes')
      .select('id, guest_name, message, created_at')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (guestName) {
      query = query.eq('guest_name', guestName)
    }

    const { data: wishes, error } = await query

    if (error) {
      return NextResponse.json({ error: 'Gagal membaca ucapan' }, { status: 500 })
    }

    return NextResponse.json({ wishes })
  } catch (error) {
    return guestError(error)
  }
}

export async function POST(req: Request) {
  try {
    // ⚠️ SECURITY FIX #9: Check rate limit before processing
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip, '/api/wishes')) {
      return NextResponse.json({ error: 'Terlalu banyak permintaan. Tunggu sebentar.' }, { status: 429 })
    }

    const body = await req.json()
    
    const { eventId, guestName, message } = z.object({
      eventId: eventIdSchema, guestName: guestNameSchema, message: z.string().trim().min(1).max(2000),
    }).parse(body)
    await requireGuestEvent(eventId, 'wishes')

    const { data: wish, error } = await supabaseAdmin
      .from('guest_wishes')
      .insert({
        event_id: eventId,
        guest_name: guestName,
        message,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Gagal menyimpan ucapan' }, { status: 500 })
    }

    return NextResponse.json({ success: true, wish })
  } catch (error) {
    return guestError(error)
  }
}
