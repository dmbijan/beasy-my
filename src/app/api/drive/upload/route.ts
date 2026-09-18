import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { uploadFileToDrive, hasActiveDrivePremium } from '@/lib/google-drive'
import { z } from 'zod'

const uploadSchema = z.object({
  eventSlug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  uploaderName: z.string().trim().min(1).max(100).optional().default('Tetamu'),
})

// In-memory per-IP rate limit (single-instance). Supabase rate-limit tables
// from migrations 003/004 are not used because their schemas conflict.
const UPLOAD_WINDOW = new Map<string, { count: number; reset: number }>()
const UPLOAD_MAX_PER_MINUTE = 20
function checkUploadRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = UPLOAD_WINDOW.get(ip)
  if (!record || now > record.reset) { UPLOAD_WINDOW.set(ip, { count: 1, reset: now + 60000 }); return true }
  if (record.count >= UPLOAD_MAX_PER_MINUTE) return false
  record.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers?.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers?.get('x-real-ip') || 'unknown'
    if (!checkUploadRateLimit(ip)) {
      return NextResponse.json({ error: 'Terlalu banyak muat naik. Sila tunggu sebentar.' }, { status: 429 })
    }
    const formData = await req.formData().catch(() => null)
    const file = formData?.get('file')
    const parsed = uploadSchema.safeParse({
      eventSlug: formData?.get('eventSlug'),
      uploaderName: formData?.get('uploaderName') ?? undefined,
    })

    if (!(file instanceof File) || !parsed.success || file.size === 0) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }
    const { eventSlug, uploaderName } = parsed.data
    const mimeType = file.type.split(';')[0].trim().toLowerCase()

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg', 'audio/mp4', 'video/mp4', 'video/quicktime', 'video/webm']
    const maxSize = (mimeType.startsWith('image/') ? 10 : mimeType.startsWith('video/') ? 250 : 50) * 1024 * 1024

    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json({ error: 'Jenis fail tidak disokong' }, { status: 400 })
    }

    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Saiz fail melebihi had (foto 10MB, video 250MB, audio 50MB)' }, { status: 400 })
    }

    // Get event details
    const { data: eventData, error: eventError } = await supabaseAdmin
      .from('events')
      .select('id, drive_folder_id, host_id, is_active')
      .eq('slug', eventSlug)
      .single()

    if (eventError || !eventData) {
      return NextResponse.json({ error: 'Event tidak dijumpai' }, { status: 404 })
    }

    if (eventData.is_active !== true || !eventData.host_id) {
      return NextResponse.json({ error: 'Acara tidak menerima muat naik' }, { status: 403 })
    }

    const mediaType = mimeType.startsWith('image/') ? 'photo' : mimeType.startsWith('audio/') ? 'audio' : 'video'
    const moduleType = mediaType === 'photo' ? 'photobooth' : `${mediaType}_guestbook`
    const { data: module, error: moduleError } = await supabaseAdmin
      .from('event_modules')
      .select('is_enabled')
      .eq('event_id', eventData.id)
      .eq('module_type', moduleType)
      .maybeSingle()
    if (moduleError) throw new Error('Failed to check upload module')
    if (module?.is_enabled !== true) {
      return NextResponse.json({ error: 'Modul muat naik tidak aktif' }, { status: 403 })
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_premium, premium_expires_at')
      .eq('id', eventData.host_id)
      .maybeSingle()
    if (profileError) throw new Error('Failed to check host premium')
    if (!hasActiveDrivePremium(profile)) {
      return NextResponse.json({ error: 'Hos memerlukan pelan Premium aktif' }, { status: 403 })
    }

    if (!eventData.drive_folder_id) {
      return NextResponse.json({ error: 'Folder Drive belum dikonfigurasi' }, { status: 400 })
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Google Drive
    const uploadResult = await uploadFileToDrive(
      eventData.host_id,
      eventData.drive_folder_id,
      {
        name: `${Date.now()}_${file.name}`,
        mimeType,
        buffer,
      },
      false
    )

    // Track upload in media_moderation so hosts can review/approve.
    // Default status is 'pending': uploads require host approval before they
    // appear in the live hall / gallery (moderation workflow, like MomenSpace).
    const { error: moderationError } = await supabaseAdmin
      .from('media_moderation')
      .insert({
        event_id: eventData.id,
        drive_file_id: uploadResult.fileId,
        file_name: file.name,
        mime_type: mimeType,
        status: 'pending',
        uploader_name: uploaderName,
      })
    if (moderationError) {
      // Non-fatal: media is still stored on Drive even if moderation tracking fails.
      console.error('Moderation tracking failed', moderationError)
    }

    // Media files live on the host's Google Drive; no Supabase metadata table.
    return NextResponse.json({
      success: true,
      fileId: uploadResult.fileId,
      link: uploadResult.webViewLink,
      message: 'Fail berjaya dimuat naik',
    })
  } catch {
    console.error('Drive upload failed')
    return NextResponse.json({ error: 'Ralat semasa muat naik' }, { status: 500 })
  }
}
