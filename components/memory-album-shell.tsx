"use client"

import { motion, AnimatePresence } from "framer-motion"
import { type ReactNode } from "react"
import { FloatingParticles } from "@/components/floating-particles"
import { cn } from "@/lib/utils"

export const PAGE_CONTENT_CLASS = "w-full max-w-md mx-auto"

interface AlbumMobileFrameProps {
  children: ReactNode
}

export function AlbumMobileFrame({ children }: AlbumMobileFrameProps) {
  return (
    <motion.div
      key="album-frame"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 w-full h-full flex flex-col items-center overflow-hidden bg-background touch-none overscroll-none"
    >
      <FloatingParticles count={80} />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 0%, var(--primary)/10, transparent 70%), radial-gradient(ellipse at 50% 100%, var(--muted)/50, transparent 60%)",
        }}
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <div className="relative z-10 pointer-events-auto w-full max-w-md flex-1 flex flex-col min-h-0 overflow-y-auto scrollbar-hide px-4 pb-[env(safe-area-inset-bottom,0px)] touch-pan-y overscroll-none">
        {children}
      </div>
    </motion.div>
  )
}

interface PageHeaderProps {
  title: ReactNode
  subtitle?: string
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-center mb-8"
    >
      <h1
        className="text-2xl font-bold mb-2 font-display"
      >
        {title}
      </h1>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </motion.div>
  )
}

interface AlbumPanelProps {
  children: ReactNode
  className?: string
  variant?: "cover" | "page"
}

export function AlbumPanel({ children, className, variant = "page" }: AlbumPanelProps) {
  return (
    <motion.div
      className={cn(
        "bg-card rounded-2xl border border-border shadow-lg overflow-hidden pointer-events-auto touch-manipulation",
        variant === "cover" && "album-cover",
        variant === "page" && "album-paper",
        className
      )}
    >
      {children}
    </motion.div>
  )
}
