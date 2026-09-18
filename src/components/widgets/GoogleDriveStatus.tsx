"use client"

import { signIn } from "next-auth/react"
import GlassCard from "@/components/ui/GlassCard"
import { Cloud, CloudOff, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface GoogleDriveStatusProps {
  isConnected: boolean
  hostId?: string
}

export default function GoogleDriveStatus({ isConnected, hostId }: GoogleDriveStatusProps) {
  async function handleConnect() {
    if (!hostId) return
    
    await signIn("google", {
      callbackUrl: window.location.origin + "/dashboard",
      redirect: true,
    })
  }

  return (
    <GlassCard variant="light" glow={isConnected ? "emerald" : "rose"}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isConnected ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
            {isConnected ? (
              <Cloud className="w-6 h-6 text-emerald-400" />
            ) : (
              <CloudOff className="w-6 h-6 text-rose-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">Google Drive</h3>
            <p className="text-sm text-white/60">
              {isConnected 
                ? "Bersambung • Storage aktif" 
                : "Tidak bersambung"}
            </p>
          </div>
        </div>
        
        {isConnected ? (
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        ) : (
          <XCircle className="w-5 h-5 text-rose-400" />
        )}
      </div>

      {!isConnected && (
        <button
          onClick={handleConnect}
          className="w-full py-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium flex items-center justify-center gap-2 hover:bg-indigo-500/30 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sambungkan Google Drive
        </button>
      )}

      {isConnected && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Storage Digunakan</span>
            <span className="text-white font-medium">2.3 GB / 15 GB</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-[15%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          </div>
        </div>
      )}
    </GlassCard>
  )
}
