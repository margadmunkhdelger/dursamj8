"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import { CountdownTimer } from "./countdown-timer"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronRight, Image as ImageIcon, Users, GraduationCap } from "lucide-react"
import {
  AlbumMobileFrame,
  AlbumPanel,
  PageHeader,
  PAGE_CONTENT_CLASS,
} from "./memory-album-shell";
import { ProfilePickerContent } from "./profile-picker";
import {
  type GroupIdentity,
  loadGroupIdentity,
  formatGraduationLine,
  formatGraduationSubtitle,
} from "@/lib/group-identity";
import type { Member } from "./profile-picker";

type CoverPhase = "closed" | "opening" | "open"
type FlowStage = "cover" | "profiles"

interface AlbumFlowProps {
  schoolName: string // schoolName-ийг AlbumFlowProps-д нэмэв
  groupName: string
  graduationYear: number
  reunionDate: Date
  quote?: string
  members: Member[]
  initialStage?: "cover" | "profiles"
  onSelectProfile: (member: Member) => void
  onRequestJoin: (
    memberData: Omit<Member, "id" | "likes" | "comments" | "voiceNotes" | "photos" | "status">
  ) => void
}

const OPEN_DURATION_MS = 1000

const springSmooth = { type: "spring" as const, stiffness: 200, damping: 25 }
const easeOutExpo = [0.33, 1, 0.32, 1] as const

