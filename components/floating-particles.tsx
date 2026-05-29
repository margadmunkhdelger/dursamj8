"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
  opacity: number
}

const noPointer = { pointerEvents: "none" as const }

export function FloatingParticles({ count = 150 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5, 
        delay: Math.random() * 10,
        duration: Math.random() * 5 + 5, // Удаан хөдөлгөөнтэй тоос мэт
        opacity: Math.random() * 0.2 + 0.1, // Маш бүдэг
      }))
    )
  }, [count])

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{ ...noPointer, background: "var(--background)" }}
      aria-hidden
    >
      {/* Vintage Paper Texture / Noise */}
      <div 
        className="absolute inset-0 opacity-[0.4] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/pinstriped-suit.png"), radial-gradient(circle at center, transparent 0%, rgba(180,140,100,0.1) 100%)`,
        }}
      />

      {/* Floating Dust Motes */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id} 
          className="absolute rounded-full bg-powder-blue/50 pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            ...noPointer,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Soft Sepia Glows */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-full h-full rounded-full bg-powder-blue/40 blur-[120px] pointer-events-none opacity-60"
        style={noPointer}
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} 
      />
      <motion.div
        className="absolute -bottom-[20%] -right-[10%] w-full h-full rounded-full bg-royal-blue/30 blur-[100px] pointer-events-none opacity-50"
        style={noPointer}
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  )
}
