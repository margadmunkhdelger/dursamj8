"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Heart, MessageCircle, X, Send, Pencil, Save, Camera, Upload, Instagram, Mail, Plus, PenLine, GraduationCap } from "lucide-react"
import Image from "next/image"
import { useState, useRef, memo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Member {
  id: string
  name: string
  nickname: string
  avatar: string
  tags: string[]
  quote: string
  dreamJob?: string
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
    dreamJob: member.dreamJob || "",
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
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground ml-1">Мөрөөдлийн мэргэжил</label>
                <Input value={editedMember.dreamJob} onChange={(e) => setEditedMember(p => ({ ...p, dreamJob: e.target.value }))} className="bg-input border-border h-10 text-sm rounded-xl text-foreground placeholder:text-muted-foreground" />
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
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState("")

  const handleComment = () => {
    if (!newComment.trim()) return
    onComment(member.id, newComment)
    setNewComment("")
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -4 }}
        className="bg-card border border-border rounded-2xl p-4 cursor-pointer group relative shadow-sm"
      >
        <div className="flex items-start gap-3 sm:gap-5">
          {/* Avatar */}
          <motion.div
            className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-[1.2rem] sm:rounded-[1.5rem] overflow-hidden flex-shrink-0"
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-muted" />
            <Image
              src={member.avatar}
              alt={member.name}
              fill
              className="object-cover"
            />
            {/* <div className="vintage-overlay" /> */}
            <div className="absolute inset-0 ring-1 ring-black/5 rounded-[1.5rem]" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground truncate">{member.name}</h3>
                  {isCurrentUser && (
                    <button
                      onClick={(e) => { 
                        e.stopPropagation()
                        setShowEditModal(true)
                      }}
                      aria-label="Edit profile"
                      className="p-2 rounded-[1.5rem] bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div> 
                <div className="flex items-center gap-1 text-amber-700/80 mt-1">
                  <Instagram className="w-3 h-3" />
                  <p className="text-sm truncate">@{member.nickname}</p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onLike(member.id)
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-muted transition-colors ${isLiked ? 'text-accent' : 'text-muted-foreground hover:text-accent'}`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs sm:text-sm font-bold">{member.likes + (isLiked ? 1 : 0)}</span>
              </button>
            </div>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-stone-600 italic line-clamp-3 text-justify font-serif">
              &ldquo;{member.quote}&rdquo; 
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          {(member.tags || []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex flex-shrink-0 items-center whitespace-nowrap text-[10px] px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Letters Section */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold ml-1">Захидлууд</p>
            <motion.button 
              onClick={(e) => { 
                e.stopPropagation()
                setShowComments(true)
              }}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-all border border-primary/10 group/write"
            >
              <PenLine className="w-2.5 h-2.5 group-hover/write:rotate-12 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Захидал бичих</span>
            </motion.button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {member.comments.length === 0 ? (
              <p className="text-[10px] text-stone-400 italic ml-1 font-serif">Одоогоор захидал ирээгүй байна...</p>
            ) : (
              member.comments.map((comment) => (
                <motion.button
                  key={comment.id}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedComment(comment)
                  }}
                  className="relative group" 
                >
                  <div className="w-9 h-9 rounded-md bg-[#1D3763] flex items-center justify-center border border-white/10 group-hover:border-[#d4af37]/50 transition-all shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-white/10" />
                    <Mail className="w-4 h-4 text-white/50" />
                    <div className="absolute w-1.5 h-1.5 rounded-full bg-[#d4af37] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_5px_rgba(212,175,55,0.5)]" />
                  </div>
                  <div className="absolute -top-1.5 -left-1 px-1.5 py-0.5 rounded-md bg-primary border border-border text-[7px] font-bold text-primary-foreground shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {comment.author}
                  </div>
                </motion.button>
              ))
            )}
          </div>
        </div>

        {/* Hover Glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: "0 0 20px rgba(var(--primary-rgb), 0.2)" }}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5" />
        </div>

      </motion.div>

      {/* Letter View Modal (Similar to Teacher Message style) */}
      <AnimatePresence>
        {selectedComment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedComment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
              className="w-full max-w-sm bg-card rounded-3xl p-8 text-center relative overflow-hidden border border-border shadow-lg"
            >
              {/* Decorative Background - Keep for visual effect */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary blur-[80px]" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-accent blur-[60px]" />
              </div>

              <button
                onClick={() => setSelectedComment(null)}
                aria-label="Close letter"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors z-20 text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mx-auto">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                
                <p className="text-lg text-foreground italic leading-relaxed font-serif px-2">
                  &ldquo;{selectedComment.text}&rdquo; 
                </p>
                
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-bold text-foreground">-{selectedComment.author}-</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{selectedComment.time}</p>
                </div>
              </div>
            </motion.div>
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
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowComments(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
              className="w-full max-w-md bg-card rounded-3xl p-6 relative overflow-hidden border border-border shadow-lg"
            >
              {/* Decorative Background - Keep for visual effect */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary blur-[80px]" />
                <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-accent blur-[60px]" />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground font-serif">Захидал бичих</h3>
                      <p className="text-xs text-muted-foreground font-sans">{member.name}-д зориулж</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowComments(false)}
                    aria-label="Close write letter" 
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Сэтгэлийн үгээ энд бичнэ үү..."
                    className="bg-input border-border min-h-[180px] text-sm resize-none rounded-2xl focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                  />
                  
                  <Button 
                    onClick={() => {
                      handleComment();
                      setShowComments(false);
                    }}
                    disabled={!newComment.trim()}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20" 
                  >
                    <Send className="w-4 h-4 mr-2" />
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
    <div className="grid grid-cols-1 gap-4">
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
