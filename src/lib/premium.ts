import { supabaseAdmin } from '@/lib/supabase'

// Premium gating helper — determines whether a host has an active premium plan.

export const PREMIUM_MODULES = ['wishes', 'photobooth', 'audio_guestbook', 'video_guestbook', 'angpao', 'song_request', 'live_wall'] as const

export type PremiumModule = typeof PREMIUM_MODULES[number]

export function isPremiumModule(moduleType: string): moduleType is PremiumModule {
  return (PREMIUM_MODULES as readonly string[]).includes(moduleType)
}

// A module is "premium" only if it's in the premium list. Everything else
// (rsvp, seating, menu) is free.
export function hasActivePremium(profile: { is_premium?: boolean; premium_expires_at?: string | null } | null): boolean {
  return profile?.is_premium === true &&
    (profile.premium_expires_at == null || Date.parse(profile.premium_expires_at) > Date.now())
}

// Fetch a host's premium status by host id.
export async function isPremiumHost(hostId: string | null | undefined): Promise<boolean> {
  if (!hostId) return false
  const { data: profile } = await supabaseAdmin.from('profiles')
    .select('is_premium, premium_expires_at').eq('id', hostId).maybeSingle()
  return hasActivePremium(profile)
}
