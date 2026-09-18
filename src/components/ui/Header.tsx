"use client"

import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
import GlassCard from "@/components/ui/GlassCard"
import { LogOut, User, Settings, Home, LogIn } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <GlassCard variant="dark" className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-white">Beasy<span className="text-rose-400">.my</span></span>
          </Link>

          {/* Navigation & User Actions */}
          <div className="flex items-center gap-3">
            {!session?.user ? (
              // Guest - Show Sign In
              <Link href="/auth/signin">
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-500 text-white text-sm font-medium hover:from-rose-600 hover:to-indigo-600 transition-all shadow-lg"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              </Link>
            ) : (
              // Logged in - Show user info & actions
              <>
                <Link href="/dashboard">
                  <button
                    className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                    title="Dashboard"
                  >
                    <Home className="w-5 h-5" />
                  </button>
                </Link>

                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-sm text-white/80 max-w-[120px] truncate">
                    {session.user.name}
                  </span>
                </div>

                {/* ✅ SECURITY FIX #4: Use next-auth/signOut directly instead of /api/auth/signout route */}
                <button
                  onClick={() => signOut({ redirectTo: '/' })}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </GlassCard>
    </header>
  )
}
