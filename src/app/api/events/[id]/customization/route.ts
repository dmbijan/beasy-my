import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'
import { defaultCustomization } from '@/lib/gallery-customization'

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

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return Response.json({ error: 'Sila log masuk dahulu' }, { status: 401 })
    const { id } = await context.params
    if (!z.string().uuid().safeParse(id).success) return Response.json({ error: 'ID tidak sah' }, { status: 400 })

    const parsed = customizationSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) return Response.json({ error: 'Maklumat customization tidak sah' }, { status: 400 })

    const { data: existing, error: existingError } = await supabaseAdmin
      .from('events').select('theme_config').eq('id', id).eq('host_id', session.user.id).maybeSingle()
    if (existingError || !existing) return Response.json({ error: 'Acara tidak dijumpai atau bukan milik anda' }, { status: 404 })

    const themeConfig = (existing.theme_config as Record<string, unknown>) || {}
    const customization = { ...defaultCustomization, ...(themeConfig.customization as Record<string, unknown> || {}), ...parsed.data }

    const { data, error } = await supabaseAdmin.from('events')
      .update({ theme_config: { ...themeConfig, customization }, updated_at: new Date().toISOString() })
      .eq('id', id).eq('host_id', session.user.id).select('id').single()

    if (error || !data) return Response.json({ error: 'Acara tidak dapat disimpan atau bukan milik anda' }, { status: 404 })
    return Response.json({ success: true, customization })
  } catch {
    return Response.json({ error: 'Ralat server' }, { status: 500 })
  }
}
