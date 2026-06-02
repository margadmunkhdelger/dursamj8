"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Lock, Unlock, Clock, Send, PenLine, Target, Heart, Sparkles, Mail, X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useState } from "react"
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

const capsuleTypes = [
  {
    id: "self",
    icon: PenLine,
    label: "Ирээдүйн өөртөө",
    subtitle: "Өөртөө бичих захидал",
    color: "amber",
    bgClass: "bg-amber-50 border-amber-200",
    iconClass: "text-amber-700",
    sealColor: "#c9a45c",
  },
  {
    id: "class",
    icon: Heart,
    label: "Ангийнхандаа",
    subtitle: "Найзууддаа үлдээх үг",
    color: "rose",
    bgClass: "bg-rose-50 border-rose-200",
    iconClass: "text-rose-700",
    sealColor: "#d4697a",
  },
  {
    id: "teacher",
    icon: Sparkles,
    label: "Багшдаа",
    subtitle: "Багшдаа зориулсан захидал",
    color: "blue",
    bgClass: "bg-blue-50 border-blue-200",
    iconClass: "text-blue-700",
    sealColor: "#4a7cb5",
  },
  {
    id: "dream",
    icon: Target,
    label: "10 жилийн дараах мөрөөдөл",
    subtitle: "Ирээдүйд биелүүлэх хүсэл",
    color: "emerald",
    bgClass: "bg-emerald-50 border-emerald-200",
    iconClass: "text-emerald-700",
    sealColor: "#2d8a6e",
  },
]

// Letter flying into box animation
function FlyingEnvelope({ targetId, onComplete }: { targetId: string; onComplete: () => void }) {
  return (
    <motion.div
      className="fixed z-[200] pointer-events-none"
      initial={{ opacity: 1, scale: 1, x: "50vw", y: "50vh", rotate: 0 }}
      animate={{ opacity: 0, scale: 0.2, x: "50vw", y: "30vh", rotate: -15 }}
      transition={{ duration: 0.7, ease: [0.32, 0, 0.67, 0] }}
      onAnimationComplete={onComplete}
    >
      <div className="w-12 h-8 rounded-sm flex items-center justify-center shadow-xl"
        style={{ background: "linear-gradient(135deg, #8b6b2a, #c9a45c)" }}>
        <Mail className="w-5 h-5 text-white/80" />
      </div>
    </motion.div>
  )
}

