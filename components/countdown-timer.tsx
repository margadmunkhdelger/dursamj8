"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Lock } from "lucide-react"

interface TimeLeft {
  years: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface CountdownTimerProps {
  targetDate: Date
  title?: string
  compact?: boolean
  variant?: "default" | "album"
}

export function CountdownTimer({
  targetDate,
  title = "Бидний дахин уулзах цаг ойртсоор",
  compact = false,
  variant = "default",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [mounted, setMounted] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setMounted(true)
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365))
        const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        setTimeLeft({ years, days, hours, minutes, seconds })
        setTick((t) => t + 1)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (!mounted) return null

  // FlipDigit - only animates when value changes
  const FlipDigit = ({ value, label, isSeconds = false }: { value: number; label: string; isSeconds?: boolean }) => {
    const displayValue = value.toString().padStart(2, "0")

    return (
      <div className={`flex flex-col items-center ${compact ? "gap-0.5" : "gap-0.5"}`}>
        <motion.div 
          className={`relative ${compact ? "w-9 h-11" : "w-10 h-12 sm:w-12 sm:h-14"}`}
          animate={isSeconds ? { scale: [1, 1.02, 1] } : {}}
          transition={isSeconds ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : {}}
        >
          <div className="absolute inset-0 rounded-lg bg-[#fdf8ee] border border-[#c9a45c]/40 shadow-sm overflow-hidden"
            style={{ boxShadow: "0 2px 8px rgba(201,164,92,0.15), inset 0 1px 2px rgba(255,255,255,0.8)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
            <AnimatePresence mode="popLayout">
              <motion.div
                key={displayValue}
                initial={{ y: 8, opacity: 0, filter: "blur(3px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -8, opacity: 0, filter: "blur(3px)" }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className={`absolute inset-0 flex items-center justify-center font-mono font-black tabular-nums ${
                  compact ? "text-base text-primary" : "text-lg sm:text-xl text-[#7a4f1e]"
                }`}
              >
                {displayValue}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
        <span
          className={`text-[#c9a45c] uppercase tracking-wider font-bold font-sans ${
            compact ? "text-[6px]" : "text-[7px] sm:text-[8px]"
          }`}
        >
          {label}
        </span>
      </div>
    )
  }

  // AlbumUnit - for album variant, isSeconds gets beat animation
  const AlbumUnit = ({ value, label, isSeconds = false }: { value: number; label: string; isSeconds?: boolean }) => {
    const displayValue = value.toString().padStart(2, "0")
    return (
      <motion.div className="flex flex-col items-center gap-0.5" layout>
        <motion.div 
          className="countdown-unit relative rounded-md px-1.5 py-1 min-w-[1.75rem]"
          whileHover={{ scale: 1.04 }}
          animate={isSeconds ? { scale: [1, 1.05, 1] } : {}}
          transition={isSeconds ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : {}}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={displayValue}
              initial={{ y: 6, opacity: 0, filter: "blur(3px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -6, opacity: 0, filter: "blur(3px)" }}
              transition={{ duration: 0.25, ease: [0.33, 1, 0.32, 1] }} 
              className="block font-mono text-xs font-bold text-primary tabular-nums text-center"
            >
              {displayValue}
            </motion.span>
          </AnimatePresence>
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            aria-hidden
          />
        </motion.div>
        <span className="text-[6px] uppercase tracking-[0.1em] text-muted-foreground font-semibold">
          {label}
        </span>
      </motion.div>
    )
  }

  const Separator = ({ album = false }: { album?: boolean }) => (
    <motion.div 
      className={`flex flex-col justify-center gap-1 ${album ? "mx-0 px-0.5 pb-3" : "mx-0.5 sm:mx-1"}`}
    > 
      <motion.div
        className={`rounded-full bg-primary/70 ${album ? "w-0.5 h-0.5" : "w-1 h-1 sm:w-1.5 sm:h-1.5"}`}
        animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.2, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {!album && (
        <motion.div
          className="rounded-full bg-primary/70 w-1 h-1 sm:w-1.5 sm:h-1.5"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        />
      )}
    </motion.div>
  )

  if (variant === "album") {
    const totalSeconds = Math.max(
      1,
      timeLeft.years * 365 * 24 * 3600 +
        timeLeft.days * 24 * 3600 +
        timeLeft.hours * 3600 +
        timeLeft.minutes * 60 +
        timeLeft.seconds
    )
    const reunionSpan = Math.max(1, targetDate.getTime() - new Date("2024-01-01").getTime())
    const progress = Math.min(100, Math.max(0, 100 - (totalSeconds / (reunionSpan / 1000)) * 100))

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl px-3 py-2.5 relative overflow-hidden border border-border shadow-sm"
      >
        <motion.div
          className="absolute inset-0 rounded-xl opacity-40"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.15), transparent 70%)",
          }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
        <div className="relative flex items-center justify-center gap-1.5 mb-2">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center border border-primary/30"
          >
            <Lock className="w-3 h-3 text-primary/80" />
          </motion.div>
          <span className="text-[9px] uppercase tracking-[0.22em] text-primary/90 font-medium">
            {title}
          </span>
        </div>
        <div className="relative flex items-center justify-center flex-wrap gap-y-1">
          <AlbumUnit value={timeLeft.years} label="Жил" />
          <Separator album />
          <AlbumUnit value={timeLeft.days} label="Өдөр" />
          <Separator album />
          <AlbumUnit value={timeLeft.hours} label="Цаг" />
          <Separator album />
          <AlbumUnit value={timeLeft.minutes} label="Мин" />
          <Separator album />
          <AlbumUnit value={timeLeft.seconds} label="Сек" isSeconds />
        </div>
        <div className="relative mt-2.5 h-1 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/60 via-primary to-accent/70"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%`, background: "linear-gradient(to right, var(--primary)/60, var(--primary), var(--accent)/70)" }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.32, 1] }}
          />
        </div>
      </motion.div>
    )
  }

  if (compact) {
    return (
      <motion.div className="flex items-center justify-center">
        <FlipDigit value={timeLeft.years} label="Жил" />
        <Separator />
        <FlipDigit value={timeLeft.days} label="Өдөр" />
        <Separator />
        <FlipDigit value={timeLeft.hours} label="Цаг" />
        <Separator />
        <FlipDigit value={timeLeft.minutes} label="Мин" />
        <Separator />
        <FlipDigit value={timeLeft.seconds} label="Сек" isSeconds />
      </motion.div>
    )
  }

  return (
    <motion.div className="flex flex-col items-center gap-3 sm:gap-4">
      <motion.h3
        className="text-xs sm:text-sm text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.2em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      > 
        {title}
      </motion.h3>
      <div className="relative flex items-start justify-center flex-wrap gap-y-2">
        <FlipDigit value={timeLeft.years} label="Жил" />
        <Separator />
        <FlipDigit value={timeLeft.days} label="Өдөр" />
        <Separator />
        <FlipDigit value={timeLeft.hours} label="Цаг" />
        <Separator />
        <FlipDigit value={timeLeft.minutes} label="Мин" />
        <Separator />
        <FlipDigit value={timeLeft.seconds} label="Сек" isSeconds />
      </div>
    </motion.div>
  )
}
