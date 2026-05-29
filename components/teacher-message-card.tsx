"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Mail, X, Pencil, Save, GraduationCap } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface TeacherMessageCardProps {
  teacherName: string
  message: string
  isTeacher?: boolean
  onUpdate?: (message: string) => void
}

// Celebration particle component - Fireworks burst effect
interface Particle {
  id: number
  emoji: string
  angle: number
  distance: number
  rotation: number
  scale: number
  delay: number
}

const CELEBRATION_EMOJIS = ["❤️", "⭐", "🚀", "✨", "💫", "🎉", "🌟", "💖", "🎊", "💝", "🎓", "📚", "🏆", "👏"]

export function TeacherMessageCard({ teacherName, message, isTeacher, onUpdate }: TeacherMessageCardProps) {
  const [animationPhase, setAnimationPhase] = useState<'closed' | 'opening' | 'letter-rising' | 'open'>('closed')
  const [particles, setParticles] = useState<Particle[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(message)

  const createParticles = useCallback(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2 + Math.random() * 0.5
      newParticles.push({
        id: i,
        emoji: CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)],
        angle: angle,
        distance: 150 + Math.random() * 200,
        rotation: Math.random() * 720 - 360,
        scale: 1 + Math.random() * 1.5,
        delay: Math.random() * 0.15,
      })
    }
    setParticles(newParticles)
  }, [])

  const handleOpen = () => {
    if (animationPhase !== 'closed') return
    
    setAnimationPhase('opening')
    createParticles()
    
    // Envelope opens, seal breaks
    setTimeout(() => {
      setAnimationPhase('letter-rising')
    }, 500)
    
    // Letter rises and envelope fades - then show final state
    setTimeout(() => {
      setAnimationPhase('open')
    }, 1200)
  }

  const handleClose = () => {
    setAnimationPhase('closed')
    setIsEditing(false)
    setParticles([])
  }

  useEffect(() => {
    setEditValue(message)
  }, [message])

  const handleSave = () => {
    onUpdate?.(editValue)
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }} 
      className="bg-[#f6f1eb] rounded-[28px] p-6 py-8 relative overflow-x-hidden shadow-[0_15px_40px_rgba(0,0,0,0.12)] mx-auto w-full max-w-md"
    >
      {/* Celebration Particles - Fireworks Burst Effect */}
      <AnimatePresence>
        {particles.map((particle) => {
          const targetX = Math.cos(particle.angle) * particle.distance
          const targetY = Math.sin(particle.angle) * particle.distance
          return (
            <motion.div
              key={particle.id}
              initial={{ 
                opacity: 1, 
                x: 0, 
                y: 0, 
                scale: 0,
                rotate: 0 
              }}
              animate={{ 
                opacity: 0,
                x: targetX,
                y: targetY,
                scale: particle.scale,
                rotate: particle.rotation
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 1.8,
                delay: particle.delay,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="absolute left-1/2 top-1/2 text-4xl pointer-events-none z-[100]"
              style={{ 
                marginLeft: "-0.75rem", 
                marginTop: "-0.75rem",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
              }}
            >
              {particle.emoji}
            </motion.div>
          )
        })}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {animationPhase !== 'open' ? (
          <motion.div
            key="envelope-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full relative z-10"
          >
            <motion.button
              onClick={handleOpen}
              disabled={animationPhase !== 'closed'}
              className="w-full flex flex-col items-center justify-center text-center space-y-8 cursor-pointer text-foreground group disabled:cursor-wait"
            >
              {/* Envelope Container */}
              <motion.div
                className="w-full aspect-[5/3.6] relative envelope-container px-2"
                whileHover={animationPhase === 'closed' ? { y: -8, scale: 1.02 } : {}}
                animate={{ 
                  scale: animationPhase !== 'closed' ? 1.03 : 1,
                  opacity: animationPhase === 'letter-rising' ? 0 : 1,
                  y: animationPhase === 'letter-rising' ? 40 : 0
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Physical Depth Shadows */}
                <div className="absolute inset-x-4 bottom-0 h-4 bg-black/40 blur-xl translate-y-4 scale-95 rounded-[50%]" />
                
                {/* Envelope Body with Fold Layers */}
                <div className="absolute inset-0 luxury-envelope-texture rounded-lg overflow-hidden shadow-2xl border border-white/5">
                  {/* Side Flaps (Triangular) */}
                  <div 
                    className="absolute inset-0 opacity-40" 
                    style={{ 
                      clipPath: "polygon(0% 0%, 50% 50%, 0% 100%)", 
                      background: "linear-gradient(to right, rgba(0,0,0,0.3), transparent)" 
                    }} 
                  />
                  <div 
                    className="absolute inset-0 opacity-40" 
                    style={{ 
                      clipPath: "polygon(100% 0%, 50% 50%, 100% 100%)", 
                      background: "linear-gradient(to left, rgba(0,0,0,0.3), transparent)" 
                    }} 
                  />
                  
                  {/* Bottom Flap (Triangular) */}
                  <div 
                    className="absolute inset-0 opacity-60" 
                    style={{ 
                      clipPath: "polygon(0% 100%, 50% 50%, 100% 100%)", 
                      background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                      borderTop: "0.5px solid rgba(255,255,255,0.05)" 
                    }} 
                  />

                  {/* Top Flap (Opening Animation) */}
                  <motion.div 
                    className="absolute inset-0 z-10 origin-top" 
                    initial={{ rotateX: 0 }}
                    animate={animationPhase !== 'closed' ? { 
                      rotateX: -180,
                      transition: { duration: 0.7, ease: "easeInOut" }
                    } : {}}
                    style={{ 
                      clipPath: "polygon(0% 0%, 50% 50%, 100% 0%)", 
                      background: "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(0,0,0,0.25))", 
                      filter: "brightness(1.1)", 
                      borderBottom: "1px solid rgba(0,0,0,0.4)",
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden"
                    }} 
                  />

                  {/* Realistic Gold Wax Seal with Break Animation */}
                  <motion.div 
                    className="absolute w-16 h-16 rounded-full wax-seal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 shadow-2xl flex items-center justify-center border border-white/20"
                    initial={{ scale: 1.1 }}
                    animate={animationPhase !== 'closed' ? {
                      scale: 0,
                      opacity: 0,
                      rotate: 15,
                    } : { scale: 1.1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                     <GraduationCap className="w-8 h-8 text-[#1f2d5a]/30 fill-current opacity-70" strokeWidth={1.5} />
                  </motion.div>

                  {/* Elegant Handwritten Label */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 z-30 pointer-events-none"
                    animate={animationPhase !== 'closed' ? { opacity: 0, y: 20 } : {}}
                    transition={{ duration: 0.3 }}
                  >
                     <p className="font-serif font-bold text-[#c9a45c] text-xl sm:text-2xl drop-shadow-sm select-none uppercase tracking-tight">
                       Багшийн захиас
                     </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.button>

            {/* Letter Rising - positioned outside envelope, stays visible */}
            <AnimatePresence>
              {animationPhase === 'letter-rising' && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-6 top-8 bottom-8 z-50 pointer-events-none"
                >
                  <div className="w-full h-full bg-gradient-to-b from-[#fffef9] to-[#f5f3ed] rounded-lg shadow-2xl border border-stone-200/60 relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <p className="text-stone-600 text-base italic leading-relaxed font-serif text-center px-2">
                        &ldquo;{message.slice(0, 120)}{message.length > 120 ? '...' : ''}&rdquo;
                      </p>
                      <p className="text-sm text-stone-400 mt-4 font-medium">- {teacherName}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="open-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 space-y-3 text-center"
          > 
            <motion.div 
              className="flex items-center justify-between mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-left">
                <motion.div 
                  className="w-10 h-10 rounded-full bg-[#1f2d5a]/10 flex items-center justify-center border border-[#1f2d5a]/20"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <Mail className="w-5 h-5 text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-foreground font-serif">Багшийн захиас</h3>
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest">{teacherName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isTeacher && !isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 rounded-full bg-[#1f2d5a]/5 text-[#1f2d5a]/60 hover:bg-[#1f2d5a]/10 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={handleClose} 
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-200/50 text-stone-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
            
            {isEditing ? (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Textarea 
                  value={editValue} 
                  onChange={(e) => setEditValue(e.target.value)} 
                  className="bg-white/50 border-stone-200 min-h-[160px] text-sm resize-none text-stone-800 placeholder:text-stone-400 rounded-2xl focus:ring-primary/20"
                />
                <Button onClick={handleSave} className="w-full h-12 bg-primary hover:bg-primary/90 font-bold rounded-xl shadow-lg shadow-primary/20">
                  <Save className="w-4 h-4 mr-2" />
                  Өөрчлөлтийг хадгалах
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                className="py-6 border-y border-stone-200/60 px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-lg text-stone-700 italic leading-relaxed font-serif">
                  &ldquo;{message}&rdquo;
                </p>
              </motion.div>
            )}
            {!isEditing && (
              <motion.p 
                className="text-sm font-bold text-[#1f2d5a] uppercase tracking-widest pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                - {teacherName} -
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Luxury Cream Paper Texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
    </motion.div>
  )
}
