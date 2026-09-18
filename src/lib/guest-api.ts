import { z } from 'zod'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const eventIdSchema = z.string().uuid('Event ID mesti UUID yang sah')
export const guestNameSchema = z.string().trim().min(2).max(255)
export const qrTokenSchema = z.string().trim().min(10).max(200).regex(/^[A-Za-z0-9_-]+$/)
export const rsvpSchema = z.object({
  eventId: eventIdSchema,
  guestName: guestNameSchema,
  phoneNumber: z.string().trim().min(8).max(30).regex(/^\+?[0-9 ()-]+$/),
  pax: z.number().int().min(1).max(10),
  privacyConsent: z.literal(true),
})

export class GuestAPIError extends Error {
  constructor(public status: number, message: string) { super(message) }
}

export function guestError(error: unknown) {
  if (error instanceof GuestAPIError) return NextResponse.json({ error: error.message }, { status: error.status })
  if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
  if (error instanceof SyntaxError) return NextResponse.json({ error: 'JSON tidak sah' }, { status: 400 })
  console.error('Guest API operation failed')
  return NextResponse.json({ error: 'Ralat server' }, { status: 500 })
}

export async function requireGuestEvent(eventId: string, moduleType: string, enforceDeadline = false) {
  eventIdSchema.parse(eventId)
  const { data: event, error } = await supabaseAdmin.from('events')
    .select('id, host_id, title, slug, is_active, rsvp_deadline, sheet_id, drive_folder_id')
    .eq('id', eventId).maybeSingle()
  if (error) throw new GuestAPIError(500, 'Gagal menyemak acara')
  if (!event || event.is_active !== true) throw new GuestAPIError(404, 'Acara tidak tersedia')
  const { data: modules, error: moduleError } = await supabaseAdmin.from('event_modules')
    .select('is_enabled').eq('event_id', eventId).eq('module_type', moduleType)
  if (moduleError) throw new GuestAPIError(500, 'Gagal menyemak modul')
  if (!modules?.some(module => module.is_enabled === true)) throw new GuestAPIError(403, 'Modul ini tidak diaktifkan')
  if (enforceDeadline && event.rsvp_deadline) {
    const deadline = Date.parse(event.rsvp_deadline)
    if (!Number.isFinite(deadline) || Date.now() >= deadline) throw new GuestAPIError(403, 'Tarikh akhir RSVP telah tamat')
  }
  return event
}

export async function requireEventOwner(eventId: string, userId: string) {
  eventIdSchema.parse(eventId)
  const { data: event, error } = await supabaseAdmin.from('events')
    .select('id, host_id, title').eq('id', eventId).maybeSingle()
  if (error) throw new GuestAPIError(500, 'Gagal menyemak acara')
  if (!event) throw new GuestAPIError(404, 'Acara tidak dijumpai')
  if (event.host_id !== userId) throw new GuestAPIError(403, 'Akses ditolak: anda bukan tuan rumah acara ini')
  return event
}