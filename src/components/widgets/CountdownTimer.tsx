"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  targetDate: Date | string
  className?: string
  showDays?: boolean
  label?: string
  timezone?: string // Default: Asia/Kuala_Lumpur
}

/**
 * Convert a date to a specific timezone and get the time difference
 */
function getTimeUntil(targetDate: Date, timezone: string): {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
} {
  const klTime = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }))
  const targetInKL = new Date(targetDate.toLocaleString('en-US', { timeZone: timezone }))
  
  const difference = targetInKL.getTime() - klTime.getTime()
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 }
  }
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    totalMs: difference,
  }
}

export default function CountdownTimer({
  targetDate,
  className,
  showDays = true,
  label = "Countdown",
  timezone = 'Asia/Kuala_Lumpur',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const result = getTimeUntil(new Date(targetDate), timezone)
      setTimeLeft({
        days: result.days,
        hours: result.hours,
        minutes: result.minutes,
        seconds: result.seconds,
      })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate, timezone])

  const timeUnits = [
    { label: "Hari", value: timeLeft.days, show: showDays },
    { label: "Jam", value: timeLeft.hours, show: true },
    { label: "Minit", value: timeLeft.minutes, show: true },
    { label: "Saat", value: timeLeft.seconds, show: true },
  ].filter(unit => unit.show)

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <h3 className="text-sm font-medium text-white/70 uppercase tracking-wider">
        {label}
      </h3>
      <div className="flex items-center gap-2 sm:gap-3">
        <AnimatePresence mode="popLayout">
          {timeUnits.map((unit) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl backdrop-blur-xl bg-white/10 dark:bg-slate-900/40 border border-white/20 shadow-glass flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <span className="mt-1.5 text-xs font-medium text-white/60">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
