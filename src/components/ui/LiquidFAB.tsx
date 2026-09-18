"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LiquidFABProps {
  icon: React.ReactNode
  onClick?: () => void
  size?: "sm" | "md" | "lg"
  color?: "rose" | "indigo" | "emerald" | "amber" | "default"
  className?: string
  tooltip?: string
}

const colorMap = {
  rose: "from-rose-500 to-pink-600",
  indigo: "from-indigo-500 to-purple-600",
  emerald: "from-emerald-500 to-teal-600",
  amber: "from-amber-500 to-orange-600",
  default: "from-rose-500 to-indigo-500",
}

export default function LiquidFAB({
  icon,
  onClick,
  size = "md",
  color = "default",
  className,
  tooltip,
}: LiquidFABProps) {
  const sizeClasses = {
    sm: "p-2 rounded-full",
    md: "p-3 rounded-full",
    lg: "p-4 rounded-full",
  }

  return (
    <div className="relative inline-block">
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg backdrop-blur-xl bg-black/60 border border-white/10 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {tooltip}
        </div>
      )}
      <motion.button
        onClick={onClick}
        className={cn(
          "flex items-center justify-center",
          `bg-gradient-to-tr ${colorMap[color]}`,
          "text-white shadow-xl border-2 border-white/30",
          "backdrop-blur-md",
          sizeClasses[size],
          "active:scale-90",
          "transition-all duration-200",
          "group",
          className
        )}
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.05 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(244, 63, 94, 0.3)",
            "0 0 30px rgba(244, 63, 94, 0.5)",
            "0 0 20px rgba(244, 63, 94, 0.3)",
          ],
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {icon}
      </motion.button>
    </div>
  )
}
