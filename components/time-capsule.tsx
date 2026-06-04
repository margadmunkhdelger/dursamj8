"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Lock, Clock, Send, PenLine, Target, Heart, Mail, X, MapPin, Users, Award, User, Sparkles, Gift, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button" // Keep Button
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input" // Keep Input
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { CountdownTimer } from "./countdown-timer"
interface ReunionLocationDetails {
  name: string;
  address: string;
  mapsUrl: string;
  dateTime: string; // ISO string for datetime-local input
}
 
interface TimeCapsuleProps {
  reunionDate: Date
  onWrite: (content: string, type: string) => void
  reunionLocation?: string
  schoolName?: string
  groupName?: string
  graduationYear?: number
  reunionLocationDetails?: ReunionLocationDetails; // Updated prop
  currentUser?: { name: string } | null;
}

interface CapsuleLetter {
  id: string
  type: string
  title: string
  content: string
  author: string
  openDate: string
  createdAt: string
}

// Updated Capsule Types with the 4 categories requested
const capsuleTypes = [
  {
    id: "self",
    icon: User,
    label: "Ирээдүйн өөртөө",
    subtitle: "Захидал",
  },
  {
    id: "goals",
    icon: Target,
    label: "Ирээдүйн зорилго",
    subtitle: "Зорилго",
  },
  {
    id: "prediction",
    icon: Sparkles,
    label: "Таамаглал",
    subtitle: "Ирээдүйгээр",
  },
  {
    id: "promise",
    icon: Heart,
    label: "Амлалт",
    subtitle: "Амлалт өгөх",
  },
]

// Raining letters animation
interface RainingLetterParticle {
  id: string;
  x: number; // percentage from left
  delay: number;
  duration: number;
  rotate: number;
  emoji: string;
  containerHeight: number; // Height of the parent container for animation target
}

const RAINING_EMOJIS = ["✉️", "📝", "📜", "🖋️", "🔐", "❤️", "⭐", "✨", "🎉", "🎓"];

function RainingLetter({ id, x, delay, duration, rotate, emoji }: RainingLetterParticle) {
  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      initial={{ opacity: 0, y: -20, left: `${x}%`, rotate: 0, scale: 0.8 }}
      animate={{
        opacity: [0, 1, 1, 0], // Fade in, stay, fade out
        y: 400, // Fall down relative to container
        rotate: rotate,
        scale: [0.8, 1, 1, 0.6], // Scale up slightly then down
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "linear", // Linear fall
      }}
      style={{
        filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.15))",
        fontSize: "1.25rem"
      }}
    >
      {emoji}
    </motion.div>
  )
}