export function TimeCapsule({ reunionDate, onWrite, reunionLocationDetails, schoolName, groupName, graduationYear }: TimeCapsuleProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [letterTitle, setLetterTitle] = useState("")
  const [openDate, setOpenDate] = useState("")
  const [letters, setLetters] = useState<CapsuleLetter[]>([
    {
      id: "l1",
      type: "self",
      title: "Ирээдүйн өөртөө бичих захидал",
      content: "",
      author: "Сарангуа",
      openDate: "2034-05-28",
      createdAt: "2024 оны 1-р сарын 15",
    },
    {
      id: "l2",
      type: "dream",
      title: "Миний хүсэл мөрөөдөл",
      content: "",
      author: "Мишээл",
      openDate: "2034-05-28",
      createdAt: "2024 оны 2-р сарын 20",
    },
  ])
  const [showFlyingEnvelope, setShowFlyingEnvelope] = useState(false)
  const [flyingTarget, setFlyingTarget] = useState("")

  const handleSubmit = () => {
    if (!content.trim() || !selectedType || !author.trim()) return
    const newLetter: CapsuleLetter = {
      id: `l${Date.now()}`,
      type: selectedType,
      title: letterTitle || capsuleTypes.find(t => t.id === selectedType)?.label || "",
      content,
      author,
      openDate: openDate || "2034-05-28",
      createdAt: new Date().toLocaleDateString("mn-MN", { year: "numeric", month: "long", day: "numeric" }),
    }
    setFlyingTarget(selectedType)
    setShowFlyingEnvelope(true)
    setTimeout(() => {
      setLetters(prev => [newLetter, ...prev])
      onWrite(content, selectedType)
      setContent("")
      setLetterTitle("")
      setAuthor("")
      setOpenDate("")
      setSelectedType(null)
    }, 500)
  }

  const lettersByType = (typeId: string) => letters.filter(l => l.type === typeId)

  return (
    <div className="space-y-5">
      {/* Flying envelope animation */}
      <AnimatePresence>
        {showFlyingEnvelope && (
          <FlyingEnvelope
            targetId={flyingTarget}
            onComplete={() => setShowFlyingEnvelope(false)}
          />
        )}
      </AnimatePresence>

      {/* Countdown Header - Restyled to match Home Page Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-4 sm:p-6 text-center relative overflow-hidden border border-border shadow-lg"
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
            <div className="flex items-center justify-center gap-2 mb-1">
              <Lock className="w-3.5 h-3.5 text-[#c9a45c]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#c9a45c] font-bold">
                Цаг хугацааны капсул
              </span>
            </div>

            {groupName && (
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#c9a45c] font-bold">
                {groupName}
              </p>
            )}
            <h1 className="text-3xl sm:text-5xl font-script text-foreground leading-[1.1] px-2">
              {schoolName || "Шинэ Монгол Технологийн Коллеж"}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[#c9a45c] max-w-[60px]" />
              <p className="text-xs sm:text-sm font-sans font-bold text-[#1f2d5a] uppercase tracking-[0.2em] whitespace-nowrap lining-nums tabular-nums">
                {graduationYear} ОНЫ ТӨГСӨЛТ
              </p>
              <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[#c9a45c] max-w-[60px]" />
            </div>
          </motion.div>

          <CountdownTimer targetDate={reunionDate} />

          <div className="mt-4 pt-4 border-t border-border/50 space-y-1">
            <p className="text-[10px] text-muted-foreground font-sans">
              Нээгдэх өдөр: {reunionDate.toLocaleDateString("mn-MN", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            {reunionLocationDetails && (
              <p className="text-[10px] text-[#c9a45c] font-sans flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3" />
                Уулзах газар: <span className="font-bold">{reunionLocationDetails.name}</span>
              </p>
            )}
            {reunionLocationDetails && (
              <p className="text-[9px] text-muted-foreground font-sans italic">
                {reunionLocationDetails.address}
              </p>
            )}
            <p className="text-[9px] text-muted-foreground mt-2 font-sans italic opacity-70">
              Өнөөдрийн захидал, мөрөөдөл, дурсамжууд товлосон өдөр нээгдэнэ.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 4 Capsule Type Boxes */}
      <div className="space-y-3">
        {capsuleTypes.map((type, index) => {
          const count = lettersByType(type.id).length
          return (
            <motion.div
              key={type.id}
              id={`capsule-${type.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`rounded-2xl border p-4 ${type.bgClass}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Wax seal / envelope icon */}
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-white/60"
                    style={{ background: `radial-gradient(circle at 35% 35%, ${type.sealColor}cc, ${type.sealColor})` }}>
                    <type.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-foreground font-serif leading-tight">{type.label}</h3>
                    <p className="text-xs text-muted-foreground font-sans mt-0.5">{type.subtitle}</p>
                    {count > 0 && (
                      <p className="text-[10px] text-muted-foreground/70 font-sans mt-1">
                        {count} захидал хадгалагдсан
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                  variant={selectedType === type.id ? "default" : "outline"}
                  className="shrink-0 h-8 text-xs font-sans font-semibold"
                >
                  <PenLine className="w-3 h-3 mr-1" />
                  Бичих
                </Button>
              </div>

              {/* Letters count chips */}
              {count > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {lettersByType(type.id).map(letter => (
                    <div key={letter.id} className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/60 border border-white/40 backdrop-blur-sm">
                      <Mail className="w-2.5 h-2.5 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground font-sans truncate max-w-[80px]">{letter.author}</span>
                      <Lock className="w-2 h-2 text-muted-foreground/50" />
                    </div>
                  ))}
                </div>
              )}

              {/* Writing form - expands inline */}
              <AnimatePresence>
                {selectedType === type.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-white/40 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-sans">Таны нэр</label>
                          <Input
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Нэрээ оруулна уу"
                            className="bg-white/70 border-white/50 h-9 text-sm mt-1 font-sans text-foreground placeholder:text-muted-foreground"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-sans">Гарчиг</label>
                          <Input
                            value={letterTitle}
                            onChange={(e) => setLetterTitle(e.target.value)}
                            placeholder="Захианы гарчиг"
                            className="bg-white/70 border-white/50 h-9 text-sm mt-1 font-sans text-foreground placeholder:text-muted-foreground"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-sans">Захиа</label>
                        <Textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder={
                            type.id === "self"
                              ? "Хүндэт ирээдүйн би,\n\nБи чамд хэлэхийг хүссэн зүйл минь..."
                              : type.id === "class"
                              ? "Хайрт найзуудаа,\n\nТа нарт хэлэхийг хүссэн зүйл..."
                              : type.id === "teacher"
                              ? "Хүндэт багш минь,\n\n..."
                              : "10 жилийн дараа намайг..."
                          }
                          className="bg-white/70 border-white/50 min-h-[120px] text-sm mt-1 resize-none font-serif text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wide text-muted-foreground font-sans">Нээгдэх өдөр</label>
                        <Input
                          type="date"
                          value={openDate}
                          onChange={(e) => setOpenDate(e.target.value)}
                          className="bg-white/70 border-white/50 h-9 text-sm mt-1 font-sans text-foreground"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSubmit}
                          disabled={!content.trim() || !author.trim()}
                          className="flex-1 h-10 font-bold font-sans text-sm"
                          style={{ background: type.sealColor }}
                        >
                          <Lock className="w-3.5 h-3.5 mr-1.5" />
                          Капсулд хадгалах
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedType(null)}
                          className="h-10 w-10 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Unlocked area */}
      <div className="space-y-3">
        <h3 className="text-sm text-muted-foreground font-sans flex items-center gap-2">
          <Unlock className="w-4 h-4" />
          Нээгдсэн дурсамжууд
        </h3>
        <div className="glass-card rounded-xl p-4 text-center text-muted-foreground">
          <Sparkles className="w-7 h-7 mx-auto mb-2 text-primary/40" />
          <p className="text-sm font-sans">Одоогоор нээгдсэн зурвас алга</p>
          <p className="text-xs mt-1 font-sans">Таны захидлууд хугацаа нь дууссаны дараа энд харагдах болно</p>
        </div>
      </div>
    </div>
  )
}
