import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json({ error: "Email dan password diperlukan" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error || !data.user?.email_confirmed_at) {
      return Response.json({ error: 'Log masuk gagal. Semak kelayakan dan pengesahan e-mel.' }, { status: 401 })
    }

    if (!data?.user) {
      console.error('No user data returned')
      return Response.json({ error: "Gagal log masuk" }, { status: 500 })
    }

    return Response.json({ 
      success: true,
      user: data.user 
    }, { status: 200 })

  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ error: "Ralat pelayan dalaman" }, { status: 500 })
  }
}
