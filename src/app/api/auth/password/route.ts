import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) return Response.json({ error: 'Sila log masuk dahulu' }, { status: 401 })
  const parsed = z.object({ current_password: z.string().min(1).max(1024), new_password: z.string().min(8).max(128) }).safeParse(await req.json().catch(() => null))
  if (!parsed.success) return Response.json({ error: 'Kata laluan baharu mesti sekurang-kurangnya 8 aksara.' }, { status: 400 })
  const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data, error } = await client.auth.signInWithPassword({ email: session.user.email, password: parsed.data.current_password })
  if (error || data.user?.id !== session.user.id) return Response.json({ error: 'Kata laluan semasa salah atau akaun menggunakan Google.' }, { status: 403 })
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(session.user.id, { password: parsed.data.new_password })
  await client.auth.signOut()
  if (updateError) return Response.json({ error: 'Gagal menukar kata laluan' }, { status: 500 })
  return Response.json({ success: true })
}