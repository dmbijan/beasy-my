import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"
import { supabaseAdmin } from "@/lib/supabase"

async function ensureProfile(id: string, email: string, name?: string | null, image?: string | null) {
  const { error } = await supabaseAdmin.from('profiles').upsert({
    id, email, full_name: name || '', avatar_url: image || '',
  }, { onConflict: 'id' })
  if (error) throw new Error('Gagal menyediakan profil pengguna')
}

// ⚠️ SECURITY FIX #8: Tokens NEVER leave the server.
// We do NOT store accessToken/refreshToken in JWT or session.
// All token operations happen server-side only via Supabase.

export const { auth, signIn, signOut, handlers } = NextAuth({
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // ✅ Only request scopes we actually use:
          // - drive.file: Access files created by this app only (minimal, less scary)
          // - spreadsheets: Export RSVP data to Google Sheets for hosts
          // - openid + email + profile: Basic user identity
          scope: "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets openid email profile",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        })

        if (error || !data.user?.email_confirmed_at || !data.user.email) {
          return null
        }

        await ensureProfile(data.user.id, data.user.email, data.user.user_metadata?.full_name)

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.sub === 'string' && /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(token.sub) ? token.sub : ''
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const googleProfile = profile as { email_verified?: boolean; email?: string } | undefined
          if (googleProfile?.email_verified !== true || !googleProfile.email || !user.email || googleProfile.email.toLowerCase() !== user.email.toLowerCase()) return false
          const email = user.email.toLowerCase()
          // Verify against auth.users, not user-editable profile fields.
          let internalUser = null
          for (let page = 1; ; page++) {
            const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 })
            if (error) throw new Error('Gagal mengesahkan identiti')
            internalUser = data.users.find(candidate => candidate.email?.toLowerCase() === email) || null
            if (internalUser || data.users.length < 1000) break
          }
          if (!internalUser) {
            const { data, error } = await supabaseAdmin.auth.admin.createUser({
              email, email_confirm: true, user_metadata: { full_name: user.name || '' },
            })
            if (error || !data.user) return false
            internalUser = data.user
          }
          if (!internalUser.email_confirmed_at) return false
          await ensureProfile(internalUser.id, email, user.name, user.image)
          user.id = internalUser.id
          if (account.access_token && account.refresh_token) {
            const { storeTokensEncrypted } = await import("@/lib/google-drive")
            await storeTokensEncrypted(internalUser.id, account.access_token, account.refresh_token,
              new Date((account.expires_at || Math.floor(Date.now() / 1000) + 3600) * 1000))
          }
          return true
        } catch (error) {
          console.error("Sign in error:", error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  // ✅ NextAuth v5: AUTH_SECRET diutamakan, fallback ke NEXTAUTH_SECRET
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
})

// Export handlers for [...nextauth] route file
// Fix #1: GET/POST come from handlers, not directly from NextAuth()
export const { GET, POST } = handlers
