"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { FloatingParticles } from "./floating-particles"
import { CountdownTimer } from "./countdown-timer"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface CinematicIntroProps {
  groupName: string
  graduationYear: number
  reunionDate: Date
  quote?: string
  onEnter: () => void
}

export function CinematicIntro({
  groupName,
  graduationYear,
  reunionDate,
  quote = "Some memories are unforgettable, remaining ever vivid and heartwarming.",
  onEnter
}: CinematicIntroProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
      setTimeout(() => setPhase(4), 3500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center overflow-hidden">
      <FloatingParticles count={300} />
      
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/80 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              key="intro-year"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-4"
            > 
              <span className="text-sm uppercase tracking-[0.4em] text-muted-foreground">
                Class of {graduationYear}
              </span>
            </motion.div>
          )}

          {phase >= 2 && (
            <motion.h1
              key="intro-title"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6"
            >
              <span className="text-gradient">{groupName}</span>
            </motion.h1>
          )}

          {phase >= 3 && (
            <motion.p
              key="intro-quote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-lg sm:text-xl text-muted-foreground italic mb-12 leading-relaxed"
            > 
              &ldquo;{quote}&rdquo;
            </motion.p>
          )}

          {phase >= 4 && (
            <motion.div
              key="intro-cta"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-10"
            >
              <CountdownTimer targetDate={reunionDate} title="Time Capsule Opens In" />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <Button
                  onClick={onEnter}
                  size="lg"
                  className="group h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 transition-all"
                >
                  <span>Enter Our Memories</span>
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              {/* Vinyl/Album aesthetic */}
              <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              > 
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  Now Playing: The Soundtrack of Our Lives
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 border border-white/5 rounded-full"
        initial={{ opacity: 0, scale: 0, borderColor: "var(--border)" }}
        animate={{ opacity: 1, scale: 1, rotate: 360, borderColor: "var(--border)" }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-24 h-24 border border-white/5 rounded-full"
        initial={{ opacity: 0, scale: 0, borderColor: "var(--border)" }}
        animate={{ opacity: 1, scale: 1, rotate: -360, borderColor: "var(--border)" }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}
