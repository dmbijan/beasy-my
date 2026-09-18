"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import GlassCard from "@/components/ui/GlassCard"
import { 
  Settings, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  LogOut,
  Eye,
  EyeOff,
  CheckCircle,
  Camera,
  Trash2,
  Save,
  User,
  Loader2
} from "lucide-react"

export default function AccountSettingsPage() {
  const { data: session, status } = useSession()
  
  const [user, setUser] = useState<{
    id: string
    email: string
    full_name: string
    avatar_url: string | null
    created_at?: string
  }>({
    id: "",
    email: "",
    full_name: "",
    avatar_url: null,
    created_at: "",
  })
  const [saving, setSaving] = useState(false)
  const [profileUpdated, setProfileUpdated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    checkin_alerts: true,
    weekly_report: false
  })

  // Load user data from NextAuth session on mount
  useEffect(() => {
    async function loadUser() {
      try {
        if (status === "loading") return
        
        if (session?.user) {
          const response = await fetch('/api/dashboard', { cache: 'no-store' })
          const data = await response.json()
          if (!response.ok) throw new Error(data.error)
          setUser(data.profile)
        }
      } catch {
        alert('Gagal memuatkan profil. Sila log masuk semula.')
      } finally {
        setLoading(false)
      }
    }
    
    loadUser()
  }, [session, status])

  async function handleUpdateProfile() {
    if (!user?.full_name) {
      alert("Sila masukkan nama penuh!")
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/dashboard', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ full_name: user.full_name }),
      })
      if (!response.ok) throw new Error('Gagal menyimpan profil')
      setProfileUpdated(true)
      setTimeout(() => setProfileUpdated(false), 3000)
    } catch (err) {
      console.error("Error updating profile:", err)
      alert("Gagal menyimpan perubahan")
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword() {
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("Kata laluan baru tidak sepadan!")
      return
    }

    if (passwordData.new_password.length < 8) {
      alert("Kata laluan mesti sekurang-kurangnya 8 aksara!")
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(passwordData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Gagal menukar kata laluan')
      alert("Kata laluan berjaya ditukar!")
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" })
      setShowPasswordForm(false)
    } catch (err) {
      console.error("Error changing password:", err)
      alert(err instanceof Error ? err.message : "Gagal menukar kata laluan")
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    if (confirm("Adakah anda pasti mahu log keluar?")) {
      localStorage.removeItem("beasy_session")
      // Clear NextAuth session via API
      await fetch("/api/auth/signout", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callbackUrl: "/auth/signin" })
      })
      // Hard redirect to signin page
      window.location.href = "/auth/signin"
    }
  }

  async function handleDeleteAccount() {
    if (confirm("AMARAN: Tindakan ini TIDAK BOLEH DIUBAH. Semua data acara dan akaun akan dipadam secara kekal. Teruskan?")) {
      if (confirm("Sila sahkan sekali lagi - ketik OK untuk padam semua data")) {
        alert("Fitur ini akan tersedia dalam versi seterusnya")
      }
    }
  }

  return (
    <div className="min-h-screen mesh-gradient pb-8">
      <div className="px-4 pt-8 pb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors">
          ← Kembali ke Dashboard
        </Link>
        
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30">
            <Settings className="w-7 h-7 text-indigo-400" />
          </div>
          Tetapan Akaun
        </h1>
      </div>

      {loading ? (
        <div className="px-4 py-12 text-center text-white/60">Memuatkan tetapan...</div>
      ) : (
      <div className="px-4 space-y-6 max-w-4xl">
        <GlassCard variant="light" glow="indigo">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                {user.full_name?.charAt(0).toUpperCase() || "U"}
              </div>
              <button className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">
                {user.full_name || "User"}
              </h2>
              <p className="text-sm text-white/60">
                Host • {user.created_at ? new Date(user.created_at).toLocaleDateString("ms-MY", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }) : "Baru menyertai"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Nama Penuh</label>
              <input
                type="text"
                value={user.full_name || ""}
                onChange={(e) => setUser({ ...user, full_name: e.target.value })}
                placeholder="Masukkan nama penuh"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                <Mail className="w-5 h-5 text-white/40" />
                <span className="text-white/80">{user.email}</span>
              </div>
              <p className="text-xs text-white/40 mt-2">Email tidak boleh diubah</p>
            </div>

            <button
              onClick={handleUpdateProfile}
              disabled={saving}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Menyimpan...
                </>
              ) : profileUpdated ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Berjaya Disimpan!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </GlassCard>

        <GlassCard variant="light" glow="emerald">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Kata Laluan</h2>
              <p className="text-sm text-white/60">Lindungi akaun anda</p>
            </div>
          </div>

          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="w-full py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium hover:bg-emerald-500/30 transition-all"
            >
              Tukar Kata Laluan
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Kata Laluan Semasa</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    placeholder="Masukkan kata laluan semasa"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Kata Laluan Baru</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    placeholder="Masukkan kata laluan baru"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Sahkan Kata Laluan Baru</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                    placeholder="Sahkan kata laluan baru"
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium hover:bg-emerald-500/30 transition-all disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Tukar Kata Laluan"}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false)
                    setPasswordData({ current_password: "", new_password: "", confirm_password: "" })
                  }}
                  className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white/60 hover:bg-white/20 transition-all"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard variant="light" glow="amber">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30">
              <Bell className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Pemberitahuan</h2>
              <p className="text-sm text-white/60">Urus notifikasi anda</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-medium text-white">Notifikasi Email</p>
                <p className="text-sm text-white/60">Terima kemas kini melalui email</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, email_notifications: !notifications.email_notifications })}
                className={`w-12 h-6 rounded-full relative transition-all ${notifications.email_notifications ? "bg-emerald-500" : "bg-white/20"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${notifications.email_notifications ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-medium text-white">Amaran Check-in</p>
                <p className="text-sm text-white/60">Diberitahu apabila tetamu check-in</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, checkin_alerts: !notifications.checkin_alerts })}
                className={`w-12 h-6 rounded-full relative transition-all ${notifications.checkin_alerts ? "bg-emerald-500" : "bg-white/20"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${notifications.checkin_alerts ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <p className="font-medium text-white">Laporan Mingguan</p>
                <p className="text-sm text-white/60">Ringkasan aktiviti setiap minggu</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, weekly_report: !notifications.weekly_report })}
                className={`w-12 h-6 rounded-full relative transition-all ${notifications.weekly_report ? "bg-emerald-500" : "bg-white/20"}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${notifications.weekly_report ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="light" glow="rose">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/30">
              <Shield className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Keselamatan</h2>
              <p className="text-sm text-white/60">Lindungi akaun anda</p>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 font-medium flex items-center justify-center gap-2 hover:bg-rose-500/30 transition-all">
              <span>🔐</span>
              <span>Aktifkan 2FA</span>
              <span>→</span>
            </button>
            <button className="w-full py-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 font-medium flex items-center justify-center gap-2 hover:bg-rose-500/30 transition-all">
              <span>📋</span>
              <span>Log Aktiviti</span>
              <span>→</span>
            </button>
          </div>
        </GlassCard>

        <GlassCard variant="light" glow="rose">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Zona Bahaya</h2>
              <p className="text-sm text-white/60">Tindakan tidak boleh dibatalkan</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Log Keluar
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 font-medium flex items-center justify-center gap-2 hover:bg-red-500/30 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              Padam Akaun Secara Kekal
            </button>
          </div>
        </GlassCard>
      </div>
      )}
    </div>
  )
}
