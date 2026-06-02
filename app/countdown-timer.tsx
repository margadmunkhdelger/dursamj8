"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

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

// Components moved outside to prevent re-mounting on every tick
const FlipDigit = ({ value, label, compact = false }: { value: number; label: string; compact?: boolean }) => {
  const displayValue = value.toString().padStart(2, "0")

  return (
    <div className={`flex flex-col items-center gap-0.5`}>
      <div className={`relative ${compact ? "w-9 h-11" : "w-10 h-12 sm:w-12 sm:h-14"}`} style={{ perspective: "1000px" }}>
        <div className="absolute inset-0 rounded-lg bg-[#fdf8ee] border-2 border-[#c9a45c]/60 shadow-sm overflow-hidden"
          style={{ boxShadow: "0 2px 8px rgba(201,164,92,0.15), inset 0 1px 2px rgba(255,255,255,0.8)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
          <AnimatePresence mode="popLayout">
            <motion.div
              key={displayValue}
              initial={{ rotateX: 90, opacity: 0, y: 10 }}
              animate={{ rotateX: 0, opacity: 1, y: 0 }}
              exit={{ rotateX: -90, opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className={`absolute inset-0 flex items-center justify-center font-mono font-black tabular-nums ${
                compact ? "text-base text-[#1f2d5a]" : "text-lg sm:text-xl text-[#1f2d5a]"
              }`}
            >
              {displayValue}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <span
        className={`text-[#1f2d5a] uppercase tracking-wider font-bold font-sans ${
          compact ? "text-[6px]" : "text-[7px] sm:text-[8px]"
        }`}
      >
        {label}
      </span>
    </div>
  )
}

const AlbumUnit = ({ value, label }: { value: number; label: string }) => {
  const displayValue = value.toString().padStart(2, "0")
  return (
    <div className="flex flex-col items-center gap-0.5">
      <motion.div 
        className="countdown-unit relative rounded-md px-1.5 py-1 min-w-[1.75rem] border border-[#c9a45c]/40 bg-[#fdf8ee]/30"
        whileHover={{ scale: 1.04 }}
        style={{ perspective: "400px" }}
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={displayValue}
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }} 
            className="block font-mono text-xs font-bold text-[#1f2d5a] tabular-nums text-center"
          >
            {displayValue}
          </motion.span>
        </AnimatePresence>
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
          aria-hidden
        />
      </motion.div>
      <span className="text-[6px] uppercase tracking-[0.1em] text-[#1f2d5a] font-semibold">
        {label}
      </span>
    </div>
  )
}

const Separator = ({ album = false }: { album?: boolean }) => (
  <div 
    className={`flex flex-col justify-center gap-1 ${album ? "mx-0 px-0.5 pb-3" : "mx-0.5 sm:mx-1"}`}
  > 
    <div className={`rounded-full bg-[#1f2d5a]/70 ${album ? "w-0.5 h-0.5" : "w-1 h-1 sm:w-1.5 sm:h-1.5"}`} />
    {!album && ( // Only show second dot for non-album variant
      <div className="rounded-full bg-[#1f2d5a]/70 w-1 h-1 sm:w-1.5 sm:h-1.5" />
    )}
  </div>
)

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
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (!mounted) return null

  if (variant === "album") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative flex items-start justify-center flex-wrap gap-y-2">
          <FlipDigit value={timeLeft.years} label="Жил" compact />
          <Separator />
          <FlipDigit value={timeLeft.days} label="Өдөр" compact />
          <Separator />
          <FlipDigit value={timeLeft.hours} label="Цаг" compact />
          <Separator />
          <FlipDigit value={timeLeft.minutes} label="Мин" compact />
          <Separator />
          <FlipDigit value={timeLeft.seconds} label="Сек" compact />
        </div>

        <motion.h3
          className="text-xs sm:text-sm text-[#1f2d5a] font-serif font-bold italic tracking-wide"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h3>
      </motion.div>
    )
  }

  if (compact) {
    return (
      <motion.div className="flex items-center justify-center">
        <FlipDigit value={timeLeft.years} label="Жил" compact />
        <Separator />
        <FlipDigit value={timeLeft.days} label="Өдөр" compact />
        <Separator />
        <FlipDigit value={timeLeft.hours} label="Цаг" compact />
        <Separator />
        <FlipDigit value={timeLeft.minutes} label="Мин" compact />
        <Separator />
        <FlipDigit value={timeLeft.seconds} label="Сек" compact />
      </motion.div>
    )
  }

  return (
    <motion.div className="flex flex-col items-center gap-4 sm:gap-6">
      <div className="relative flex items-start justify-center flex-wrap gap-y-2">
        <FlipDigit value={timeLeft.years} label="Жил" />
        <Separator />
        <FlipDigit value={timeLeft.days} label="Өдөр" />
        <Separator />
        <FlipDigit value={timeLeft.hours} label="Цаг" />
        <Separator />
        <FlipDigit value={timeLeft.minutes} label="Мин" />
        <Separator />
        <FlipDigit value={timeLeft.seconds} label="Сек" />
      </div>
      <motion.h3
        className="text-lg sm:text-xl text-[#1f2d5a] font-serif font-bold italic tracking-wide"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      > 
        {title}
      </motion.h3>
    </motion.div>
  )
}
