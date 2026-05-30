"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Pencil, Save, GraduationCap } from "lucide-react"
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
    
    // Дугтуйн таг нээгдсэний дараа шууд захианы агуулгыг харуулна
    setTimeout(() => {
      setAnimationPhase('open')
    }, 800)
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
      className="bg-card rounded-2xl min-h-[280px] flex items-center justify-center relative overflow-hidden shadow-lg mx-auto w-full max-w-lg border border-border p-4 py-4 sm:py-6"
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
              className="w-full h-full flex items-center justify-center cursor-pointer group disabled:cursor-wait outline-none"
            >
              {/* Envelope Body */}
              <motion.div
                className="relative w-full max-w-[380px] h-[240px] bg-[#14213d] rounded-sm shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5),inset_0_-2px_10px_rgba(0,0,0,0.3)] overflow-hidden border border-white/5"
                whileHover={animationPhase === 'closed' ? { y: -8, scale: 1.02 } : {}}
                animate={{ 
                  scale: animationPhase !== 'closed' ? 1.03 : 1,
                  opacity: 1,
                  y: 0
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* 3D Fold Effects with Seam Definition */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Bottom Part */}
                  <div className="absolute inset-0 z-10" style={{ 
                    clipPath: "polygon(0 100%, 50% 50%, 100% 100%)",
                    background: "linear-gradient(to top, #0f1a2e, #14213d)"
                  }} />
                  
                  {/* Left Flap */}
                  <div className="absolute inset-0 z-10" style={{ 
                    clipPath: "polygon(0 0, 50% 50%, 0 100%)",
                    background: "#182640"
                  }} />
                  
                  {/* Right Flap */}
                  <div className="absolute inset-0 z-10" style={{ 
                    clipPath: "polygon(100% 0, 50% 50%, 100% 100%)",
                    background: "#182640"
                  }} />

                  {/* Top Flap (Opening Animation) */}
                  <motion.div 
                    className="absolute inset-0 z-30 origin-top shadow-xl" 
                    initial={{ rotateX: 0 }}
                    animate={animationPhase !== 'closed' ? { 
                      rotateX: -180,
                      transition: { duration: 0.7, ease: "easeInOut" }
                    } : {}}
                    style={{ 
                      clipPath: "polygon(0 0, 100% 0, 50% 50%)", 
                      background: "linear-gradient(to bottom, #223147, #1c2a43)", 
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                      borderBottom: "1px solid rgba(0,0,0,0.2)"
                    }} 
                  />
                  
                  {/* Soft Internal Shadow for 3D feel */}
                  <div className="absolute inset-0 z-[15] shadow-[inset_0_0_100px_rgba(0,0,0,0.4)]" />
                </div>

                {/* Content Overlay (Seal and Label) */}
                <div className="absolute inset-0 z-40 flex items-center justify-center">
                  {/* Wax Seal */}
                  <motion.div 
                    className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 z-50"
                    initial={{ scale: 1 }}
                    animate={animationPhase !== 'closed' ? {
                      scale: 0,
                      opacity: 0,
                      rotate: 15,
                    } : { scale: 1.1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#f8e4b3] via-[#d4af37] to-[#8b6914] shadow-[0_12px_25px_rgba(0,0,0,0.4),inset_0_2px_5px_rgba(255,255,255,0.6)]" />
                    <div className="absolute inset-2 rounded-full border border-amber-900/30" />
                    <GraduationCap className="w-8 h-8 text-[#1a2b4c] relative z-10 drop-shadow-sm" />
                  </motion.div>

                  {/* Label */}
                  <motion.div 
                    className="absolute bottom-6 left-0 right-0 pointer-events-none flex justify-center"
                    animate={animationPhase !== 'closed' ? { opacity: 0, y: 20 } : {}}
                    transition={{ duration: 0.3 }}
                  >
                     <p className="font-script text-[#f5d17a] text-2xl sm:text-3xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] select-none tracking-wider whitespace-nowrap">
                       Багшийн захиас
                     </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="open-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full flex flex-col text-left"
          > 
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

            <div className="relative flex items-center justify-between mb-6 border-b border-stone-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f8e4b3] to-[#d4af37] flex items-center justify-center shadow-sm">
                  <GraduationCap className="w-5 h-5 text-[#1a2b4c]" />
                </div>
                <h3 className="text-2xl sm:text-3xl text-[#1a2b4c] font-script leading-none pt-1">Багшийн захиас</h3>
              </div>

              <div className="flex items-center gap-2">
                {isTeacher && !isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors shadow-sm"
                    title="Засах"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleClose} 
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-500 transition-colors shadow-sm"
                  title="Хаах"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="relative z-10 flex-1 flex flex-col">
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
                className="py-4 border-y border-stone-200/60 px-2"
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
                className="text-sm font-bold text-[#1f2d5a] uppercase tracking-widest pt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                - {teacherName} -
              </motion.p>
            )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Luxury Cream Paper Texture */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
    </motion.div>
  )
}
