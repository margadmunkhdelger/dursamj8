"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Lock, Clock, Send, PenLine, Target, Heart, Mail, X, MapPin, Users, Award, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button" // Keep Button
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input" // Keep Input
import { useState, useRef, useEffect, useCallback } from "react"
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
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const selectedTypeData = capsuleTypes.find(t => t.id === selectedType)
  const SelectedIcon = selectedTypeData?.icon || Lock

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
    
    triggerRainingLetters(); // Trigger raining letters animation

    setTimeout(() => {
      setLetters(prev => [newLetter, ...prev])
      onWrite(content, selectedType)
      setContent("")
      setSelectedType(null)
    }, 500);

    setTimeout(() => {
      setRainingLetters([]); // Clear letters after they've fallen
    }, 5000); // 5 seconds to cover duration + delay
  }

  const lettersByType = (typeId: string) => letters.filter(l => l.type === typeId)

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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-4 sm:p-6 text-center relative overflow-hidden border border-border shadow-lg w-full max-w-md mx-auto"
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary blur-[80px]" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-accent blur-[60px]" />
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 space-y-3"
          >
            {groupName && (
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a45c] font-bold">
                {groupName}
              </p>
            )}
            <h1 className="text-2xl sm:text-4xl font-script text-foreground leading-[1.1] px-2">
              Бид дахин уулзахад нээгдэх захидлууд
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[#c9a45c] max-w-[60px]" />
              <p className="text-xs sm:text-sm font-sans font-bold text-[#1f2d5a] uppercase tracking-[0.2em] whitespace-nowrap lining-nums tabular-nums">
                {graduationYear} ОНЫ ТӨГСӨЛТ
              </p>
              <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[#c9a45c] max-w-[60px]" />
            </div>
          </motion.div>

          <CountdownTimer targetDate={reunionDate} title="Захидлууд нээгдэхэд..." />
        </div>
      </motion.div>

      {/* 4 Capsule Type Boxes */}
      <div className="grid grid-cols-2 gap-2">
        {capsuleTypes.map((type, index) => {
          const count = lettersByType(type.id).length
          return (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedType(type.id)}
              className="bg-card border border-border rounded-2xl p-4 text-left shadow-md hover:border-[#c9a45c] transition-all group relative overflow-hidden"
            >
              {/* Decorative background icon - Matches Home Dashboard */}
              <type.icon className="absolute -right-2 top-1/2 -translate-y-1/2 w-16 h-16 text-[#1f2d5a] opacity-[0.05] group-hover:opacity-10 transition-opacity" />

              <div className="relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#c9a45c]/10 flex items-center justify-center mb-3 group-hover:bg-[#c9a45c]/20 transition-colors border border-[#c9a45c]">
                  <type.icon className="w-4 h-4 text-[#1f2d5a]" />
                </div>
                <p className="text-2xl font-bold text-[#1f2d5a] leading-none font-mono tabular-nums">{count}</p>
                <p className="text-[9px] uppercase font-bold tracking-widest text-[#1f2d5a] font-sans mt-2 leading-tight">
                  {type.label}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Write Letter Modal Section - Styled like Profile Write Letter */}
      <AnimatePresence>
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-card rounded-3xl p-6 relative overflow-hidden border border-border shadow-2xl mt-4"
          >
            {/* Luxury Cream Paper Texture */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

            {/* Decorative Background Spots - Matches Home Page Hero */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary blur-[80px]" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-accent blur-[60px]" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f8e4b3] to-[#d4af37] flex items-center justify-center shadow-md border border-amber-900/10 shrink-0">
                    <SelectedIcon className="w-6 h-6 text-[#14213d]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1f2d5a] font-serif tracking-tight italic leading-snug text-justify">
                    {selectedType === "self"
                      ? "Ирээдүйн өөртөө хэлмээр байгаа зүйлсээ энд бичнэ үү !"
                      : selectedType === "goals"
                      ? "Ирээдүйн зорилгоо энд бичнэ үү !"
                      : selectedType === "prediction"
                      ? "Ирээдүйд хэн, юу, яаж болох талаар таамаглалаа энд бичнэ үү !"
                      : selectedType === "promise"
                      ? "Ангийнхандаа өгөх өөрийн амлалтаа энд бичнэ үү !"
                      : capsuleTypes.find(t => t.id === selectedType)?.label}
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
                            selectedType === "self"
                              ? "Хүндэт ирээдүйн би,\n\nБи чамд хэлэхийг хүссэн зүйл минь..."
                              : selectedType === "goals"
                              ? "Миний ирээдүйн зорилго бол..."
                              : selectedType === "prediction"
                              ? "Ирээдүйд ийм зүйл болно гэж таамаглаж байна..."
                              : "Би ирээдүйн өөртөө болон бусдад ийм амлалт өгч байна..."
                          }
                          className="bg-white/50 border-stone-200 min-h-[200px] text-base resize-none rounded-2xl focus:ring-primary/20 text-stone-800 placeholder:text-stone-400 font-serif italic p-5 shadow-inner"
                        />
                        
                          <Button
                            onClick={handleSubmit}
                            disabled={!content.trim()}
                            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/20 text-lg transition-all active:scale-[0.98]"
                          >
                            <Lock className="w-5 h-5 mr-2" />
                            Захидлыг түгжих
                          </Button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
