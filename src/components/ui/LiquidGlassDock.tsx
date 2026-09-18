"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Home, 
  MapPin, 
  Calendar, 
  Camera, 
  Mic, 
  Heart, 
  Send, 
  Plus,
  QrCode,
  Users,
  Video
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DockItem {
  icon: React.ReactNode
  label: string
  onClick?: () => void
  href?: string
  active?: boolean
}

export type FABAction = "photo" | "audio" | "video" | "wishes" | "qr"

interface LiquidGlassDockProps {
  items: DockItem[]
  onFABAction?: (action: FABAction) => void
  fabIcon?: React.ReactNode
  className?: string
}

export default function LiquidGlassDock({
  items,
  onFABAction,
  fabIcon,
  className,
}: LiquidGlassDockProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <>
      {/* Expanded FAB Menu - Centered on screen */}
      <AnimatePresence>
        {expanded && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setExpanded(false)}
            />
            {/* Menu Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-[101] w-full max-w-[320px] mx-4"
            >
              <div className="p-5 rounded-3xl backdrop-blur-2xl bg-white/15 dark:bg-slate-900/50 border border-white/25 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => { setExpanded(false); onFABAction?.("photo") }}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 shadow-lg flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white/90">Muat Naik Foto</span>
                  </button>

                  <button 
                    onClick={() => { setExpanded(false); onFABAction?.("audio") }}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-lg flex items-center justify-center">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white/90">Audio Guestbook</span>
                  </button>

                  <button 
                    onClick={() => { setExpanded(false); onFABAction?.("video") }}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 shadow-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white/90">Video Guestbook</span>
                  </button>

                  <button 
                    onClick={() => { setExpanded(false); onFABAction?.("wishes") }}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white/90">Ucapan Teks</span>
                  </button>

                  <button 
                    onClick={() => { setExpanded(false); onFABAction?.("qr") }}
                    className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all duration-200"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white/90">Imbas QR</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Floating Dock */}
      <div className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        className
      )}>
        <motion.div
          className="w-full h-16 rounded-full backdrop-blur-2xl bg-white/30 dark:bg-black/40 border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-between px-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick?.()
                setActiveIndex(index)
              }}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 p-2 rounded-xl transition-all duration-200",
                "active:scale-90",
                activeIndex === index && "bg-white/20"
              )}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}

          {/* FAB Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="relative w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg flex items-center justify-center transition-transform duration-200"
            style={{ transform: expanded ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </motion.div>
      </div>
    </>
  )
}