export function AlbumFlow({
  schoolName,
  groupName,
  graduationYear,
  reunionDate,
  quote = "Зарим дурсамж хэзээ ч мартагдашгүй бөгөөд зүрх сэтгэлд үүрд тодоор үлддэг.",
  members,
  initialStage = "cover",
  onSelectProfile,
  onRequestJoin,
}: AlbumFlowProps) {
  const [stage, setStage] = useState<FlowStage>(initialStage)
  const [coverPhase, setCoverPhase] = useState<CoverPhase>(
    initialStage === "profiles" ? "open" : "closed"
  )
  const [contentPhase, setContentPhase] = useState(0)
  const [identity, setIdentity] = useState<GroupIdentity | null>(null)

  useEffect(() => {
    setIdentity(loadGroupIdentity())
  }, [])

  const display = useMemo(() => {
    if (identity) {
      return {
        school: identity.school, // Хэрэв identity байгаа бол түүний school-ийг ашиглана
        graduationLine: formatGraduationLine(identity),
        subtitle: formatGraduationSubtitle(identity),
        accessCode: identity.accessCode,
      }
    }
    return {
      school: schoolName, // Demo үед дамжуулсан schoolName-ийг ашиглана
      graduationLine: `${graduationYear} оны төгсөлт`,
      subtitle: `${graduationYear} Оны Төгсөгчид`,
      accessCode: null as string | null,
    }
  }, [identity, schoolName, graduationYear])

  useEffect(() => {
    if (initialStage === "profiles") return
    const timers = [
      setTimeout(() => setContentPhase(1), 220),
      setTimeout(() => setContentPhase(2), 520),
      setTimeout(() => setContentPhase(3), 880),
    ]
    return () => timers.forEach(clearTimeout)
  }, [initialStage])

  const handleEnter = () => {
    if (stage !== "cover" || coverPhase !== "closed") return
    setCoverPhase("opening")
    setTimeout(() => {
      setCoverPhase("open")
      setStage("profiles")
    }, 600) // Transition to profile stage halfway through the flip
  }

  const isCover = stage === "cover"

  return (
    <AlbumMobileFrame>
      <AnimatePresence mode="wait">
        {isCover ? (
          <motion.div
            key="cover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={springSmooth}
            className="w-full"
          >
            <motion.div className={cn(PAGE_CONTENT_CLASS, "pt-4")}>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="h-full"
              >
                <AlbumPanel // Main album cover panel
                  variant="cover" 
                  className="relative p-5 sm:p-8 space-y-5 sm:space-y-10 text-center border-l-[8px] sm:border-l-[12px] border-l-amber-900/60 bg-[#f4f1ea] shadow-[10px_20px_40px_-15px_rgba(0,0,0,0.3)] max-h-[calc(100dvh-4rem)] min-h-0 flex flex-col justify-center overflow-hidden"
                >
                  {/* Minimalist Book Cover Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-900/5 via-transparent to-stone-900/5 pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-black/5" />
                  
                  {/* Top Left Decoration: Graduation Cap - Only on Cover */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -60, x: -60, y: -60 }} 
                    animate={{ opacity: 1, scale: 1, rotate: -15, x: -10, y: -10 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    className="absolute top-0 left-0 z-20 pointer-events-none drop-shadow-2xl w-24 sm:w-36"
                  >
                    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      {/* Board depth */}
                      <path d="M15 45 L15 50 L60 70 L60 65 Z" fill="#0d142d" />
                      <path d="M60 70 L105 50 L105 45 L60 65 Z" fill="#162044" />
                      {/* Board top surface */}
                      <path d="M15 45 L60 25 L105 45 L60 65 Z" fill="#1f2d5a" />
                      {/* Glossy highlight */}
                      <path d="M60 28 L95 45 L60 62 L25 45 Z" fill="url(#glossy_grad_album)" opacity="0.15" />
                      {/* Cap base */}
                      <path d="M35 62 Q35 85 60 90 Q85 85 85 62 L85 58 Q60 65 35 58 Z" fill="#162044" />
                      {/* Tassel Button */}
                      <circle cx="60" cy="45" r="3.5" fill="#c9a45c" />
                      <circle cx="60" cy="45" r="1.5" fill="#e8c98c" />
                      {/* Tassel Cord */}
                      <path d="M60 45 C75 45 88 52 88 72" stroke="#c9a45c" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      {/* Tassel Fringe */}
                      <g transform="translate(83, 68) rotate(15)">
                        <rect x="0" y="0" width="14" height="24" rx="2" fill="#c9a45c" />
                        <line x1="3" y1="2" x2="3" y2="22" stroke="#8b6b1b" strokeWidth="0.5" />
                        <line x1="7" y1="2" x2="7" y2="22" stroke="#8b6b1b" strokeWidth="0.5" />
                        <line x1="11" y1="2" x2="11" y2="22" stroke="#8b6b1b" strokeWidth="0.5" />
                        <rect x="-1" y="0" width="16" height="5" rx="1" fill="#8b6b1b" />
                      </g>
                      <defs>
                        <linearGradient id="glossy_grad_album" x1="60" y1="25" x2="60" y2="65" gradientUnits="userSpaceOnUse">
                          <stop stopColor="white" stopOpacity="1" />
                          <stop offset="1" stopColor="white" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </motion.div>

                  {/* Bottom Right Decoration: Gold Ribbon Seal - smaller */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: 60, x: 40, y: 40, rotateX: 45, rotateY: -45 }} 
                    animate={{ opacity: 1, scale: 1, rotate: 10, x: 0, y: 0, rotateX: 0, rotateY: 0 }}
                    transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                    className="absolute bottom-0 right-0 z-20 pointer-events-none drop-shadow-lg w-14 sm:w-16"
                  >
                    <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                      <path d="M20 40L10 75L30 60L50 75L40 40" fill="#d4af37" stroke="#b8860b" strokeWidth="1.5" />
                      <circle cx="30" cy="30" r="22" fill="#fbbf24" stroke="#b8860b" strokeWidth="2" />
                      <circle cx="30" cy="30" r="17" stroke="#b8860b" strokeWidth="1" strokeDasharray="3 3" />
                    </svg>
                  </motion.div>

                  <div className="relative z-10 space-y-8">
                    <AnimatePresence>
                      {contentPhase >= 2 && (
                        <motion.div
                          key="meta"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.55, ease: "easeOut" }}
                          className="flex flex-col items-center gap-6 sm:gap-8 pt-8 sm:pt-12"
                        >
                          <div className="space-y-4">
                            <p className="text-[10px] uppercase tracking-[0.6em] text-amber-900/60 font-bold">
                              <span className="inline">{display.school}</span>
                            </p>
                            <h2 className="text-3xl sm:text-6xl font-black text-foreground tracking-tighter leading-tight font-sans drop-shadow-sm">
                              Дурсамжийн <br className="sm:hidden"/> хайрцаг
                            </h2>
                            <p className="text-xs sm:text-sm text-stone-700 italic max-w-xs mx-auto px-4 sm:px-6 font-serif leading-relaxed">
                              &quot;{quote}&quot;
                            </p>
                          </div>

                          <div className="inline-flex items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 py-2 rounded-full border border-amber-900/20 bg-amber-900/5">
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/70">
                              <span className="inline">{display.school}</span>
                            </span>
                            <div className="w-1 h-1 rounded-full bg-primary/20" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/70">
                              <span className="inline">{groupName}</span>
                            </span>
                            <div className="w-1 h-1 rounded-full bg-primary/20" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/70">
                              <span className="inline">{graduationYear} ОНЫ ТӨГСӨЛТ</span>
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {contentPhase >= 3 && (
                      <motion.div
                        key="cta"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...springSmooth, delay: 0.2 }}
                        className="pt-0 sm:pt-2"
                      >
                        <Button
                          onClick={handleEnter}
                          disabled={coverPhase !== "closed"}
                          size="lg"
                          className="group relative overflow-hidden px-8 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-bold text-base transition-all duration-300 shadow-lg shadow-primary/20"
                        >
                          <span className="relative z-10">Цомгийг нээх</span>
                          <ChevronRight className="w-5 h-5 ml-1 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {contentPhase >= 3 && (
                      <motion.div
                        key="footer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...springSmooth, delay: 0.3 }}
                        className="pt-0"
                      >
                        <CountdownTimer
                          targetDate={reunionDate}
                          title="Бид эргэн уулзахад"
                          variant="album"
                        />
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] mt-3 sm:mt-6 text-center leading-snug break-words px-4 max-w-[92%] mx-auto">
                          Төгсөгчдөд зориулсан дурсамжийн цуглуулга
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </AlbumPanel>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="profiles"
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1, transition: { ...springSmooth, delay: 0.2 } }}
            exit={{ opacity: 0, x: 20, scale: 0.95, transition: springSmooth }}
            className="w-full"
          >
            <motion.div className={cn(PAGE_CONTENT_CLASS, "pt-4")}>
              <AlbumPanel
                variant="cover"
                className="relative p-5 sm:p-8 border-l-[8px] sm:border-l-[12px] border-l-amber-900/60 bg-[#f4f1ea] shadow-[10px_20px_40px_-15px_rgba(0,0,0,0.3)] max-h-[calc(100dvh-4rem)] min-h-0 flex flex-col overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-foreground/5 pointer-events-none" />
                <div className="absolute left-0 top-0 bottom-0 w-px bg-black/5" />

                {/* Bottom Right Decoration: Gold Ribbon Seal - smaller */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: 60, x: 40, y: 40, rotateX: 45, rotateY: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: 10, x: 0, y: 0, rotateX: 0, rotateY: 0 }}
                  transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                  className="absolute bottom-0 right-0 z-20 pointer-events-none drop-shadow-lg w-12 sm:w-14"
                >
                  <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <path d="M20 40L10 75L30 60L50 75L40 40" fill="#d4af37" stroke="#b8860b" strokeWidth="1.5" />
                    <circle cx="30" cy="30" r="22" fill="#fbbf24" stroke="#b8860b" strokeWidth="2" />
                    <circle cx="30" cy="30" r="17" stroke="#b8860b" strokeWidth="1" strokeDasharray="3 3" />
                  </svg>
                </motion.div>

                <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden">
                  <ProfilePickerContent members={members} onSelect={onSelectProfile} onRequestJoin={onRequestJoin} embedded />
                </div>
              </AlbumPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AlbumMobileFrame>
  )
}
