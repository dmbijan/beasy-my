import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { hasActiveDrivePremium, createEventFolderStructure } from '@/lib/google-drive'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    // Get session
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Sila login terlebih dahulu', requiresAuth: true },
        { status: 401 }
      )
    }

    const body = await req.json().catch(() => null)
    const parsed = z.object({ eventId: z.string().uuid() }).safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Event ID diperlukan' },
        { status: 400 }
      )
    }
    const { eventId } = parsed.data

    // Check if event exists and user is owner
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('id, title, host_id, drive_folder_id, is_active')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: 'Acara tidak dijumpai' },
        { status: 404 }
      )
    }

    // Check if user owns this event
    if (event.host_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Anda tidak mempunyai akses kepada acara ini' },
        { status: 403 }
      )
    }

    if (event.is_active !== true) {
      return NextResponse.json({ error: 'Acara tidak aktif' }, { status: 403 })
    }

    // Check if user is premium
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_premium, premium_expires_at')
      .eq('id', session.user.id)
      .single()

    if (profileError) throw new Error('Failed to check premium access')
    if (!hasActiveDrivePremium(profile)) {
      return NextResponse.json({
        hasDrive: false,
        isPremium: false,
        requiresPayment: true,
        message: 'Google Drive memerlukan pelan Premium',
        price: 159,
      })
    }

    const { data: tokens, error: tokenError } = await supabaseAdmin
      .from('google_tokens')
      .select('host_id')
      .eq('host_id', session.user.id)
      .limit(1)
    if (tokenError) throw new Error('Failed to check Google connection')

    if (tokens?.length && !event.drive_folder_id) {
      const folder = await createEventFolderStructure(session.user.id, event.title)
      const { error: folderError } = await supabaseAdmin.from('events')
        .update({ drive_folder_id: folder.eventFolderId }).eq('id', event.id).eq('host_id', session.user.id)
        .is('drive_folder_id', null)
      if (folderError) throw new Error('Failed to save Drive folder')
      event.drive_folder_id = folder.eventFolderId
    }

    return NextResponse.json({
      hasDrive: Boolean(event.drive_folder_id && tokens?.length),
      isPremium: true,
      requiresPayment: false,
      message: 'Anda boleh menyambungkan Google Drive',
    })
  } catch (error) {
    console.error('Check Google Drive access error:', error)
    return NextResponse.json(
      { error: 'Gagal memeriksa akses Google Drive' },
      { status: 500 }
    )
  }
}
