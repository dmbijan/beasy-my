import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const customizationSchema = z.object({
  groom: z.string().trim().max(120).optional().default(''),
  bride: z.string().trim().max(120).optional().default(''),
  monogram: z.string().trim().max(10).optional().default(''),
  hashtag: z.string().trim().max(100).optional().default(''),
  welcomeMessage: z.string().trim().max(2000).optional().default(''),
  guestLanguage: z.enum(['ms', 'en']).optional().default('ms'),
  guestLayout: z.enum(['polaroid-wall', 'memory-wall']).optional().default('polaroid-wall'),
  themeColourId: z.string().optional().default('blush'),
  guestFontId: z.string().optional().default('dancing-script'),
  keepsakeBackground: z.string().max(3_000_000).optional().default(''),
  storyTemplateIds: z.array(z.string()).optional().default([]),
})

const editSchema = z.object({
  title: z.string().trim().min(3).max(255),
  event_date: z.string().datetime({ offset: true }),
  venue_name: z.string().trim().max(255), venue_address: z.string().trim().max(2000),
  description: z.string().max(10000), is_active: z.boolean(),
  customization: customizationSchema.optional(),
}).strict()

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Sila log masuk dahulu' }, { status: 401 })
  const { id } = await context.params
  if (!z.string().uuid().safeParse(id).success) return Response.json({ error: 'ID tidak sah' }, { status: 400 })
  const { data, error } = await supabaseAdmin.from('events').select('id, slug, title, event_date, venue_name, venue_address, description, is_active, theme_config')
    .eq('id', id).eq('host_id', session.user.id).single()
  if (error || !data) return Response.json({ error: 'Acara tidak dijumpai atau bukan milik anda' }, { status: 404 })
  return Response.json({ event: data }, { headers: { 'Cache-Control': 'private, no-store' } })
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return Response.json({ error: 'Sila log masuk dahulu' }, { status: 401 })
  const { id } = await context.params
  const parsed = editSchema.safeParse(await req.json().catch(() => null))
  if (!z.string().uuid().safeParse(id).success || !parsed.success) return Response.json({ error: 'Maklumat acara tidak sah' }, { status: 400 })

  const { customization, ...rest } = parsed.data
  const updateData: Record<string, unknown> = { ...rest, updated_at: new Date().toISOString() }

  // Merge customization into theme_config (preserve existing theme/accent).
  if (customization) {
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('events').select('theme_config').eq('id', id).eq('host_id', session.user.id).maybeSingle()
    if (existingError || !existing) return Response.json({ error: 'Acara tidak dijumpai atau bukan milik anda' }, { status: 404 })
    const themeConfig = (existing.theme_config as Record<string, unknown>) || {}
    updateData.theme_config = { ...themeConfig, customization: { ...(themeConfig.customization as Record<string, unknown> || {}), ...customization } }
  }

  const { data, error } = await supabaseAdmin.from('events').update(updateData)
    .eq('id', id).eq('host_id', session.user.id).select('id').single()
  if (error || !data) return Response.json({ error: 'Acara tidak dapat disimpan atau bukan milik anda' }, { status: 404 })
  return Response.json({ success: true })
}