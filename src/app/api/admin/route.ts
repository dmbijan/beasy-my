import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'

// Admin API — read-only overview + moderation + user creation. Protected by
// email allowlist (ADMIN_EMAILS env var). Never returns sensitive keys/tokens.

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const section = req.nextUrl.searchParams.get('section') || 'overview'

  try {
    switch (section) {
      case 'overview': {
        const [users, events, payments, media, rsvps] = await Promise.all([
          supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
          supabaseAdmin.from('events').select('id, is_active', { count: 'exact', head: true }),
          supabaseAdmin.from('payments').select('id, status', { count: 'exact', head: true }),
          supabaseAdmin.from('media_uploads').select('id', { count: 'exact', head: true }),
          supabaseAdmin.from('rsvps').select('id', { count: 'exact', head: true }),
        ])
        const paid = await supabaseAdmin.from('payments').select('id', { count: 'exact', head: true }).eq('status', 'paid')
        const activeEvents = await supabaseAdmin.from('events').select('id', { count: 'exact', head: true }).eq('is_active', true)
        return NextResponse.json({
          users: users.count || 0,
          events: events.count || 0,
          activeEvents: activeEvents.count || 0,
          payments: payments.count || 0,
          paidPayments: paid.count || 0,
          media: media.count || 0,
          rsvps: rsvps.count || 0,
        })
      }
      case 'events': {
        const { data, error } = await supabaseAdmin.from('events')
          .select('id, slug, title, event_type, event_date, is_active, host_id, plan, created_at')
          .order('created_at', { ascending: false }).limit(200)
        if (error) throw error
        return NextResponse.json({ events: data })
      }
      case 'users': {
        const { data, error } = await supabaseAdmin.from('profiles')
          .select('id, email, full_name, avatar_url, created_at')
          .order('created_at', { ascending: false }).limit(200)
        if (error) throw error
        return NextResponse.json({ users: data })
      }
      case 'payments': {
        const { data, error } = await supabaseAdmin.from('payments')
          .select('id, host_id, amount, currency, status, toyyibpay_bill_code, created_at, updated_at')
          .order('created_at', { ascending: false }).limit(200)
        if (error) throw error
        return NextResponse.json({ payments: data })
      }
      case 'media': {
        const { data, error } = await supabaseAdmin.from('media_uploads')
          .select('id, event_id, media_type, uploader_name, is_approved, created_at')
          .order('created_at', { ascending: false }).limit(200)
        if (error) throw error
        return NextResponse.json({ media: data })
      }
      default:
        return NextResponse.json({ error: 'Section tidak sah' }, { status: 400 })
    }
  } catch (err) {
    console.error('Admin API error:', err)
    return NextResponse.json({ error: 'Gagal memuatkan data admin' }, { status: 500 })
  }
}

// POST /api/admin — create a new user (admin only).
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const body = await req.json().catch(() => null)
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const fullName = typeof body?.fullName === 'string' ? body.fullName.trim().slice(0, 255) : ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Emel tidak sah' }, { status: 400 })
    }

    const existing = await supabaseAdmin.from('profiles').select('id, email').eq('email', email).maybeSingle()
    if (existing.data) {
      return NextResponse.json({ error: 'User sudah wujud', existing: existing.data }, { status: 409 })
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })
    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || 'Gagal mencipta user' }, { status: 500 })
    }

    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: data.user.id, email, full_name: fullName, avatar_url: '',
    }, { onConflict: 'id' })
    if (profileError) {
      return NextResponse.json({ error: 'User auth dibuat tetapi profil gagal: ' + profileError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: { id: data.user.id, email, full_name: fullName } }, { status: 201 })
  } catch (err) {
    console.error('Admin create user error:', err)
    return NextResponse.json({ error: 'Gagal mencipta user' }, { status: 500 })
  }
}