export function TimeCapsule({ reunionDate, onWrite, reunionLocationDetails, schoolName, groupName, graduationYear, currentUser }: TimeCapsuleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [viewingArchiveType, setViewingArchiveType] = useState<string | null>(null);
  const [currentArchiveIndex, setCurrentArchiveIndex] = useState(0);
  const [particles, setParticles] = useState<any[]>([]);
  const [submitParticles, setSubmitParticles] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLocked = useMemo(() => new Date() < reunionDate, [reunionDate]);

  const createParticles = useCallback(() => {
    const newParticles: any[] = []
    const emojis = ["❤️", "⭐", "✨", "🎉", "🎓", "💫", "🌟", "💖"]
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2 + Math.random() * 0.5
      newParticles.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        angle: angle,
        distance: 200 + Math.random() * 300,
        rotation: Math.random() * 720 - 360,
        scale: 1.8 + Math.random() * 2.5,
        delay: Math.random() * 0.1,
      })
    }
    setParticles(newParticles)
  }, [])

  const createSubmitParticles = useCallback(() => {
    const newParticles = [];
    const numberOfParticles = 20;
    for (let i = 0; i < numberOfParticles; i++) {
      newParticles.push({
        id: `submit-${Date.now()}-${i}`,
        emoji: RAINING_EMOJIS[Math.floor(Math.random() * RAINING_EMOJIS.length)],
        angle: (Math.random() * Math.PI) + Math.PI, // Дээшээ чиглэсэн нум (PI-ээс 2PI хүртэл)
        distance: 100 + Math.random() * 200,
        delay: Math.random() * 0.2,
        duration: 1.2 + Math.random() * 0.8,
        scale: 0.5 + Math.random() * 1.2,
        rotate: Math.random() * 720 - 360,
      });
    }
    setSubmitParticles(newParticles);
  }, []);

  const selectedTypeData = capsuleTypes.find(t => t.id === selectedType);
  const SelectedIcon = selectedTypeData?.icon || Lock;

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
    // Recalculate height if selectedType changes (modal opens/closes)
    // or if window resizes (though this is less critical for this effect)
    const handleResize = () => {
      if (containerRef.current) setContainerHeight(containerRef.current.offsetHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedType]);

  const [content, setContent] = useState("")
  const [letters, setLetters] = useState<CapsuleLetter[]>([
    {
      id: "l1",
      type: "self",
      title: "Ирээдүйн өөртөө",
      content: "",
      author: "Сарангуа",
      openDate: "2034-05-28",
      createdAt: "2024 оны 1-р сарын 15",
    },
    {
      id: "l2",
      type: "goals", // Updated type
      title: "Миний ирээдүйн зорилго", // Updated title
      content: "",
      author: "Мишээл",
      openDate: "2034-05-28",
      createdAt: "2024 оны 2-р сарын 20",
    },
  ])
  const [rainingLetters, setRainingLetters] = useState<RainingLetterParticle[]>([]);

  const triggerRainingLetters = useCallback(() => {
    const newLetters: RainingLetterParticle[] = [];
    const numberOfLetters = 15 + Math.floor(Math.random() * 10); // 15-25 items

    for (let i = 0; i < numberOfLetters; i++) {
      newLetters.push({
        id: `rain-${Date.now()}-${i}`,
        x: Math.random() * 100, // 0-100% horizontal position
        delay: Math.random() * 1, // 0-1s delay
        duration: 2 + Math.random() * 1, // 2-3s duration
        rotate: Math.random() * 720 - 360, // -360 to 360 degrees rotation
        emoji: RAINING_EMOJIS[Math.floor(Math.random() * RAINING_EMOJIS.length)],
        containerHeight: 0,
      });
    }
    setRainingLetters(newLetters);
  }, []);



  const handleSubmit = () => {
    if (!content.trim() || !selectedType) return
    const authorName = currentUser?.name || "Нууц"
    const typeLabel = capsuleTypes.find(t => t.id === selectedType)?.label || ""

    const newLetter: CapsuleLetter = {
      id: `l${Date.now()}`,
      type: selectedType,
      title: typeLabel,
      content,
      author: authorName,
      openDate: reunionDate.toISOString().split('T')[0],
      createdAt: new Date().toLocaleDateString("mn-MN", { year: "numeric", month: "long", day: "numeric" }),
    }
    
    // Raining letters эффектийг хасаж, pop-up анимацийг идэвхжүүлэв
    setIsSubmitting(true);
    createSubmitParticles();

    setTimeout(() => {
      setLetters(prev => [newLetter, ...prev])
      onWrite(content, selectedType)
      setContent("")
      setSelectedType(null)
      setIsSubmitting(false);
      setSubmitParticles([]);
    }, 1500); // Анимацийг дуусгах боломж олгох үүднээс хугацааг сунгав
  };

  const lettersByType = (typeId: string) => letters.filter(l => l.type === typeId);

  const openArchive = (typeId: string) => {
    if (lettersByType(typeId).length === 0) return;
    setViewingArchiveType(typeId);
    setCurrentArchiveIndex(0);
    if (!isLocked) createParticles();
  };

  const archivedLetters = viewingArchiveType ? lettersByType(viewingArchiveType) : [];

  return (
    <div className="space-y-5 relative" ref={containerRef}>
      {/* Raining letters animation */}
      <AnimatePresence>
        {rainingLetters.map((particle) => (
          <RainingLetter key={particle.id} {...particle} containerHeight={containerHeight} />
        ))}
      </AnimatePresence>

      {/* Countdown Header - Restyled to match Home Page Hero */}
      <motion.div
        className="bg-card rounded-2xl p-4 sm:p-6 text-center relative overflow-hidden border border-border shadow-lg w-full max-w-md mx-auto"
      >
        {/* Decorative Background - Contained within card to prevent horizontal overflow */}
        <div className="absolute inset-0 opacity-40 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-accent blur-[60px]" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 space-y-3 relative"
          >
            {/* Left Graduation Ribbon Banner */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              className="absolute top-[-16px] sm:top-[-24px] left-[-4px] sm:left-[-8px] w-6 sm:w-8 bottom-0 z-0 pointer-events-none drop-shadow-md origin-top"
            >
              <svg viewBox="0 0 40 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0 0 H40 V80 L20 120 L0 80 Z" fill="#1f2d5a" />
                <path d="M4 0 V78 L20 115 L36 78 V0" stroke="#c9a45c" strokeWidth="2" />
                <path d="M8 0 V76 L20 112 L32 76 V0" stroke="#c9a45c" strokeWidth="0.5" opacity="0.4" />
                <circle cx="20" cy="25" r="3" fill="#c9a45c" opacity="0.5" />
                <circle cx="20" cy="50" r="3" fill="#c9a45c" opacity="0.5" />
                <circle cx="20" cy="75" r="3" fill="#c9a45c" opacity="0.5" />
              </svg>
            </motion.div>

            {/* Right Graduation Ribbon Banner */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              className="absolute top-[-16px] sm:top-[-24px] right-[-4px] sm:right-[-8px] w-6 sm:w-8 bottom-0 z-0 pointer-events-none drop-shadow-md origin-top"
            >
              <svg viewBox="0 0 40 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform scale-x-[-1]" preserveAspectRatio="none">
                <path d="M0 0 H40 V80 L20 120 L0 80 Z" fill="#1f2d5a" />
                <path d="M4 0 V78 L20 115 L36 78 V0" stroke="#c9a45c" strokeWidth="2" />
                <path d="M8 0 V76 L20 112 L32 76 V0" stroke="#c9a45c" strokeWidth="0.5" opacity="0.4" />
                <circle cx="20" cy="25" r="3" fill="#c9a45c" opacity="0.5" />
                <circle cx="20" cy="50" r="3" fill="#c9a45c" opacity="0.5" />
                <circle cx="20" cy="75" r="3" fill="#c9a45c" opacity="0.5" />
              </svg>
            </motion.div>

            {groupName && (
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a45c] font-bold relative z-10 px-6">
                {groupName}
              </p>
            )}
            <h1 className="text-2xl sm:text-4xl font-script text-foreground leading-[1.1] px-6 relative z-10">
              Бид дахин уулзахад нээгдэх захидлууд
            </h1>
            <div className="flex items-center justify-center gap-3 relative z-10">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[#c9a45c] max-w-[60px]" />
              <p className="text-xs sm:text-sm font-sans font-bold text-[#1f2d5a] uppercase tracking-[0.2em] whitespace-nowrap lining-nums tabular-nums">
                {graduationYear} ОНЫ ТӨГСӨЛТ
              </p>
              <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[#c9a45c] max-w-[60px]" />
            </div>
          </motion.div>

          <CountdownTimer targetDate={reunionDate} title="Захидлууд нээгдэхэд..." variant="default" />
        </div>
      </motion.div>

      {/* Write Section Title */}
      <div className="px-1">
        <h2 className="text-sm font-bold text-[#1f2d5a] font-sans uppercase tracking-widest flex items-center gap-2">
          <PenLine className="w-4 h-4 text-[#c9a45c]" />
          Захидал үлдээх ба үзэх
        </h2>
      </div>

      <div className="flex flex-col gap-8 pb-10">
        {capsuleTypes.map((type, index) => {
          const count = lettersByType(type.id).length
          return (
            <div key={type.id} className="relative flex flex-col items-center">
              {/* Write Button (The "Hanger") */}
              <motion.button
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, backgroundColor: "var(--muted)" }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                className="bg-card border border-border rounded-2xl p-4 text-left shadow-md hover:border-[#c9a45c] transition-all group relative overflow-hidden w-full z-10"
              >
                <type.icon className="absolute -right-2 top-1/2 -translate-y-1/2 w-16 h-16 text-[#1f2d5a] opacity-[0.05] group-hover:opacity-10 transition-opacity" />
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#c9a45c]/10 flex items-center justify-center group-hover:bg-[#c9a45c]/20 transition-colors border border-[#c9a45c] shrink-0">
                      <type.icon className="w-5 h-5 text-[#1f2d5a]" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-[#1f2d5a] font-sans uppercase tracking-wider">{type.label}</p>
                      <p className="text-[10px] text-[#1f2d5a]/60 font-medium">{type.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-2xl font-bold text-[#1f2d5a] leading-none font-mono tabular-nums shrink-0">
                      {count}
                    </p>
                    <p className="text-[8px] text-[#1f2d5a]/40 font-bold uppercase tracking-tighter">Ширхэг</p>
                  </div>
                </div>
              </motion.button>

              {/* Write Letter Section - Now expands in the middle */}
              <AnimatePresence>
                {selectedType === type.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="w-full overflow-hidden z-20"
                  >
                    {/* Visual Connector - Top Chains */}
                    <div className="flex justify-between w-full px-12 h-5 -mb-0.5 relative z-0">
                      <div className="w-1.5 h-full bg-gradient-to-b from-[#c9a45c] via-[#f8e4b3] to-[#c9a45c] shadow-[0_1px_3px_rgba(0,0,0,0.2)] rounded-full border-x border-[#8b6914]/20" />
                      <div className="w-1.5 h-full bg-gradient-to-b from-[#c9a45c] via-[#f8e4b3] to-[#c9a45c] shadow-[0_1px_3px_rgba(0,0,0,0.2)] rounded-full border-x border-[#8b6914]/20" />
                    </div>

                    <div className="bg-card rounded-3xl p-6 relative overflow-hidden border border-border mb-0 mx-1">
                      {/* Luxury Cream Paper Texture */}
                      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f8e4b3] to-[#d4af37] flex items-center justify-center shadow-md border border-amber-900/10 shrink-0">
                              <type.icon className="w-6 h-6 text-[#14213d]" />
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-[#1f2d5a] font-serif tracking-tight italic leading-snug text-justify">
                              {type.id === "self"
                                ? "Ирээдүйн өөртөө хэлмээр байгаа зүйлсээ энд бичнэ үү !"
                                : type.id === "goals"
                                ? "Ирээдүйн зорилгоо энд бичнэ үү !"
                                : type.id === "prediction"
                                ? "Ирээдүйд хэн, юу, яаж болох талаар таамаглалаа энд бичнэ үү !"
                                : type.id === "promise"
                                ? "Ангийнхандаа өгөх өөрийн амлалтаа энд бичнэ үү !"
                                : type.label}
                            </h3>
                          </div>
                          <button
                            onClick={() => setSelectedType(null)}
                            className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors shadow-sm"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={
                              type.id === "self"
                                ? "Хүндэт ирээдүйн би,\n\nБи чамд хэлэхийг хүссэн зүйл минь..."
                                : type.id === "goals"
                                ? "Миний ирээдүйн зорилго бол..."
                                : type.id === "prediction"
                                ? "Ирээдүйд ийм зүйл болно гэж таамаглаж байна..."
                                : "Би ирээдүйн өөртөө болон бусдад ийм амлалт өгч байна..."
                            }
                            className="bg-white/50 border-stone-200 min-h-[200px] text-base resize-none rounded-2xl focus:ring-primary/20 text-stone-800 placeholder:text-stone-400 font-serif italic p-5 shadow-inner"
                          />
                          
                          <div className="relative">
                            <Button
                              onClick={handleSubmit}
                              disabled={!content.trim() || isSubmitting}
                              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/20 text-lg transition-all active:scale-[0.98]"
                            >
                              <Lock className="w-5 h-5 mr-2" />
                              Захидлыг түгжих
                            </Button>

                            <AnimatePresence>
                              {isSubmitting && submitParticles.map((particle) => (
                                <motion.div
                                  key={particle.id}
                                  initial={{ opacity: 0, x: "-50%", y: 0, scale: 0 }}
                                  animate={{ 
                                    opacity: [0, 1, 1, 0],
                                    x: `calc(-50% + ${Math.cos(particle.angle) * particle.distance}px)`,
                                    y: Math.sin(particle.angle) * particle.distance,
                                    scale: particle.scale,
                                    rotate: particle.rotate
                                  }}
                                  transition={{ duration: particle.duration, delay: particle.delay, ease: [0.22, 1, 0.36, 1] }}
                                  className="absolute left-1/2 top-0 pointer-events-none text-3xl z-50"
                                >
                                  {particle.emoji}
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Visual Connector - 2 Golden Chains */}
              <motion.div layout className="flex justify-between w-full px-12 h-5 -my-0.5 relative z-0">
                <div className="w-1.5 h-full bg-gradient-to-b from-[#c9a45c] via-[#f8e4b3] to-[#c9a45c] shadow-[0_1px_3px_rgba(0,0,0,0.2)] rounded-full border-x border-[#8b6914]/20" />
                <div className="w-1.5 h-full bg-gradient-to-b from-[#c9a45c] via-[#f8e4b3] to-[#c9a45c] shadow-[0_1px_3px_rgba(0,0,0,0.2)] rounded-full border-x border-[#8b6914]/20" />
              </motion.div>

              {/* Archive Button (The "Hanging Box") */}
              <div className="relative w-full">
                {/* Hanging Decoration Seal - ensured circular fill and no clipping artifacts */}
                <div 
                  className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-[#f8e4b3] via-[#d4af37] to-[#8b6914] shadow-md border border-amber-900/20 z-30 flex items-center justify-center overflow-hidden aspect-square shrink-0"
                  style={{ backgroundClip: 'padding-box' }}
                >
                  {isLocked ? <Lock className="w-3.5 h-3.5 text-[#14213d]" /> : <Gift className="w-3.5 h-3.5 text-[#14213d]" />}
                </div>

                <motion.button
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => openArchive(type.id)}
                  className={cn(
                    "relative h-12 rounded-2xl overflow-hidden shadow-lg border border-white/5 transition-all group w-full z-10 bg-[#14213d]",
                    count > 0 ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  <div className="absolute inset-0 pointer-events-none opacity-50">
                    <div className="absolute inset-0 z-10" style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)", background: "#182640" }} />
                    <div className="absolute inset-0 z-10" style={{ clipPath: "polygon(100% 0, 50% 50%, 100% 100%)", background: "#182640" }} />
                    <div className="absolute inset-0 z-10" style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)", background: "linear-gradient(to top, #0f1a2e, #14213d)" }} />
                  </div>

                  <div className="relative z-20 flex items-center justify-center w-full h-full px-5 pt-3">
                    <p className="text-[10px] font-bold text-[#f5d17a] font-sans uppercase tracking-wider text-center">
                      {type.id === "goals" 
                        ? "Зорилгын архив үзэх" 
                        : type.id === "prediction" 
                        ? "Таамаглалын архив үзэх" 
                        : type.id === "promise" 
                        ? "Амлалтын архив үзэх" 
                        : "Захидлын архив үзэх"}
                    </p>
                  </div>
                </motion.button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Archive Viewer Modal - Styled like MemberCard Read Letter */}
      <AnimatePresence>
        {viewingArchiveType && archivedLetters.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white/5 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setViewingArchiveType(null)}
          >
            <div className="relative w-full max-w-sm flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-[calc(100%-2rem)] max-w-sm flex relative overflow-hidden bg-card rounded-3xl px-4 sm:px-6 py-4 text-center shadow-2xl border border-border min-h-[220px]"
              >
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full flex flex-col text-left">
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
                  <div className="absolute -top-8 -right-8 w-24 h-24 z-0 opacity-20 pointer-events-none rotate-12">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-[#c9a45c]"><path d="M0 0 L100 100 L100 0 Z" /></svg>
                  </div>
                  <div className="absolute bottom-0 left-0 opacity-[0.03] pointer-events-none">
                    <GraduationCap className="w-32 h-32 text-[#1a2b4c]" />
                  </div>

                  <div className="relative flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f8e4b3] to-[#d4af37] flex items-center justify-center shadow-sm">
                        <Gift className="w-5 h-5 text-[#1a2b4c]" />
                      </div>
                      <h3 className="text-xl sm:text-2xl text-[#1a2b4c] font-script leading-none pt-1">
                        Захидал {currentArchiveIndex + 1}/{archivedLetters.length}
                      </h3>
                    </div>
                    <button onClick={() => setViewingArchiveType(null)} className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors shadow-sm relative z-40">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                
                  <div className={cn("relative px-2 py-1 transition-all duration-500", isLocked && "blur-md select-none")}>
                    <p className="text-base sm:text-lg text-stone-700 italic leading-relaxed font-serif text-justify">
                      &ldquo;{archivedLetters[currentArchiveIndex].content || "Агуулга байхгүй байна."}&rdquo;
                    </p>
                  </div>

                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                      <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-900/10 shadow-sm flex items-center gap-2">
                        <Lock className="w-3 h-3 text-[#1f2d5a]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1f2d5a]">ЦАГ НЬ ИРЭХЭД ХАРАГДАХ БОЛНО.....</span>
                      </div>
                    </div>
                  )}
                
                  <div className="pt-3 mt-4 border-t border-stone-200 flex items-center justify-between relative z-40">
                    <div className="w-8">
                      {archivedLetters.length > 1 && (
                        <button
                          disabled={currentArchiveIndex === 0}
                          onClick={() => setCurrentArchiveIndex(prev => prev - 1)}
                          className="p-1 rounded-full text-stone-400 hover:bg-stone-100 transition-colors disabled:opacity-0"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-3 flex-1 px-2">
                      <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[#c9a45c] max-w-[40px] sm:max-w-[60px]" />
                      <p className="text-xl sm:text-2xl text-[#1f2d5a] font-script leading-none pt-1 whitespace-nowrap">
                        {archivedLetters[currentArchiveIndex].author}
                      </p>
                      <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[#c9a45c] max-w-[40px] sm:max-w-[60px]" />
                    </div>
                    <div className="w-8 flex justify-end">
                      {archivedLetters.length > 1 && (
                        <button
                          disabled={currentArchiveIndex === archivedLetters.length - 1}
                          onClick={() => setCurrentArchiveIndex(prev => prev + 1)}
                          className="p-1 rounded-full text-stone-400 hover:bg-stone-100 transition-colors disabled:opacity-0"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <AnimatePresence>
                {!isLocked && particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
                    animate={{ opacity: 0, x: Math.cos(particle.angle) * particle.distance, y: Math.sin(particle.angle) * particle.distance, scale: particle.scale, rotate: particle.rotation }}
                    transition={{ duration: 2.8, delay: particle.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute left-1/2 top-1/2 text-5xl pointer-events-none z-[130]"
                  >{particle.emoji}</motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
