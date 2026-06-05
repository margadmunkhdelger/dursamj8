"use client"

import { motion, AnimatePresence } from "framer-motion";
import { Check, UserPlus, X, Clock, CheckCircle, XCircle, GraduationCap, Award, Camera, Upload } from "lucide-react";
import Image from "next/image"
import { useState, useMemo, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface Member {
  id: string
  name: string
  nickname: string
  avatar: string
  tags: string[]
  quote: string
  likes: number
  comments: Comment[]
  voiceNotes: number
  photos: number
  role?: "student" | "teacher" // New field for role
  status?: "approved" | "pending"
}

interface Comment {
  id: string
  author: string
  text: string
  time: string
}

interface ProfilePickerContentProps {
  members: Member[]
  onSelect: (member: Member) => void
  onRequestJoin: (memberData: Omit<Member, "id" | "likes" | "comments" | "voiceNotes" | "photos" | "status">) => void
  embedded?: boolean
}

// Polaroid card matching the reference image design
function PolaroidCard({ 
  member, 
  onSelect, 
  isTeacher = false,
  delay = 0
}: { 
  member: Member
  onSelect: (member: Member) => void
  isTeacher?: boolean
  delay?: number
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      whileHover={{ zIndex: 20 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(member)}
      className="relative flex flex-col items-center group z-10"
    >
      {/* White polaroid card with shadow */}
      <div className="bg-[#fdfdfd] p-1.5 pb-2.5 rounded-sm shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex flex-col items-center border border-[#1f2d5a]">
        {/* Photo container with gray background */}
        <div className={cn(
          "relative overflow-hidden bg-gray-200",
          isTeacher ? "w-20 h-24" : "w-[68px] h-[82px]"
        )}>
          <Image 
            src={member.avatar} 
            alt={member.name} 
            fill 
            className="object-cover" 
            sizes={isTeacher ? "80px" : "68px"} 
          />
        </div>
        {/* Name label - now inside the white frame */}
        <p className={cn(
          "mt-3 font-bold text-[#1f2d5a] uppercase tracking-widest text-center leading-tight font-serif",
          isTeacher ? "text-[9px] w-20" : "text-[8px] w-[68px]"
        )}>
          {member.name.toUpperCase()}
        </p>
      </div>
      
      {/* Student Graduation Cap Badge */}
      {!isTeacher && (
        <div className="absolute -top-2 -left-2 w-5 h-5 bg-[#1f2d5a] text-[#c9a45c] rounded-full shadow-md z-20 border border-[#c9a45c]/50 flex items-center justify-center leading-none">
          <GraduationCap size={11} strokeWidth={2.5} />
        </div>
      )}

      {/* Teacher badge */}
      {isTeacher && (
        <div className="absolute -top-2 -left-2 w-5 h-5 bg-[#1f2d5a] text-[#c9a45c] rounded-full shadow-md z-20 border border-[#c9a45c]/50 flex items-center justify-center leading-none">
          <Award size={11} strokeWidth={2.5} />
        </div>
      )}
    </motion.button>
  )
}

export function ProfilePickerContent({ members, onSelect, onRequestJoin, embedded = false }: ProfilePickerContentProps) {
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [newMember, setNewMember] = useState({
    name: "",
    nickname: "",
    quote: "",
    tags: "",
    avatar: "",
    role: "student", // Default to student
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { teachers, students } = useMemo(() => {
    const approved = members.filter((m) => m.status !== "pending")
    return {
      teachers: approved.filter(m => m.role === "teacher"), // Changed to filter for multiple teachers
      students: approved.filter(m => m.role !== "teacher") // Students are those not marked as teacher
    }
  }, [members])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewMember(prev => ({ ...prev, avatar: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleJoinSubmit = () => {
    if (!newMember.name || !newMember.nickname) return
    onRequestJoin({
      name: newMember.name,
      nickname: newMember.nickname,
      avatar: newMember.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newMember.nickname}`,
      tags: newMember.tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 3),
      quote: newMember.quote || "Энэхүү дурсамжийн цомогт нэгдэж байгаадаа баяртай байна!",
      role: newMember.role, // Pass the selected role
    })
    setNewMember({ name: "", nickname: "", quote: "", tags: "", avatar: "" })
    setShowJoinForm(false)
  }

  if (showJoinForm) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 24, filter: "blur(4px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="flex flex-col relative p-4 w-full my-auto"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h3 className="text-base font-bold text-foreground font-serif">Профайл нэмэх</h3>
          <button type="button" onClick={() => setShowJoinForm(false)} aria-label="Close join form" className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground">
            <X className="w-4 h-4" /> 
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 mb-4 shrink-0">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <div 
            className="relative w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-primary/10 cursor-pointer group bg-muted flex items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            {newMember.avatar ? (
              <Image src={newMember.avatar} alt="Preview" fill className="object-cover" />
            ) : (
              <Camera className="w-8 h-8 text-muted-foreground" />
            )}
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-5 h-5 text-white/90 mb-1" />
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-sans">Зураг оруулах</p>
        </div>

        {/* Role Selection */}
        <div className="space-y-1 mb-4 shrink-0">
          <label className="text-[9px] uppercase tracking-wider text-muted-foreground ml-1">Таны үүрэг *</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={newMember.role === "student" ? "default" : "outline"}
              onClick={() => setNewMember(p => ({ ...p, role: "student" }))}
              className="h-10 text-sm rounded-xl"
            >
              Сурагч
            </Button>
            <Button
              type="button"
              variant={newMember.role === "teacher" ? "default" : "outline"}
              onClick={() => setNewMember(p => ({ ...p, role: "teacher" }))}
              className="h-10 text-sm rounded-xl"
            >
              Багш
            </Button>
          </div>
        </div>

        <div className="space-y-3 relative z-10 min-w-0">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-muted-foreground ml-1">Таны нэр *</label>
              <Input value={newMember.name} onChange={(e) => setNewMember((p) => ({ ...p, name: e.target.value }))} placeholder="А. Болд" className="bg-input border-border h-10 text-sm rounded-xl focus:ring-primary/30 text-foreground placeholder:text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-muted-foreground ml-1">Instagram *</label>
              <Input value={newMember.nickname} onChange={(e) => setNewMember((p) => ({ ...p, nickname: e.target.value.toLowerCase().replace(/\s/g, "") }))} placeholder="boldoo" className="bg-input border-border h-10 text-sm rounded-xl focus:ring-primary/30 text-foreground placeholder:text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-wider text-muted-foreground ml-1">Ишлэл</label>
            <Input value={newMember.quote} onChange={(e) => setNewMember((p) => ({ ...p, quote: e.target.value }))} placeholder="Дурсамж бол мөнх..." className="bg-input border-border h-10 text-sm rounded-xl text-foreground placeholder:text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-wider text-muted-foreground ml-1">Тагууд</label>
            <Input value={newMember.tags} onChange={(e) => setNewMember((p) => ({ ...p, tags: e.target.value }))} placeholder="Сагс, Хөгжим" className="bg-input border-border h-10 text-sm rounded-xl text-foreground placeholder:text-muted-foreground" />
          </div>
        </div>
        <div className="mt-2 space-y-2 shrink-0 relative z-10">
          <Button onClick={handleJoinSubmit} disabled={!newMember.name || !newMember.nickname} className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg transition-all active:scale-95">
            <UserPlus className="w-4 h-4 mr-2" />
            Профайл нэмэх
          </Button>
          <p className="text-[8px] text-primary/70 text-center uppercase tracking-tight">Таны профайл шууд жагсаалтад харагдах болно</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col flex-1 relative overflow-hidden pointer-events-auto touch-manipulation"
    >
      {students.length === 0 && !teacher ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-6 min-h-[300px] relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20"
          >
            <UserPlus className="w-10 h-10 text-primary animate-pulse" />
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground tracking-tight">Анги хоосон байна</h3>
            <p className="text-xs text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
              Дурсамжийн хайрцагт анхны гишүүн болоорой!
            </p>
          </div>
          <Button
            onClick={() => setShowJoinForm(true)}
            size="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-11 rounded-xl glow-primary font-bold transition-all active:scale-95"
          >
            Анхны гишүүн болох
          </Button>
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0 relative z-10">
          {/* Title - always show for embedded view */}
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.06 }}
            className="text-center mb-3 shrink-0 relative z-10"
          >
            <h2 className={cn(
              "font-serif font-bold tracking-tight text-foreground uppercase tracking-[0.15em]",
              embedded ? "text-lg" : "text-xl"
            )}>
              {embedded ? "Манай Ангийнхан" : "Өөрийн профайлаа сонгоно уу"}
            </h2>
          </motion.div>

          {/* Scrapbook style container with beige background like reference */}
          <div 
            className="flex-1 overflow-y-auto min-h-0 px-3 py-4 rounded-lg scrollbar-hide"
          >
            {/* Teachers at top - centered */}
            {teachers.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 pb-2 mb-4">
                {teachers.map((teacherMember, idx) => (
                  <PolaroidCard 
                    key={teacherMember.id}
                    member={teacherMember} 
                    onSelect={onSelect} 
                    isTeacher 
                    delay={0.1 + idx * 0.03}
                  />
                ))}
              </div>
            )}

            {/* Divider with decorative elements - only if there are teachers AND students */}
            {teachers.length > 0 && students.length > 0 && (
              <div className="flex items-center justify-center gap-2 mb-3 px-2">
                <div className="flex-1 h-px bg-[#c9a45c]/60" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#1f2d5a] font-black">Сурагчид</span>
                <div className="flex-1 h-px bg-[#c9a45c]/60" />
              </div>
            )}

            {/* Students grid - 3 columns matching reference image */}
            <div className="grid grid-cols-3 gap-3 pb-2 place-items-center">
              {students.map((member, idx) => (
                <PolaroidCard 
                  key={member.id}
                  member={member} 
                  onSelect={onSelect} 
                  delay={0.15 + idx * 0.03}
                />
              ))}
            </div>
          </div>

          {/* Join button */}
          <div className="mt-3 pt-2 border-t border-stone-300 text-center shrink-0">
            <p className="text-[10px] text-muted-foreground font-sans mb-1.5">Жагсаалтад байхгүй юу?</p>
            <Button 
              onClick={() => setShowJoinForm(true)} 
              size="sm" 
              className="gap-2 h-9 px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold text-xs rounded-full transition-all active:scale-95 border-none"
            >
              <UserPlus className="w-3 h-3" />
              Профайл нэмэх
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

interface ProfilePickerProps {
  isOpen: boolean
  members: Member[]
  onSelect: (member: Member) => void
  onRequestJoin: (memberData: Omit<Member, "id" | "likes" | "comments" | "voiceNotes" | "photos" | "status">) => void
}

export function ProfilePicker({ isOpen, members, onSelect, onRequestJoin }: ProfilePickerProps) {
  if (!isOpen) return null
  return (
    <div className="h-full flex flex-col justify-center px-4 py-8 relative">
      <div className="w-full max-w-md mx-auto">
        <ProfilePickerContent members={members} onSelect={onSelect} onRequestJoin={onRequestJoin} />
      </div>
    </div>
  )
}

interface PendingMembersProps {
  pendingMembers: Member[]
  currentUser: Member | null
  onApprove: (memberId: string) => void
  onReject: (memberId: string) => void
}

export function PendingMembers({ pendingMembers, currentUser, onApprove, onReject }: PendingMembersProps) {
  if (pendingMembers.length === 0 || currentUser?.role !== "teacher") return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-3 mb-4 border border-border shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">Хүлээгдэж буй</h3>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{pendingMembers.length}</span>
      </div>
      <div className="space-y-2">
        {pendingMembers.map((member) => (
          <div key={member.id} className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image src={member.avatar} alt={member.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0 font-sans">
              <p className="text-xs font-medium text-foreground truncate">{member.name}</p>
              <p className="text-[10px] text-primary">@{member.nickname}</p>
            </div>
            <motion.div className="flex items-center gap-1">
              <button type="button" onClick={() => onApprove(member.id)} aria-label="Approve" className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-green-400" />
              </button>
              <button type="button" onClick={() => onReject(member.id)} aria-label="Reject" className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-3 h-3 text-red-400" />
              </button>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

interface CurrentUserBadgeProps {
  user: Member
  onSwitch: () => void
}

export function CurrentUserBadge({ user, onSwitch }: CurrentUserBadgeProps) {
  return (
    <motion.button 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      whileTap={{ scale: 0.98 }} 
      onClick={onSwitch} 
      className="fixed left-4 z-40 bg-card rounded-full px-2.5 py-1 flex items-center gap-1.5 max-w-[calc(100vw-2rem)] border border-border shadow-sm"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 60px)" }}
    >
      <div className="relative w-5 h-5 rounded-full overflow-hidden ring-2 ring-primary/50 shrink-0">
        <Image src={user.avatar} alt={user.name} fill className="object-cover" />
      </div>
      <span className="text-[10px] font-medium text-primary truncate">@{user.nickname}</span>
      <Check className="w-2.5 h-2.5 text-primary shrink-0" />
    </motion.button>
  )
}
