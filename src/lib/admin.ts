import { auth } from '@/lib/auth'

// Admin authorization via email allowlist (env var).
// Set ADMIN_EMAILS="a@x.com,b@y.com" in .env.local / deploy environment.
// Access is read-only plus moderation actions (no destructive DB writes without
// going through the normal owner-scoped routes).

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
}

export async function isAdmin(): Promise<boolean> {
  const session = await auth()
  const email = session?.user?.email?.toLowerCase()
  if (!email) return false
  return adminEmails().includes(email)
}
