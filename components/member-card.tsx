"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Heart, MessageCircle, X, Send, Pencil, Save, Camera, Upload, Instagram, Mail, Plus, PenLine, GraduationCap, ChevronLeft, ChevronRight, MailOpen } from "lucide-react"
import Image from "next/image"
import { useState, useRef, memo, useCallback, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface Member {
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
  status?: "approved" | "pending"
}

interface Comment {
  id: string
  author: string
  text: string
  time: string
}

interface MemberCardProps {
  member: Member
  index: number
  onLike: (memberId: string) => void
  onComment: (memberId: string, comment: string) => void
  onUpdate?: (memberId: string, updatedData: Partial<Member>) => void
  isLiked?: boolean
  currentUser: Member | null
  isCurrentUser?: boolean
}

const EditProfileModal = memo(({ 
  isOpen, 
  onClose, 
  member, 
  onUpdate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  member: Member; 
  onUpdate: (data: Partial<Member>) => void 
}) => {
  const [editedMember, setEditedMember] = useState({
    name: member.name,
    nickname: member.nickname,
    quote: member.quote,
    avatar: member.avatar,
    tags: (member.tags || []).join(", "),
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditedMember(prev => ({ ...prev, avatar: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onUpdate({
      ...editedMember,
      tags: editedMember.tags.split(",").map(t => t.trim()).filter(Boolean),
    })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }} 
            onClick={(e) => e.stopPropagation()} 
            className="w-full max-w-md bg-card rounded-2xl p-6 overflow-y-auto max-h-[90vh] shadow-lg border border-border"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground font-serif">Профайл засах</h3>
              <button onClick={onClose} aria-label="Close profile editor" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center gap-4 mb-6">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" aria-label="Upload profile photo" className="hidden" />
                <div 
                  className="relative w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-primary/20 cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image src={editedMember.avatar} alt="Avatar" fill className="object-cover" />
                  {/* <div className="vintage-overlay" /> */}
                  <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-6 h-6 text-white/90 mb-1" />
                    <span className="text-[8px] text-white/90 font-bold uppercase">Солих</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-sans">Зураг дээр дарж шинэчилнэ үү</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">Нэр</label>
                  <Input value={editedMember.name} onChange={(e) => setEditedMember(p => ({ ...p, name: e.target.value }))} className="bg-input border-border h-10 text-sm rounded-xl text-foreground placeholder:text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">Instagram хаяг</label>
                  <Input value={editedMember.nickname} onChange={(e) => setEditedMember(p => ({ ...p, nickname: e.target.value }))} className="bg-input border-border h-10 text-sm rounded-xl text-foreground placeholder:text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">Ишлэл</label>
                <Input value={editedMember.quote} onChange={(e) => setEditedMember(p => ({ ...p, quote: e.target.value }))} className="bg-input border-border h-10 text-sm rounded-xl text-foreground placeholder:text-muted-foreground" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">Сонирхол / Хобби (таслалаар)</label>
                <Input value={editedMember.tags} onChange={(e) => setEditedMember(p => ({ ...p, tags: e.target.value }))} placeholder="Сагс, Код бичих, Аялал..." className="bg-input border-border h-10 text-sm rounded-xl text-foreground placeholder:text-muted-foreground" />
              </div>

              <Button onClick={handleSave} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold mt-4 shadow-md rounded-xl">
                <Save className="w-4 h-4 mr-2" />
                Өөрчлөлтийг хадгалах
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})
EditProfileModal.displayName = "EditProfileModal"

const InvitationEnvelope = ({ comment, onClose }: { comment: Comment, onClose: () => void }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="relative w-full max-w-[480px] aspect-[5/3.8] envelope-container cursor-pointer mx-auto"
      onClick={() => setIsOpen(!isOpen)}
    >
       {/* Background Shadows */}
       <div className="absolute inset-0 bg-black/10 blur-2xl -z-10 translate-y-8 scale-95" />

       {/* Letter Card (slides out) */}
       <motion.div 
         className={cn(
           "absolute inset-x-6 top-4 bottom-4 bg-[#F6F1EA] rounded-sm p-8 shadow-inner border border-stone-200 z-10 letter-slide-out overflow-hidden",
           isOpen && "letter-open"
         )}
       >
         <div className="h-full flex flex-col justify-between border-2 border-[#1D3763]/10 p-6 relative">
            <div className="space-y-6 text-center">
              <div className="w-12 h-12 border-2 border-[#1D3763] rounded-full flex items-center justify-center mx-auto mb-4">
                 <GraduationCap className="w-6 h-6 text-[#1D3763]" />
              </div>
              <p className="text-xl sm:text-2xl font-sans text-[#1f2d5a] font-black tracking-tight">Хүндэт төгсөгч танаа</p>
              <div className="w-20 h-px bg-[#1D3763]/20 mx-auto" />
              <p className="text-sm sm:text-base text-stone-800 italic leading-relaxed font-serif px-2 line-clamp-6 sm:line-clamp-none">
                &ldquo;{comment.text}&rdquo;
              </p>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-sm font-bold text-[#1D3763] font-serif uppercase tracking-widest">-{comment.author}-</p>
              <p className="text-[10px] text-stone-500 mt-1 font-sans">{comment.time}</p>
            </div>
         </div>
       </motion.div>

       {/* Envelope Body */}
       <div className="absolute inset-0 luxury-envelope-texture rounded-[2px] z-20 luxury-shadow overflow-hidden">
         {/* Top Flap */}
         <div className={cn(
           "absolute inset-0 luxury-envelope-texture rounded-sm flap-transition z-30",
           isOpen && "flap-open"
         )}
         style={{ clipPath: "polygon(0 0, 100% 0, 50% 50%)", filter: "brightness(1.1)" }}
         />
         
         {/* Front Design (when closed) */}
         <AnimatePresence>
           {!isOpen && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 flex flex-col items-center justify-center z-40"
             >
                <p className="font-serif text-[#f5f1ec]/60 text-2xl sm:text-3xl mb-10 -rotate-2 select-none font-bold">
                  Урилга ирлээ
                </p>

                <div className="w-20 h-20 rounded-full wax-seal flex items-center justify-center relative mb-4">
                   {/* Laurel Wreath Emblem */}
                   <svg viewBox="0 0 100 100" className="w-12 h-12 text-[#1f2d5a]/20 fill-current">
                     <path d="M30 70c-10-5-15-15-15-25 0-10 5-20 15-25M70 70c10-5 15-15 15-25 0-10-5-20-15-25" fill="none" stroke="currentColor" strokeWidth="2.5" />
                     <path d="M42 45l8-8 8 8M50 37v20" fill="none" stroke="currentColor" strokeWidth="2.5" />
                     <path d="M40 60h20M45 65h10" fill="none" stroke="currentColor" strokeWidth="2" />
                   </svg>
                   <div className="absolute -top-1 opacity-40">
                      <GraduationCap className="w-4 h-4 text-[#1f2d5a]" />
                   </div>
                </div>
                
                <p className="text-[10px] text-[#f5f1ec]/40 uppercase tracking-[0.4em] mt-6 font-serif font-bold">
                  Class of 2024
                </p>
             </motion.div>
           )}
         </AnimatePresence>

         <div className="absolute inset-0 z-20 pointer-events-none" 
           style={{ 
             background: "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
             clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 50% 50%)"
           }} 
         />
       </div>
    </div>
  )
}

export function MemberCard({ member, index, onLike, onComment, onUpdate, isLiked, currentUser, isCurrentUser }: MemberCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentCommentIndex, setCurrentCommentIndex] = useState<number | null>(null)
  const [newComment, setNewComment] = useState("") 
  const [particles, setParticles] = useState<any[]>([])

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

  useEffect(() => { // Trigger particles when letter modal opens
    if (currentCommentIndex !== null) {
      createParticles();
    } else {
      setParticles([])
    }
  }, [currentCommentIndex, createParticles]);

  const handleComment = () => {
    if (!newComment.trim()) return
    onComment(member.id, newComment)
    setNewComment("")
  }

  // Subtle rotation only for a small organic feel, not to break layout
  const rotation = useMemo(() => (index % 2 === 0 ? -0.5 : 0.5), [index])

  return (
    <>
      {/* Visual Connector - Golden Chains (Гинжин холбоос) - Bridges the gap between cards */}
      <div className={cn(
        "flex justify-between w-full px-12 h-8 relative z-0",
        index === 0 ? "-mt-8" : "-mt-2"
      )}>
        <div className="w-1.5 h-full bg-gradient-to-b from-[#c9a45c] via-[#f8e4b3] to-[#c9a45c] shadow-[0_1px_2px_rgba(0,0,0,0.1)] rounded-full border-x border-[#8b6914]/20" />
        <div className="w-1.5 h-full bg-gradient-to-b from-[#c9a45c] via-[#f8e4b3] to-[#c9a45c] shadow-[0_1px_2px_rgba(0,0,0,0.1)] rounded-full border-x border-[#8b6914]/20" />
      </div>

      <motion.div
        className="relative mb-0 mx-2"
        style={{ rotate: `${rotation}deg` }}
      >
        {/* Ornate Picture Frame (Jaaz) - Deep Blue and Gold */}
        <div className="absolute -inset-[8px] pointer-events-none z-0 rounded-[25px] overflow-hidden shadow-2xl">
          {/* Frame Base: Deep Blue */}
          <div className="absolute inset-0 bg-[#1f2d5a]" />
          
          {/* Frame Depth/Shadow for realistic look */}
          <div className="absolute inset-0 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1),inset_0_-2px_10px_rgba(0,0,0,0.5)]" />

          {/* Golden Edging (Altan Emjeer) */}
          <div className="absolute inset-[5px] border-2 border-[#c9a45c]/60 rounded-[22px]" />
          <div className="absolute inset-[9px] border-[1px] border-[#c9a45c]/40 rounded-[19px]" />

          {/* Decorative Corner Ornaments */}
          {[0, 90, 180, 270].map((rot, i) => (
            <svg 
              key={i}
              className={cn(
                "absolute w-14 h-14 text-[#c9a45c]",
                rot === 0 && "top-0 left-0",
                rot === 90 && "top-0 right-0 rotate-90",
                rot === 180 && "bottom-0 right-0 rotate-180",
                rot === 270 && "bottom-0 left-0 -rotate-90"
              )} 
              viewBox="0 0 50 50" fill="currentColor"
            >
               <path d="M2 2 L2 35 Q2 2 35 2 L2 2 Z" opacity="0.8" />
               <path d="M6 6 Q6 18 18 6 L6 6 Z" fill="#f8e4b3" opacity="0.6" />
               <circle cx="8" cy="8" r="2" fill="#f8e4b3" />
            </svg>
          ))}
        </div>

        <div className="bg-card rounded-xl shadow-md border border-stone-200/60 p-5 flex flex-col gap-4 transition-all hover:shadow-lg relative overflow-hidden group z-10">
          
          {/* Subtle Notebook Texture Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]" 
            style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px)`, backgroundSize: '100% 24px' }}
          />

          <div className="flex items-center gap-4 relative z-20">
            {/* Profile Photo Section (Compact Polaroid) */}
            <div className="flex-shrink-0">
              <div 
                className="bg-white p-3 pb-8 shadow-md border border-stone-100 relative w-32 sm:w-40 transition-all duration-300 group-hover:rotate-0"
                style={{ rotate: '-2deg' }}
              >
                <div className="relative aspect-[1/1] overflow-hidden bg-stone-100">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Heart Stamp (Floating on Photo) */}
                <motion.button
                  onClick={(e) => { e.stopPropagation(); onLike(member.id); }}
                  whileTap={{ scale: 0.9 }}
                  key={member.id + (isLiked ? "-liked-floating" : "-unliked-floating")} // Add key to force re-animation
                  initial={isLiked ? { scale: 0.8 } : { scale: 1 }} // Start smaller if liked
                  animate={{ scale: 1 }} // Always animate to normal size
                  transition={{ type: "spring", stiffness: 400, damping: 12 }} // Apply spring transition
                  className={cn(
                    "absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full flex items-center justify-center border shadow-md transition-all z-20 group/heart",
                    isLiked 
                      ? "bg-[#ff2d55] border-[#ff2d55] text-white" 
                      : "bg-white border-stone-200 text-stone-300 hover:text-[#ff2d55] hover:border-[#ff2d55]/30"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                </motion.button>
              </div>
            </div>

            {/* Student Info - Centered Column */}
            <div className="flex-1 min-w-0 flex flex-col justify-center items-center text-center relative py-1">
              <div className="flex items-center justify-center gap-2 w-full">
                <h3 className="text-xl sm:text-2xl font-serif font-black text-[#1f2d5a] leading-tight tracking-tight">
                  {member.name}
                </h3>
                {isCurrentUser && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowEditModal(true); }}
                    className="p-1 rounded-full bg-stone-100/50 text-stone-400 hover:bg-primary hover:text-white transition-all shrink-0"
                    title="Засах"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[#c9a45c] mt-1 font-sans font-bold uppercase tracking-[0.15em] text-[10px] sm:text-xs w-full">
                <Instagram className="w-3 h-3 shrink-0" />
                <span className="truncate">@{member.nickname}</span>
              </div>

              {/* Separator Line */}
              <div className="flex items-center justify-center gap-2 my-2 w-full">
                <div className="flex-1 h-px bg-[#c9a45c]/60" />
                <div className="flex-1 h-px bg-[#c9a45c]/60" />
              </div>

              {/* Tags (Interests) - Styled like dashboard pills */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-0 w-full">
                {(member.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[9px] font-sans font-black uppercase tracking-widest bg-[#c9a45c]/10 text-[#1f2d5a] rounded-full border border-[#c9a45c]/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              </div>
            </div>

          {/* Compact Quote & Content */}
          <div className="space-y-3 relative z-10">
            <p 
              className="text-base sm:text-lg text-stone-700 leading-relaxed line-clamp-2 italic text-justify font-serif"
              style={{ fontFamily: 'var(--font-lora), serif' }}
            >
              &ldquo;{member.quote}&rdquo;
            </p>
          </div>

          {/* Footer - Actions (Aligned horizontally) */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-100 relative z-10">
            <div className={cn(
              "flex items-center gap-2 font-sans font-bold text-base uppercase tracking-[0.2em] lining-nums tabular-nums transition-colors duration-300",
              isLiked ? "text-[#ff2d55]" : "text-stone-500"
            )}>
              <motion.div
                key={isLiked ? "liked" : "unliked"}
                initial={isLiked ? { scale: 0.8 } : { scale: 1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
              </motion.div>
              <span>{member.likes + (isLiked ? 1 : 0)}</span>
            </div>

            {/* Read Letters - Mini Envelope Icon */}
            {member.comments && member.comments.length > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentCommentIndex(0); }}
                className="relative w-11 h-8 bg-[#14213d] rounded-sm shadow-md group/env border border-white/10 overflow-visible"
                title="Захидал унших"
              >
                {/* Envelope Visual - Inner container to fix pointy corners while allowing count badge to overflow */}
                <div className="absolute inset-0 rounded-sm overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 z-10" style={{ clipPath: "polygon(0 0, 100% 0, 50% 50%)", background: "#1c2a43", borderBottom: "1px solid rgba(0,0,0,0.1)" }} />
                </div>
                {/* Wax Seal - Absolutely centered using percentages and transforms to guarantee alignment across all cards */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#f8e4b3] to-[#c9a45c] shadow-sm ring-1 ring-black/10 flex items-center justify-center pointer-events-none">
                  <GraduationCap size={8} className="text-[#14213d]" strokeWidth={2.5} />
                </div>
                {/* Count badge */}
                <span className="absolute -top-2.5 -right-2.5 bg-[#ff2d55] text-white text-[8px] font-sans font-black w-5 h-5 rounded-full flex items-center justify-center border border-white z-30 shadow-sm">
                  {member.comments.length}
                </span>
              </button>
            )}

            <motion.button
              onClick={(e) => { e.stopPropagation(); setShowComments(true); }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1f2d5a] text-white shadow-md text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-[#2a4178]"
            >
              <PenLine className="w-3 h-3" />
              Захидал бичих
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Letter View Modal (Similar to Teacher Message style) */}
      <AnimatePresence>
        {currentCommentIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white/5 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setCurrentCommentIndex(null)}
          >
            <div className="relative w-full max-w-sm flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-[calc(100%-2rem)] max-w-sm flex relative overflow-hidden bg-card rounded-3xl px-4 sm:px-6 py-4 text-center shadow-2xl border border-border min-h-[220px]"
              >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full flex flex-col text-left"
              >
                  {/* Decorative Background */}
                  {/* Removed existing decorative background */}

                  {/* Luxury Cream Paper Texture */}
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

                  {/* Decorative Corner Ribbon */}
                  <div className="absolute -top-8 -right-8 w-24 h-24 z-0 opacity-20 pointer-events-none rotate-12">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-[#c9a45c]">
                      <path d="M0 0 L100 100 L100 0 Z" />
                    </svg>
                  </div>

                  {/* Subtle Watermark Decoration */}
                  <div className="absolute bottom-0 left-0 opacity-[0.03] pointer-events-none">
                    <GraduationCap className="w-32 h-32 text-[#1a2b4c]" />
                  </div>

                  <div className="relative flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f8e4b3] to-[#d4af37] flex items-center justify-center shadow-sm">
                        <GraduationCap className="w-5 h-5 text-[#1a2b4c]" />
                      </div>
                      <h3 className="text-xl sm:text-2xl text-[#1a2b4c] font-script leading-none pt-1">Захидал {currentCommentIndex + 1}/{member.comments.length}</h3>
                    </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCurrentCommentIndex(null); }}
                    aria-label="Close letter"
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors shadow-sm relative z-40"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  </div>
                
                <p className="text-base sm:text-lg text-stone-700 italic leading-relaxed font-serif text-justify px-2 py-1">
                  &ldquo;{member.comments[currentCommentIndex].text}&rdquo; 
                </p>
                
                <div className="pt-3 mt-2 border-t border-stone-200 flex items-center justify-between">
                  <div className="w-8">
                    {member.comments.length > 1 && (
                      <button
                        disabled={currentCommentIndex === 0}
                        onClick={(e) => { e.stopPropagation(); setCurrentCommentIndex(prev => prev! - 1); }}
                        className="p-1 rounded-full text-stone-400 hover:bg-stone-100 transition-colors disabled:opacity-0"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-3 flex-1 px-2">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-[#c9a45c] max-w-[40px] sm:max-w-[60px]" />
                    <p className="text-xl sm:text-2xl text-[#1f2d5a] font-script leading-none pt-1 whitespace-nowrap">
                      {member.comments[currentCommentIndex].author}
                    </p>
                    <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-[#c9a45c] max-w-[40px] sm:max-w-[60px]" />
                  </div>
                  <div className="w-8 flex justify-end">
                    {member.comments.length > 1 && (
                      <button
                        disabled={currentCommentIndex === member.comments.length - 1}
                        onClick={(e) => { e.stopPropagation(); setCurrentCommentIndex(prev => prev! + 1); }}
                        className="p-1 rounded-full text-stone-400 hover:bg-stone-100 transition-colors disabled:opacity-0"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                </motion.div>
              </motion.div>

              {/* Celebration Particles - Fireworks burst effect - Moved outside overflow-hidden to allow full spread over modal */}
              <AnimatePresence>
                {particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
                    animate={{ 
                      opacity: 0, 
                      x: Math.cos(particle.angle) * particle.distance, 
                      y: Math.sin(particle.angle) * particle.distance, 
                      scale: particle.scale, 
                      rotate: particle.rotation 
                    }}
                    transition={{ duration: 2.8, delay: particle.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute left-1/2 top-1/2 text-5xl pointer-events-none z-[130]"
                  >
                    {particle.emoji}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Write Letter Modal */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-white/5 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowComments(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
              className="w-[calc(100%-2rem)] max-w-md bg-card rounded-3xl p-6 relative overflow-hidden border border-border shadow-2xl"
            >
              {/* Luxury Cream Paper Texture */}
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

              {/* Decorative Background Spots - Matches Home Page Hero */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary blur-[80px]" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-accent blur-[60px]" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-left">
                    {/* Golden Graduation Cap Icon - Matches Teacher Message style */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f8e4b3] to-[#d4af37] flex items-center justify-center shadow-md border border-amber-900/10">
                      <GraduationCap className="w-6 h-6 text-[#14213d]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1f2d5a] font-serif tracking-tight">Захидал бичих</h3>
                      <p className="text-xs text-muted-foreground font-sans"><span className="font-bold text-primary">{member.name}</span>-д зориулж</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowComments(false)}
                    aria-label="Close write letter" 
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors shadow-sm"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Сэтгэлийн үгээ энд бичнэ үү..."
                    className="bg-white/50 border-stone-200 min-h-[200px] text-base resize-none rounded-2xl focus:ring-primary/20 text-stone-800 placeholder:text-stone-400 font-serif italic p-5 shadow-inner"
                  />
                  
                  <Button 
                    onClick={() => {
                      handleComment();
                      setShowComments(false);
                    }}
                    disabled={!newComment.trim()}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/20 text-lg transition-all active:scale-[0.98]" 
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Захидал илгээх
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <EditProfileModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        member={member} 
        onUpdate={(data) => onUpdate?.(member.id, data)} 
      />
    </>
  )
}

interface MemberGridProps {
  members: Member[]
  likedMembers: Set<string>
  onLike: (memberId: string) => void
  onComment: (memberId: string, comment: string) => void
  onUpdate?: (memberId: string, updatedData: Partial<Member>) => void
  currentUser: Member | null
}

export function MemberGrid({ members, likedMembers, onLike, onComment, onUpdate, currentUser }: MemberGridProps) {
  return (
    <div className="flex flex-col gap-0 max-w-xl mx-auto pt-2">
      {members.map((member, index) => (
        <MemberCard 
          key={member.id} 
          member={member} 
          index={index}
          onLike={onLike}
          onComment={onComment}
          onUpdate={onUpdate}
          isLiked={likedMembers.has(member.id)}
          currentUser={currentUser}
          isCurrentUser={currentUser?.id === member.id}
        />
      ))}
    </div>
  )
}
