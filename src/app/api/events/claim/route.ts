import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash, timingSafeEqual } from 'crypto'
import { auth } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:9999'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * POST /api/events/claim — Klaim ownership event yang anonymous
 * 
 * ⚠️ SECURITY FIX #7 (updated): 
 * - Fail-closed: jika claim_token_hash tiada → tolak (bukan skip)
 * - Simpan SHA-256 hash dalam DB, bukan token plaintext
 * - Constant-time comparison untuk prevent timing attacks
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Sila login terlebih dahulu' },
        { status: 401 }
      )
    }

    const { eventSlug, claimToken: suppliedToken } = await req.json()
    if (typeof eventSlug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(eventSlug) || eventSlug.length > 100) {
      return NextResponse.json(
        { error: 'Event slug tidak diberikan' },
        { status: 400 }
      )
    }
    const claimToken = req.cookies.get(`beasy_claim_${eventSlug}`)?.value || suppliedToken

    // Get the anonymous event
    const { data: event, error: eventError } = await supabase
      .from('events')
      // ⚠️ SECURITY: Only select needed columns, exclude sensitive data
      .select('id, slug, is_anonymous, claim_token_hash')
      .eq('slug', eventSlug)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Acara tidak dijumpai' },
        { status: 404 }
      )
    }

    // ✅ FAIL-CLOSED: Jika tiada claim_token_hash, tolak semua permintaan
    // Ini mencegah rampasan event yang belum setup token
    if (!event.claim_token_hash) {
      console.warn(`Claim attempt on event ${event.id} without claim_token_hash set — blocked for security`)
      return NextResponse.json(
        { error: 'Acara ini belum dikonfigurasi untuk klaim. Hubungi tuan rumah.' },
        { status: 403 }
      )
    }

    // ✅ Verify claim token against stored hash using constant-time comparison
    if (typeof claimToken !== 'string' || claimToken.length > 200) {
      return NextResponse.json(
        { error: 'Token klaim diperlukan' },
        { status: 400 }
      )
    }

    const providedHash = createHash('sha256').update(claimToken).digest('hex')
    
    // Constant-time comparison to prevent timing attacks
    const storedHash = event.claim_token_hash
    const providedHashBuffer = Buffer.from(providedHash, 'hex')
    const storedHashBuffer = Buffer.from(storedHash, 'hex')
    
    if (providedHashBuffer.length !== storedHashBuffer.length) {
      return NextResponse.json(
        { error: 'Token klaim tidak sah' },
        { status: 403 }
      )
    }
    
    const timingSafeEqualResult = timingSafeEqual(providedHashBuffer, storedHashBuffer)

    if (!timingSafeEqualResult) {
      return NextResponse.json(
        { error: 'Token klaim tidak sah' },
        { status: 403 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile user tidak dijumpai' },
        { status: 404 }
      )
    }

    // Claim the event - set host_id and remove anonymous flag
    // Clear claim_token_hash after successful claim
    // ✅ Guard: only claim if still anonymous (prevents double-claim race)
    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update({
        host_id: profile.id,
        is_anonymous: false,
        claim_token_hash: null, // Remove hash after successful claim
      })
      .eq('id', event.id)
      .eq('is_anonymous', true) // Only claim if still anonymous
      .is('host_id', null)
      .eq('claim_token_hash', storedHash)
      .select()
      .single()

    if (updateError || !updatedEvent) {
      return NextResponse.json(
        { error: 'Acara tidak dapat dituntut atau telah dimiliki.' },
        { status: 409 }
      )
    }

    const response = NextResponse.json({
      success: true,
      message: 'Acara berjaya diklaim!',
      event: {
        id: updatedEvent.id,
        title: updatedEvent.title,
        slug: updatedEvent.slug,
        host_id: updatedEvent.host_id,
        is_anonymous: updatedEvent.is_anonymous,
      },
    })
    response.cookies.set(`beasy_claim_${eventSlug}`, '', { httpOnly: true, path: '/api/events', maxAge: 0 })
    return response
  } catch (error) {
    console.error('Claim event error:', error)
    return NextResponse.json(
      { error: 'Ralat server semasa klaim acara' },
      { status: 500 }
    )
  }
}
