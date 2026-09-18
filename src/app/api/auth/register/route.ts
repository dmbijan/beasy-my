import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const { email, password, full_name } = await req.json()

    if (!email || !password) {
      return Response.json({ error: "Email dan password diperlukan" }, { status: 400 })
    }

    if (password.length < 6) {
      return Response.json({ error: "Password mestilah sekurang-kurangnya 6 aksara" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || email.split("@")[0],
        },
      },
    })

    if (error) {
      console.error("Sign up error:", error)
      return Response.json({ error: error.message }, { status: 400 })
    }

    if (!data.user) {
      return Response.json({ error: "Gagal mendaftar" }, { status: 500 })
    }

    // Create profile in profiles table
    if (data.user.id) {
      const adminSupabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      await adminSupabase.from("profiles").insert({
        id: data.user.id,
        email: email,
        full_name: full_name || email.split("@")[0],
        avatar_url: "",
      })

    }

    return Response.json({ 
      success: true,
      requiresEmailConfirmation: !data.session,
      message: 'Semak e-mel anda untuk melengkapkan pendaftaran.'
    }, { status: 200 })

  } catch (error) {
    console.error("Registration error:", error)
    return Response.json({ error: "Ralat pelayan dalaman" }, { status: 500 })
  }
}
