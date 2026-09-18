import React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'light' | 'dark' | 'default'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: 'rose' | 'red' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'blue' | 'none'
  innerShadow?: boolean
}

export default function GlassCard({
  children,
  className,
  variant = 'default',
  size = 'md',
  glow = 'none',
  innerShadow = false,
  ...props
}: GlassCardProps) {
  const bgClass = variant === 'light' 
    ? 'bg-white/10' 
    : variant === 'dark' 
    ? 'bg-black/20' 
    : 'bg-white/10 dark:bg-slate-900/40'

  const borderClass = 'border border-white/20 dark:border-white/10'
  const shadowClass = innerShadow 
    ? 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]' 
    : 'shadow-glass'
  
  const glowClass = glow === 'rose' || glow === 'red' 
    ? 'hover:shadow-glow-rose' 
    : glow === 'indigo'
    ? 'hover:shadow-glow-indigo'
    : glow === 'emerald'
    ? 'hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]'
    : glow === 'amber'
    ? 'hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]'
    : glow === 'purple'
    ? 'hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'
    : glow === 'blue'
    ? 'hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]'
    : ''

  const sizeClass = size === 'sm' 
    ? 'p-4 rounded-glass' 
    : size === 'lg'
    ? 'p-8 rounded-glass-lg'
    : size === 'xl'
    ? 'p-10 rounded-glass-xl'
    : 'p-6 rounded-glass'

  return (
    <div
      className={cn(
        bgClass,
        borderClass,
        shadowClass,
        sizeClass,
        'backdrop-blur-xl',
        'transition-all duration-300',
        'active:scale-[0.98]',
        glowClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
